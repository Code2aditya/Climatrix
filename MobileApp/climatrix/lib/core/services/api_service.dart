import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import '../../models/user_model.dart';
import '../../models/ward_model.dart';
import '../../models/species_model.dart';
import '../../models/tree_model.dart';
import '../../models/cooling_model.dart';
import '../../models/pilot_model.dart';

class ApiService {
  final http.Client _client = http.Client();

  String _getBaseUrl() {
    if (Platform.isAndroid) {
      return ApiConfig.baseUrl; // 10.0.2.2 for Android emulator
    }
    return ApiConfig.fallbackBaseUrl; // localhost / 127.0.0.1
  }

  // Helper GET request
  Future<dynamic> _get(String path) async {
    final url = Uri.parse('${_getBaseUrl()}$path');
    try {
      final response = await _client.get(url).timeout(const Duration(seconds: 8));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('API Error [${response.statusCode}]: ${response.body}');
      }
    } catch (e) {
      // If primary failed on physical device or desktop, try fallback
      final fallbackUrl = Uri.parse('${ApiConfig.fallbackBaseUrl}$path');
      try {
        final res = await _client.get(fallbackUrl).timeout(const Duration(seconds: 5));
        if (res.statusCode == 200) {
          return jsonDecode(res.body);
        }
      } catch (_) {}
      rethrow;
    }
  }

  // Helper POST request
  Future<dynamic> _post(String path, Map<String, dynamic> body) async {
    final url = Uri.parse('${_getBaseUrl()}$path');
    try {
      final response = await _client.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      ).timeout(const Duration(seconds: 12));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('API Error [${response.statusCode}]: ${response.body}');
      }
    } catch (e) {
      rethrow;
    }
  }

  // 1. Pilot Info & Health
  Future<PilotInfoModel> fetchPilotInfo() async {
    final data = await _get(ApiConfig.pilotInfo);
    return PilotInfoModel.fromJson(data);
  }

  Future<RealtimeWeatherModel> fetchRealtimeWeather() async {
    final data = await _get(ApiConfig.realtimeWeather);
    return RealtimeWeatherModel.fromJson(data);
  }

  // 2. Tenants & Organisations
  Future<List<TenantModel>> fetchTenants() async {
    final List list = await _get(ApiConfig.tenants);
    return list.map((item) => TenantModel.fromJson(item)).toList();
  }

  // 3. Wards & ABAC Protected Spatial Data
  Future<List<WardModel>> fetchWards({String? orgId}) async {
    String path = ApiConfig.wards;
    if (orgId != null && orgId.isNotEmpty) {
      path += '?org_id=$orgId';
    }
    final List list = await _get(path);
    return list.map((item) => WardModel.fromJson(item)).toList();
  }

  Future<Map<String, dynamic>> fetchSecureWardDetails({
    required String locationId,
    required String orgId,
  }) async {
    final path = '${ApiConfig.secureWardDetails}/$locationId/secure-details?org_id=$orgId';
    return await _get(path);
  }

  // 4. Species Catalog & AI Suitability Engine
  Future<List<SpeciesModel>> fetchSpeciesCatalog() async {
    final List list = await _get(ApiConfig.species);
    return list.map((item) => SpeciesModel.fromJson(item)).toList();
  }

  Future<List<SpeciesRecommendationResult>> recommendSpecies({
    String soilType = "Alluvial Sandy-Loam",
    double roadWidthMeters = 6.0,
    double groundwaterDepthMeters = 20.0,
    String siteType = "ROADSIDE_STRIP",
  }) async {
    final body = {
      "soil_type": soilType,
      "road_width_meters": roadWidthMeters,
      "groundwater_depth_meters": groundwaterDepthMeters,
      "site_type": siteType,
    };
    final List list = await _post(ApiConfig.recommendSpecies, body);
    return list.map((item) => SpeciesRecommendationResult.fromJson(item)).toList();
  }

  Future<Map<String, dynamic>> getLlmDecision({
    String wardId = "ward-14",
    String customPrompt = "Evaluate Rainak Bazaar for extreme 48C summer heat intervention",
    double roadWidthMeters = 6.0,
    double groundwaterDepthMeters = 20.0,
    String siteType = "ROADSIDE_STRIP",
  }) async {
    final body = {
      "ward_id": wardId,
      "custom_prompt": customPrompt,
      "road_width_meters": roadWidthMeters,
      "groundwater_depth_meters": groundwaterDepthMeters,
      "site_type": siteType,
    };
    return await _post(ApiConfig.llmDecision, body);
  }

  // 5. Alternative Cooling Interventions
  Future<List<CoolingRecommendationModel>> fetchCoolingRecommendations({String? locationId}) async {
    String path = ApiConfig.coolingRecommendations;
    if (locationId != null && locationId.isNotEmpty) {
      path += '?location_id=$locationId';
    }
    final List list = await _get(path);
    return list.map((item) => CoolingRecommendationModel.fromJson(item)).toList();
  }

  // 6. Trees & Inspections
  Future<List<PlantedTreeModel>> fetchPlantedTrees({String? orgId}) async {
    String path = ApiConfig.trees;
    if (orgId != null && orgId.isNotEmpty) {
      path += '?org_id=$orgId';
    }
    final List list = await _get(path);
    return list.map((item) => PlantedTreeModel.fromJson(item)).toList();
  }

  Future<Map<String, dynamic>> submitTreeInspection({
    required String plantedTreeId,
    String inspectorName = "Field Auditor",
    String milestone = "MONTH_6",
    required double heightCm,
    int healthRating = 4,
    String soilMoisture = "OPTIMAL",
    String photoUrl = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
    required double gpsLat,
    required double gpsLng,
    String? notes,
  }) async {
    final body = {
      "planted_tree_id": plantedTreeId,
      "inspector_name": inspectorName,
      "inspection_milestone": milestone,
      "current_height_cm": heightCm,
      "health_rating": healthRating,
      "soil_moisture_condition": soilMoisture,
      "watering_photo_url": photoUrl,
      "gps_lat": gpsLat,
      "gps_lng": gpsLng,
      "notes": notes ?? "Field audit logged via mobile client.",
    };
    return await _post(ApiConfig.inspections, body);
  }
}
