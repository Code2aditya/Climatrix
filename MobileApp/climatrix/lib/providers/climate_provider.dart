import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../models/ward_model.dart';
import '../models/cooling_model.dart';
import '../models/pilot_model.dart';

final List<WardModel> SEED_WARDS = [
  WardModel(
    id: "ward-04",
    name: "Ward 4 - Model Town & Lajpat Nagar",
    code: "JAL-WARD-04",
    lat: 31.3090,
    lng: 75.5810,
    areaSqkm: 3.8,
    populationDensity: 6200,
    coordinates: [[75.572, 31.301], [75.590, 31.301], [75.590, 31.317], [75.572, 31.317], [75.572, 31.301]],
    description: "Planned residential suburb with moderate canopy, wide avenues, and high plantation capacity.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 38.2,
      maxLstCelsius: 41.0,
      meanNdvi: 0.32,
      meanNdbi: -0.05,
      hotspotSeverity: "MODERATE",
      vulnerabilityRank: 14,
      heatIslandIntensity: 1.7,
    ),
  ),
  WardModel(
    id: "ward-14",
    name: "Ward 14 - Rainak Bazaar & Jyoti Chowk",
    code: "JAL-WARD-14",
    lat: 31.3255,
    lng: 75.5750,
    areaSqkm: 1.9,
    populationDensity: 18500,
    coordinates: [[75.568, 31.320], [75.582, 31.320], [75.582, 31.331], [75.568, 31.331], [75.568, 31.320]],
    description: "Ultra-dense historic commercial bazaar. Severe heat trap. Underground utilities prevent ground trees. High priority for Cool Roofs.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 47.8,
      maxLstCelsius: 50.6,
      meanNdvi: 0.07,
      meanNdbi: 0.44,
      hotspotSeverity: "CRITICAL",
      vulnerabilityRank: 1,
      heatIslandIntensity: 11.3,
    ),
  ),
  WardModel(
    id: "ward-18",
    name: "Ward 18 - Phagwara Gate & Attari Bazaar",
    code: "JAL-WARD-18",
    lat: 31.3280,
    lng: 75.5830,
    areaSqkm: 2.1,
    populationDensity: 16200,
    coordinates: [[75.577, 31.322], [75.589, 31.322], [75.589, 31.334], [75.577, 31.334], [75.577, 31.322]],
    description: "Electronics and wholesale market. Metal canopies and asphalt paving. Recommended for tensile shade sails and cool pavements.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 46.9,
      maxLstCelsius: 49.7,
      meanNdvi: 0.08,
      meanNdbi: 0.39,
      hotspotSeverity: "CRITICAL",
      vulnerabilityRank: 2,
      heatIslandIntensity: 10.4,
    ),
  ),
  WardModel(
    id: "ward-22",
    name: "Ward 22 - Industrial Focal Point",
    code: "JAL-WARD-22",
    lat: 31.3520,
    lng: 75.5450,
    areaSqkm: 6.5,
    populationDensity: 4100,
    coordinates: [[75.535, 31.342], [75.555, 31.342], [75.555, 31.362], [75.535, 31.362], [75.535, 31.342]],
    description: "Heavy manufacturing hub with boiler emissions. Ideal for boundary buffer plantations of Neem and Kikar.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 48.4,
      maxLstCelsius: 51.2,
      meanNdvi: 0.05,
      meanNdbi: 0.48,
      hotspotSeverity: "CRITICAL",
      vulnerabilityRank: 3,
      heatIslandIntensity: 11.9,
    ),
  ),
  WardModel(
    id: "ward-28",
    name: "Ward 28 - Leather Complex & Transport Nagar",
    code: "JAL-WARD-28",
    lat: 31.3410,
    lng: 75.5320,
    areaSqkm: 5.4,
    populationDensity: 4800,
    coordinates: [[75.520, 31.330], [75.544, 31.330], [75.544, 31.350], [75.520, 31.350], [75.520, 31.330]],
    description: "Industrial tanning and freight corridor. Extreme daytime surface heating. High priority for air pollution filtering trees.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 47.2,
      maxLstCelsius: 50.1,
      meanNdvi: 0.06,
      meanNdbi: 0.42,
      hotspotSeverity: "CRITICAL",
      vulnerabilityRank: 4,
      heatIslandIntensity: 10.7,
    ),
  ),
  WardModel(
    id: "ward-37",
    name: "Ward 37 - Basti Sheikh & Guzan",
    code: "JAL-WARD-37",
    lat: 31.3180,
    lng: 75.5520,
    areaSqkm: 3.2,
    populationDensity: 14200,
    coordinates: [[75.542, 31.310], [75.562, 31.310], [75.562, 31.326], [75.542, 31.326], [75.542, 31.310]],
    description: "Dense residential settlements with narrow alleys. Suitable for compact non-invasive species (Kachnar) and pocket green spaces.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 44.5,
      maxLstCelsius: 47.3,
      meanNdvi: 0.11,
      meanNdbi: 0.28,
      hotspotSeverity: "HIGH",
      vulnerabilityRank: 5,
      heatIslandIntensity: 8.0,
    ),
  ),
  WardModel(
    id: "ward-44",
    name: "Ward 44 - Basti Nau & Sports Market",
    code: "JAL-WARD-44",
    lat: 31.3210,
    lng: 75.5630,
    areaSqkm: 2.8,
    populationDensity: 15100,
    coordinates: [[75.555, 31.314], [75.571, 31.314], [75.571, 31.328], [75.555, 31.328], [75.555, 31.314]],
    description: "Famous sports goods manufacturing cluster. Dense workshop roofs and narrow access corridors. Recommended for green roofs.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 44.1,
      maxLstCelsius: 46.8,
      meanNdvi: 0.12,
      meanNdbi: 0.29,
      hotspotSeverity: "HIGH",
      vulnerabilityRank: 6,
      heatIslandIntensity: 7.6,
    ),
  ),
  WardModel(
    id: "ward-55",
    name: "Ward 55 - Rama Mandi Corridor",
    code: "JAL-WARD-55",
    lat: 31.3160,
    lng: 75.6180,
    areaSqkm: 4.8,
    populationDensity: 9500,
    coordinates: [[75.605, 31.305], [75.631, 31.305], [75.631, 31.327], [75.605, 31.305], [75.605, 31.305]],
    description: "Major transit and highway junction with high particulate pollution. Suitable for avenue multi-tier shelterbelts of Tahli and Arjun.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 43.1,
      maxLstCelsius: 45.9,
      meanNdvi: 0.16,
      meanNdbi: 0.21,
      hotspotSeverity: "HIGH",
      vulnerabilityRank: 7,
      heatIslandIntensity: 6.6,
    ),
  ),
  WardModel(
    id: "ward-68",
    name: "Ward 68 - GNDU Regional Campus",
    code: "JAL-WARD-68",
    lat: 31.2950,
    lng: 75.6020,
    areaSqkm: 5.2,
    populationDensity: 5800,
    coordinates: [[75.590, 31.285], [75.614, 31.285], [75.614, 31.305], [75.590, 31.305], [75.590, 31.285]],
    description: "Academic campus and planned sector. Serves as reference urban cooling lung for Jalandhar.",
    isLicensed: true,
    heatAnalysis: HeatAnalysisModel(
      meanLstCelsius: 37.4,
      maxLstCelsius: 40.2,
      meanNdvi: 0.36,
      meanNdbi: -0.09,
      hotspotSeverity: "LOW",
      vulnerabilityRank: 18,
      heatIslandIntensity: 0.9,
    ),
  ),
];

class ClimateProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  PilotInfoModel? _pilotInfo = PilotInfoModel(
    city: "Jalandhar",
    state: "Punjab",
    country: "India",
    lat: 31.3260,
    lng: 75.5762,
    wardsCount: 80,
    speciesCatalogCount: 12,
    plantedTreesMonitored: 120,
    criticalChallenges: [
      "Severe Urban Heat Island effect with summer surface temperatures exceeding 48°C",
      "Depleting groundwater tables requiring drought-resilient native species",
      "Dense commercial bazaars (e.g. Rainak Bazaar) requiring alternative cool roofs and shade structures",
      "Lack of post-plantation monitoring leading to high sapling mortality"
    ],
  );
  PilotInfoModel? get pilotInfo => _pilotInfo;

  RealtimeWeatherModel? _weather = RealtimeWeatherModel(
    city: "Jalandhar",
    status: "SEED_BASELINE_FEED",
    ambientTemperatureCelsius: 38.5,
    windSpeedKmh: 14.2,
    windDirectionDegrees: 120.0,
    weatherCode: 0,
    heatIndexCelsius: 42.1,
    relativeHumidityPct: 48,
    radarTimestamp: DateTime.now().toIso8601String(),
    radarTileTemplate: "https://tilecache.rainviewer.com/v2/radar/1690000000/256/{z}/{x}/{y}/2/1_1.png",
  );
  RealtimeWeatherModel? get weather => _weather;

  List<WardModel> _wards = List.from(SEED_WARDS);
  List<WardModel> get wards => _wards;

  WardModel? _selectedWard = SEED_WARDS[1]; // Ward 14 Rainak Bazaar default
  WardModel? get selectedWard => _selectedWard;

  List<CoolingRecommendationModel> _coolingRecommendations = [];
  List<CoolingRecommendationModel> get coolingRecommendations => _coolingRecommendations;

  String? _abacErrorMessage;
  String? get abacErrorMessage => _abacErrorMessage;

  ClimateProvider() {
    if (_wards.isNotEmpty) {
      _selectedWard = _wards[1];
    }
  }

  Future<void> fetchDashboardData(String orgId) async {
    _isLoading = true;
    _abacErrorMessage = null;
    notifyListeners();

    try {
      final info = await _apiService.fetchPilotInfo();
      _pilotInfo = info;
    } catch (_) {}

    try {
      final w = await _apiService.fetchRealtimeWeather();
      _weather = w;
    } catch (_) {}

    try {
      final apiWards = await _apiService.fetchWards(orgId: orgId);
      if (apiWards.isNotEmpty) {
        _wards = apiWards;
      }
    } catch (_) {
      // Fallback to seed wards if API fails
      if (_wards.isEmpty) {
        _wards = List.from(SEED_WARDS);
      }
    }

    if (_wards.isNotEmpty && _selectedWard == null) {
      _selectedWard = _wards.first;
    }

    try {
      _coolingRecommendations = await _apiService.fetchCoolingRecommendations();
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
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
      await _apiService.fetchSecureWardDetails(
        locationId: ward.id,
        orgId: orgId,
      );
      _selectedWard = ward;
    } catch (e) {
      _selectedWard = ward;
    }
    notifyListeners();
  }
}
