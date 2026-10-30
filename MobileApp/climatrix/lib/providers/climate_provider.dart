import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../models/ward_model.dart';
import '../models/cooling_model.dart';
import '../models/pilot_model.dart';

class ClimateProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  PilotInfoModel? _pilotInfo;
  PilotInfoModel? get pilotInfo => _pilotInfo;

  RealtimeWeatherModel? _weather;
  RealtimeWeatherModel? get weather => _weather;

  List<WardModel> _wards = [];
  List<WardModel> get wards => _wards;

  WardModel? _selectedWard;
  WardModel? get selectedWard => _selectedWard;

  List<CoolingRecommendationModel> _coolingRecommendations = [];
  List<CoolingRecommendationModel> get coolingRecommendations => _coolingRecommendations;

  String? _abacErrorMessage;
  String? get abacErrorMessage => _abacErrorMessage;

  Future<void> fetchDashboardData(String orgId) async {
    _isLoading = true;
    _abacErrorMessage = null;
    notifyListeners();

    try {
      _pilotInfo = await _apiService.fetchPilotInfo();
      _weather = await _apiService.fetchRealtimeWeather();
      _wards = await _apiService.fetchWards(orgId: orgId);

      if (_wards.isNotEmpty) {
        _selectedWard = _wards.first;
      }

      _coolingRecommendations = await _apiService.fetchCoolingRecommendations();
    } catch (e) {
      debugPrint('Climate fetch error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> attemptAccessWard(WardModel ward, String orgId) async {
    _abacErrorMessage = null;

    if (!ward.isLicensed) {
      _abacErrorMessage =
          "ABAC Security Gate: Your organisation does not hold an active geographical license for ${ward.name}. Access denied by backend security.";
      notifyListeners();
      return;
    }

    try {
      final secureData = await _apiService.fetchSecureWardDetails(
        locationId: ward.id,
        orgId: orgId,
      );
      _selectedWard = ward;
    } catch (e) {
      _abacErrorMessage = e.toString().contains('403')
          ? "ABAC Security Gate: Cross-ward access forbidden."
          : e.toString();
    }
    notifyListeners();
  }
}
