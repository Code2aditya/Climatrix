class CoolingRecommendationModel {
  final String id;
  final String locationId;
  final String? siteId;
  final String interventionType; // COOL_ROOFS, GREEN_ROOFS, PERMEABLE_COOL_PAVEMENT, TENSILE_SHADE_CANOPY
  final String targetAreaName;
  final double surfaceAreaSqm;
  final double estimatedSurfaceCoolingCelsius;
  final String implementationComplexity;
  final String waterDependency;
  final double estimatedCostInrSqm;
  final String engineeringRationale;
  final String? maintenanceRequirements;

  CoolingRecommendationModel({
    required this.id,
    required this.locationId,
    this.siteId,
    required this.interventionType,
    required this.targetAreaName,
    required this.surfaceAreaSqm,
    required this.estimatedSurfaceCoolingCelsius,
    required this.implementationComplexity,
    required this.waterDependency,
    required this.estimatedCostInrSqm,
    required this.engineeringRationale,
    this.maintenanceRequirements,
  });

  factory CoolingRecommendationModel.fromJson(Map<String, dynamic> json) {
    return CoolingRecommendationModel(
      id: json['id'] ?? '',
      locationId: json['location_id'] ?? '',
      siteId: json['site_id'],
      interventionType: json['intervention_type'] ?? 'COOL_ROOFS',
      targetAreaName: json['target_area_name'] ?? 'Target Zone',
      surfaceAreaSqm: (json['surface_area_sqm'] ?? 250.0).toDouble(),
      estimatedSurfaceCoolingCelsius:
          (json['estimated_surface_cooling_celsius'] ?? 6.5).toDouble(),
      implementationComplexity: json['implementation_complexity'] ?? 'MEDIUM',
      waterDependency: json['water_dependency'] ?? 'NONE',
      estimatedCostInrSqm: (json['estimated_cost_inr_sqm'] ?? 450.0).toDouble(),
      engineeringRationale: json['engineering_rationale'] ?? '',
      maintenanceRequirements: json['maintenance_requirements'],
    );
  }
}
