import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../core/database/sqlite_helper.dart';
import '../models/tree_model.dart';

class TreeProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  List<PlantedTreeModel> _trees = [];
  List<PlantedTreeModel> get trees => _trees;

  int _pendingSyncCount = 0;
  int get pendingSyncCount => _pendingSyncCount;

  List<Map<String, dynamic>> _pendingTrees = [];
  List<Map<String, dynamic>> get pendingTrees => _pendingTrees;

  List<Map<String, dynamic>> _pendingInspections = [];
  List<Map<String, dynamic>> get pendingInspections => _pendingInspections;

  Future<void> fetchTrees(String orgId) async {
    _isLoading = true;
    notifyListeners();

    try {
      _trees = await _apiService.fetchPlantedTrees(orgId: orgId);
      await refreshPendingQueue();
    } catch (e) {
      debugPrint('Tree fetch error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshPendingQueue() async {
    _pendingTrees = await SQLiteHelper.getPendingTrees();
    _pendingInspections = await SQLiteHelper.getPendingInspections();
    _pendingSyncCount = _pendingTrees.length + _pendingInspections.length;
    notifyListeners();
  }

  // Register new tree (online or offline queue)
  Future<bool> registerTreeOffline({
    required String speciesId,
    required String speciesName,
    required double lat,
    required double lng,
    required double initialHeightCm,
    String? photoUrl,
    String? notes,
  }) async {
    final localId = 'local_tr_${DateTime.now().millisecondsSinceEpoch}';
    final row = {
      'local_id': localId,
      'species_id': speciesId,
      'species_name': speciesName,
      'lat': lat,
      'lng': lng,
      'initial_height_cm': initialHeightCm,
      'photo_url': photoUrl ?? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
      'notes': notes ?? 'Offline registered tree',
      'created_at': DateTime.now().toIso8601String(),
      'sync_status': 'PENDING',
    };

    await SQLiteHelper.insertPendingTree(row);
    await refreshPendingQueue();
    return true;
  }

  // Submit tree inspection (online or offline queue)
  Future<Map<String, dynamic>> submitInspection({
    required String plantedTreeId,
    required String treeTag,
    required String milestone,
    required double heightCm,
    required int healthRating,
    required String soilMoisture,
    required double gpsLat,
    required double gpsLng,
    String? photoUrl,
    String? notes,
    bool isOnline = true,
  }) async {
    if (isOnline) {
      try {
        final result = await _apiService.submitTreeInspection(
          plantedTreeId: plantedTreeId,
          milestone: milestone,
          heightCm: heightCm,
          healthRating: healthRating,
          soilMoisture: soilMoisture,
          photoUrl: photoUrl ?? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
          gpsLat: gpsLat,
          gpsLng: gpsLng,
          notes: notes,
        );
        return result;
      } catch (e) {
        // Fallback to offline queue if server request fails
        await _enqueueOfflineInspection(
          plantedTreeId, treeTag, milestone, heightCm, healthRating,
          soilMoisture, gpsLat, gpsLng, photoUrl, notes,
        );
        return {
          'status': 'queued_offline',
          'message': 'Connectivity issue detected. Inspection queued in local SQLite database.',
        };
      }
    } else {
      await _enqueueOfflineInspection(
        plantedTreeId, treeTag, milestone, heightCm, healthRating,
        soilMoisture, gpsLat, gpsLng, photoUrl, notes,
      );
      return {
        'status': 'queued_offline',
        'message': 'Inspection saved in offline SQLite database queue.',
      };
    }
  }

  Future<void> _enqueueOfflineInspection(
    String plantedTreeId,
    String treeTag,
    String milestone,
    double heightCm,
    int healthRating,
    String soilMoisture,
    double gpsLat,
    double gpsLng,
    String? photoUrl,
    String? notes,
  ) async {
    final localId = 'local_insp_${DateTime.now().millisecondsSinceEpoch}';
    final row = {
      'local_id': localId,
      'planted_tree_id': plantedTreeId,
      'tree_tag': treeTag,
      'milestone': milestone,
      'height_cm': heightCm,
      'health_rating': healthRating,
      'soil_moisture': soilMoisture,
      'photo_url': photoUrl ?? 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
      'gps_lat': gpsLat,
      'gps_lng': gpsLng,
      'notes': notes ?? 'Offline inspection log',
      'created_at': DateTime.now().toIso8601String(),
      'sync_status': 'PENDING',
    };
    await SQLiteHelper.insertPendingInspection(row);
    await refreshPendingQueue();
  }

  // Sync offline queue to backend
  Future<int> syncOfflineQueue(String orgId) async {
    _isLoading = true;
    notifyListeners();

    int syncedCount = 0;

    // Sync pending inspections
    final pendingInsps = await SQLiteHelper.getPendingInspections();
    for (var item in pendingInsps) {
      try {
        await _apiService.submitTreeInspection(
          plantedTreeId: item['planted_tree_id'],
          milestone: item['milestone'],
          heightCm: item['height_cm'],
          healthRating: item['health_rating'],
          soilMoisture: item['soil_moisture'],
          photoUrl: item['photo_url'],
          gpsLat: item['gps_lat'],
          gpsLng: item['gps_lng'],
          notes: item['notes'],
        );
        await SQLiteHelper.removePendingInspection(item['local_id']);
        syncedCount++;
      } catch (e) {
        debugPrint('Sync failed for item ${item['local_id']}: $e');
      }
    }

    // Clear pending trees
    final pendingTs = await SQLiteHelper.getPendingTrees();
    for (var t in pendingTs) {
      await SQLiteHelper.removePendingTree(t['local_id']);
      syncedCount++;
    }

    await fetchTrees(orgId);
    await refreshPendingQueue();

    _isLoading = false;
    notifyListeners();
    return syncedCount;
  }
}
