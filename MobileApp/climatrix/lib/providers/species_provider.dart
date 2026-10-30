import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../models/species_model.dart';

class SpeciesProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  List<SpeciesModel> _speciesCatalog = [];
  List<SpeciesModel> get speciesCatalog => _speciesCatalog;

  List<SpeciesRecommendationResult> _recommendations = [];
  List<SpeciesRecommendationResult> get recommendations => _recommendations;

  Map<String, dynamic>? _llmAdvisory;
  Map<String, dynamic>? get llmAdvisory => _llmAdvisory;

  Future<void> fetchSpeciesCatalog() async {
    _isLoading = true;
    notifyListeners();

    try {
      _speciesCatalog = await _apiService.fetchSpeciesCatalog();
    } catch (e) {
      debugPrint('Species fetch error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> evaluateRecommendations({
    String soilType = "Alluvial Sandy-Loam",
    double roadWidthMeters = 6.0,
    double groundwaterDepthMeters = 20.0,
    String siteType = "ROADSIDE_STRIP",
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      _recommendations = await _apiService.recommendSpecies(
        soilType: soilType,
        roadWidthMeters: roadWidthMeters,
        groundwaterDepthMeters: groundwaterDepthMeters,
        siteType: siteType,
      );
    } catch (e) {
      debugPrint('Species evaluate error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchLlmDecision({
    required String wardId,
    required String customPrompt,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      _llmAdvisory = await _apiService.getLlmDecision(
        wardId: wardId,
        customPrompt: customPrompt,
      );
    } catch (e) {
      debugPrint('LLM Decision error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
