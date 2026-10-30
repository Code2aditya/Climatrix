class SpeciesModel {
  final String id;
  final String botanicalName;
  final String commonNamePunjabi;
  final String commonNameEnglish;
  final double heatToleranceMaxCelsius;
  final int droughtToleranceRating;
  final double waterRequirementLitersDay;
  final double matureCanopyRadiusM;
  final String rootProfile;
  final double airPollutionToleranceIndex;
  final double carbonSequestrationKgYr;
  final String preferredSoil;
  final String growthRate;
  final String description;

  SpeciesModel({
    required this.id,
    required this.botanicalName,
    required this.commonNamePunjabi,
    required this.commonNameEnglish,
    required this.heatToleranceMaxCelsius,
    required this.droughtToleranceRating,
    required this.waterRequirementLitersDay,
    required this.matureCanopyRadiusM,
    required this.rootProfile,
    required this.airPollutionToleranceIndex,
    required this.carbonSequestrationKgYr,
    required this.preferredSoil,
    required this.growthRate,
    required this.description,
  });

  factory SpeciesModel.fromJson(Map<String, dynamic> json) {
    return SpeciesModel(
      id: json['id'] ?? '',
      botanicalName: json['botanical_name'] ?? '',
      commonNamePunjabi: json['common_name_punjabi'] ?? '',
      commonNameEnglish: json['common_name_english'] ?? json['common_name_punjabi'] ?? '',
      heatToleranceMaxCelsius: (json['heat_tolerance_max_celsius'] ?? 45.0).toDouble(),
      droughtToleranceRating: json['drought_tolerance_rating'] ?? 4,
      waterRequirementLitersDay: (json['water_requirement_liters_day'] ?? 15.0).toDouble(),
      matureCanopyRadiusM: (json['mature_canopy_radius_m'] ?? 6.0).toDouble(),
      rootProfile: json['root_profile'] ?? 'TAPROOT_DEEP',
      airPollutionToleranceIndex: (json['air_pollution_tolerance_index'] ?? 18.5).toDouble(),
      carbonSequestrationKgYr: (json['carbon_sequestration_kg_yr'] ?? 22.0).toDouble(),
      preferredSoil: json['preferred_soil'] ?? 'Alluvial Sandy-Loam',
      growthRate: json['growth_rate'] ?? 'MODERATE',
      description: json['description'] ?? '',
    );
  }
}

class SpeciesRecommendationResult {
  final String speciesId;
  final String botanicalName;
  final String commonNamePunjabi;
  final double suitabilityScore;
  final String recommendationRationale;
  final String maintenanceClass;

  SpeciesRecommendationResult({
    required this.speciesId,
    required this.botanicalName,
    required this.commonNamePunjabi,
    required this.suitabilityScore,
    required this.recommendationRationale,
    required this.maintenanceClass,
  });

  factory SpeciesRecommendationResult.fromJson(Map<String, dynamic> json) {
    return SpeciesRecommendationResult(
      speciesId: json['species_id'] ?? json['id'] ?? '',
      botanicalName: json['botanical_name'] ?? '',
      commonNamePunjabi: json['common_name_punjabi'] ?? '',
      suitabilityScore: (json['suitability_score'] ?? json['score'] ?? 85.0).toDouble(),
      recommendationRationale: json['recommendation_rationale'] ?? json['rationale'] ?? '',
      maintenanceClass: json['maintenance_class'] ?? 'MODERATE',
    );
  }
}
