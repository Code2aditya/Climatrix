class PlantedTreeModel {
  final String id;
  final String treeUniqueTag;
  final double lat;
  final double lng;
  final String plantationDate;
  final String status; // THRIVING, DISTRESSED, CRITICAL, DEAD, REPLACED
  final String speciesName;
  final String botanicalName;
  final String? initialPhotoUrl;
  final double initialHeightCm;
  final List<TreeInspectionModel> inspections;

  PlantedTreeModel({
    required this.id,
    required this.treeUniqueTag,
    required this.lat,
    required this.lng,
    required this.plantationDate,
    required this.status,
    required this.speciesName,
    required this.botanicalName,
    this.initialPhotoUrl,
    required this.initialHeightCm,
    required this.inspections,
  });

  factory PlantedTreeModel.fromJson(Map<String, dynamic> json) {
    var rawInspections = json['inspections'] as List? ?? [];
    List<TreeInspectionModel> parsedInspections =
        rawInspections.map((i) => TreeInspectionModel.fromJson(i)).toList();

    return PlantedTreeModel(
      id: json['id'] ?? '',
      treeUniqueTag: json['tree_unique_tag'] ?? '',
      lat: (json['lat'] ?? 0.0).toDouble(),
      lng: (json['lng'] ?? 0.0).toDouble(),
      plantationDate: json['plantation_date'] ?? '',
      status: json['status'] ?? 'THRIVING',
      speciesName: json['species_name'] ?? 'Native',
      botanicalName: json['botanical_name'] ?? '',
      initialPhotoUrl: json['initial_photo_url'],
      initialHeightCm: (json['initial_height_cm'] ?? 120.0).toDouble(),
      inspections: parsedInspections,
    );
  }
}

class TreeInspectionModel {
  final String milestone; // DAY_0, MONTH_3, MONTH_6, MONTH_12, ANNUAL
  final String date;
  final double heightCm;
  final int healthRating; // 1-5
  final String soilMoisture;
  final String? photoUrl;
  final double gpsDistanceM;
  final String? notes;

  TreeInspectionModel({
    required this.milestone,
    required this.date,
    required this.heightCm,
    required this.healthRating,
    required this.soilMoisture,
    this.photoUrl,
    required this.gpsDistanceM,
    this.notes,
  });

  factory TreeInspectionModel.fromJson(Map<String, dynamic> json) {
    return TreeInspectionModel(
      milestone: json['milestone'] ?? 'MONTH_3',
      date: json['date'] ?? '',
      heightCm: (json['height_cm'] ?? 120.0).toDouble(),
      healthRating: json['health_rating'] ?? 4,
      soilMoisture: json['soil_moisture'] ?? 'OPTIMAL',
      photoUrl: json['photo_url'],
      gpsDistanceM: (json['gps_distance_m'] ?? 0.0).toDouble(),
      notes: json['notes'],
    );
  }
}
