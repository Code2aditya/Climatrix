class WardModel {
  final String id;
  final String name;
  final String code;
  final double lat;
  final double lng;
  final double areaSqkm;
  final int populationDensity;
  final List<dynamic> coordinates;
  final String description;
  final bool isLicensed;
  final HeatAnalysisModel? heatAnalysis;

  WardModel({
    required this.id,
    required this.name,
    required this.code,
    required this.lat,
    required this.lng,
    required this.areaSqkm,
    required this.populationDensity,
    required this.coordinates,
    required this.description,
    required this.isLicensed,
    this.heatAnalysis,
  });

  factory WardModel.fromJson(Map<String, dynamic> json) {
    return WardModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      code: json['code'] ?? '',
      lat: (json['lat'] ?? 31.3260).toDouble(),
      lng: (json['lng'] ?? 75.5762).toDouble(),
      areaSqkm: (json['area_sqkm'] ?? 1.0).toDouble(),
      populationDensity: json['population_density'] ?? 5000,
      coordinates: json['coordinates'] ?? [],
      description: json['description'] ?? '',
      isLicensed: json['is_licensed'] ?? true,
      heatAnalysis: json['heat_analysis'] != null
          ? HeatAnalysisModel.fromJson(json['heat_analysis'])
          : null,
    );
  }
}

class HeatAnalysisModel {
  final double? meanLstCelsius;
  final double? maxLstCelsius;
  final double? minLstCelsius;
  final double? meanNdvi;
  final double? meanNdbi;
  final String hotspotSeverity;
  final int vulnerabilityRank;
  final double heatIslandIntensity;

  HeatAnalysisModel({
    this.meanLstCelsius,
    this.maxLstCelsius,
    this.minLstCelsius,
    this.meanNdvi,
    this.meanNdbi,
    required this.hotspotSeverity,
    required this.vulnerabilityRank,
    required this.heatIslandIntensity,
  });

  factory HeatAnalysisModel.fromJson(Map<String, dynamic> json) {
    return HeatAnalysisModel(
      meanLstCelsius: json['mean_lst_celsius'] != null
          ? (json['mean_lst_celsius'] as num).toDouble()
          : null,
      maxLstCelsius: json['max_lst_celsius'] != null
          ? (json['max_lst_celsius'] as num).toDouble()
          : null,
      minLstCelsius: json['min_lst_celsius'] != null
          ? (json['min_lst_celsius'] as num).toDouble()
          : null,
      meanNdvi: json['mean_ndvi'] != null
          ? (json['mean_ndvi'] as num).toDouble()
          : null,
      meanNdbi: json['mean_ndbi'] != null
          ? (json['mean_ndbi'] as num).toDouble()
          : null,
      hotspotSeverity: json['hotspot_severity'] ?? 'MODERATE',
      vulnerabilityRank: json['vulnerability_rank'] ?? 99,
      heatIslandIntensity: json['heat_island_intensity'] != null
          ? (json['heat_island_intensity'] as num).toDouble()
          : 0.0,
    );
  }
}
