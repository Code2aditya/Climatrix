class PilotInfoModel {
  final String city;
  final String state;
  final String country;
  final double lat;
  final double lng;
  final int wardsCount;
  final int speciesCatalogCount;
  final int plantedTreesMonitored;
  final List<String> criticalChallenges;

  PilotInfoModel({
    required this.city,
    required this.state,
    required this.country,
    required this.lat,
    required this.lng,
    required this.wardsCount,
    required this.speciesCatalogCount,
    required this.plantedTreesMonitored,
    required this.criticalChallenges,
  });

  factory PilotInfoModel.fromJson(Map<String, dynamic> json) {
    var coords = json['coordinates'] as Map? ?? {};
    return PilotInfoModel(
      city: json['city'] ?? 'Jalandhar',
      state: json['state'] ?? 'Punjab',
      country: json['country'] ?? 'India',
      lat: (coords['lat'] ?? 31.3260).toDouble(),
      lng: (coords['lng'] ?? 75.5762).toDouble(),
      wardsCount: json['wards_count'] ?? 0,
      speciesCatalogCount: json['species_catalog_count'] ?? 0,
      plantedTreesMonitored: json['planted_trees_monitored'] ?? 0,
      criticalChallenges: List<String>.from(json['critical_challenges'] ?? []),
    );
  }
}

class RealtimeWeatherModel {
  final String city;
  final String status;
  final double ambientTemperatureCelsius;
  final double windSpeedKmh;
  final double windDirectionDegrees;
  final int weatherCode;
  final double heatIndexCelsius;
  final int relativeHumidityPct;
  final String radarTimestamp;
  final String radarTileTemplate;

  RealtimeWeatherModel({
    required this.city,
    required this.status,
    required this.ambientTemperatureCelsius,
    required this.windSpeedKmh,
    required this.windDirectionDegrees,
    required this.weatherCode,
    required this.heatIndexCelsius,
    required this.relativeHumidityPct,
    required this.radarTimestamp,
    required this.radarTileTemplate,
  });

  factory RealtimeWeatherModel.fromJson(Map<String, dynamic> json) {
    return RealtimeWeatherModel(
      city: json['city'] ?? 'Jalandhar',
      status: json['status'] ?? 'LIVE_FEED',
      ambientTemperatureCelsius:
          (json['ambient_temperature_celsius'] ?? 38.5).toDouble(),
      windSpeedKmh: (json['wind_speed_kmh'] ?? 12.5).toDouble(),
      windDirectionDegrees:
          (json['wind_direction_degrees'] ?? 140.0).toDouble(),
      weatherCode: json['weather_code'] ?? 0,
      heatIndexCelsius: (json['heat_index_celsius'] ?? 42.1).toDouble(),
      relativeHumidityPct: json['relative_humidity_pct'] ?? 48,
      radarTimestamp: json['radar_timestamp'] ?? '',
      radarTileTemplate: json['radar_tile_template'] ?? '',
    );
  }
}
