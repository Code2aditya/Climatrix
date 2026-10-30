class UserModel {
  final String id;
  final String organisationId;
  final String email;
  final String fullName;
  final String role; // SUPER_ADMIN, ORG_ADMIN, ANALYST, VIEWER, FIELD_WORKER
  final bool mfaEnabled;
  final String? orgSlug;

  UserModel({
    required this.id,
    required this.organisationId,
    required this.email,
    required this.fullName,
    required this.role,
    this.mfaEnabled = false,
    this.orgSlug,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      organisationId: json['organisation_id'] ?? '',
      email: json['email'] ?? '',
      fullName: json['full_name'] ?? json['email'] ?? 'User',
      role: json['role'] ?? 'ANALYST',
      mfaEnabled: json['mfa_enabled'] ?? false,
      orgSlug: json['org_slug'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'organisation_id': organisationId,
      'email': email,
      'full_name': fullName,
      'role': role,
      'mfa_enabled': mfaEnabled,
      'org_slug': orgSlug,
    };
  }
}

class TenantModel {
  final String id;
  final String name;
  final String slug;
  final String orgType;
  final String contactEmail;
  final List<String> licensedLocationIds;

  int get licensedWardsCount => licensedLocationIds.length;

  TenantModel({
    required this.id,
    required this.name,
    required this.slug,
    required this.orgType,
    required this.contactEmail,
    required this.licensedLocationIds,
  });

  factory TenantModel.fromJson(Map<String, dynamic> json) {
    return TenantModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      orgType: json['org_type'] ?? 'MUNICIPAL',
      contactEmail: json['contact_email'] ?? '',
      licensedLocationIds: List<String>.from(json['licensed_location_ids'] ?? []),
    );
  }
}

class UserPersona {
  final String id;
  final String name;
  final String role; // SUPER_ADMIN, ORG_ADMIN, ANALYST, FIELD_WORKER
  final String organisation;
  final String orgSlug;
  final String email;
  final String avatarText;
  final String description;
  final List<String> licensedWards;
  final List<String> responsibilities;

  const UserPersona({
    required this.id,
    required this.name,
    required this.role,
    required this.organisation,
    required this.orgSlug,
    required this.email,
    required this.avatarText,
    required this.description,
    required this.licensedWards,
    required this.responsibilities,
  });
}

const List<UserPersona> PRESET_PERSONAS = [
  UserPersona(
    id: "persona-super-admin",
    name: "Dr. Vikramjit Singh",
    role: "SUPER_ADMIN",
    organisation: "Climatrix Platform Operations",
    orgSlug: "climatrix-ops",
    email: "admin@climatrix.io",
    avatarText: "VS",
    description: "Platform Owner & Administrator",
    licensedWards: ["ALL (Wards 1 - 80)"],
    responsibilities: [
      "Manage all customer organizations and subscription tiers",
      "Add/edit city and ward GeoJSON boundaries",
      "Manage satellite raster pipelines (Landsat & Sentinel)",
      "Assign geographical licenses & audit security logs"
    ],
  ),
  UserPersona(
    id: "persona-mcj-admin",
    name: "Harpreet Kaur, IAS",
    role: "ORG_ADMIN",
    organisation: "Municipal Corporation Jalandhar (MCJ)",
    orgSlug: "mcjalandhar",
    email: "commissioner@mcjalandhar.gov.in",
    avatarText: "HK",
    description: "Municipal Customer Head",
    licensedWards: ["Ward 4", "Ward 14", "Ward 18", "Ward 37", "Ward 55", "Ward 68"],
    responsibilities: [
      "Review city ward heat vulnerability ranking",
      "Authorize high-albedo cool roofs for Rainak Bazaar (Ward 14)",
      "Oversee municipal plantation drives and sapling survival",
      "Manage internal staff (GIS Analysts & Field Workers)"
    ],
  ),
  UserPersona(
    id: "persona-mcj-analyst",
    name: "Rajinder Sharma",
    role: "ANALYST",
    organisation: "Municipal Corporation Jalandhar (MCJ)",
    orgSlug: "mcjalandhar",
    email: "gis.analyst@mcjalandhar.gov.in",
    avatarText: "RS",
    description: "GIS & Remote Sensing Specialist",
    licensedWards: ["Ward 4", "Ward 14", "Ward 18", "Ward 37", "Ward 55", "Ward 68"],
    responsibilities: [
      "Analyze Landsat LST and Sentinel NDVI rasters",
      "Run AI species matching for Jalandhar soil & water table",
      "Evaluate micro-site plantation feasibility",
      "Export executive climate reports for licensed wards"
    ],
  ),
  UserPersona(
    id: "persona-mcj-field",
    name: "Gurpreet Singh",
    role: "FIELD_WORKER",
    organisation: "Municipal Corporation Jalandhar (MCJ)",
    orgSlug: "mcjalandhar",
    email: "field.worker@mcjalandhar.gov.in",
    avatarText: "GS",
    description: "Horticulture Ground Field Officer",
    licensedWards: ["Assigned Sites (Wards 4 & 55)"],
    responsibilities: [
      "Register newly planted saplings with sub-5m GPS tags",
      "Submit 3/6/12-month field inspection audits",
      "Upload ground photos and soil moisture observations",
      "Flag distressed or dead saplings for immediate replacement"
    ],
  ),
  UserPersona(
    id: "persona-pgd-developer",
    name: "Amanpreet Varma",
    role: "ORG_ADMIN",
    organisation: "Punjab Green Developers Ltd (PGD)",
    orgSlug: "pgd-infra",
    email: "sustainability@pgd-infra.in",
    avatarText: "AV",
    description: "Private Customer (Restricted License)",
    licensedWards: ["Ward 22 (Industrial)", "Ward 68 (Campus)"],
    responsibilities: [
      "Purchased ONLY Industrial Focal Point (Ward 22) and Campus (Ward 68)",
      "ABAC Strict Isolation: Strictly BLOCKED from viewing civic wards",
      "Plan industrial buffer tree belts and factory cool roofs",
      "Generate private corporate ESG disclosure metrics"
    ],
  ),
];
