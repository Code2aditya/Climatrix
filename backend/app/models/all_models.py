import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Boolean, DateTime, Integer, Float, ForeignKey, Text, Enum, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

# 1. Organisations & Tenants
class Organisation(Base):
    __tablename__ = "organisations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    org_type = Column(String(50), default="MUNICIPAL")  # MUNICIPAL, DEVELOPER, ACADEMIC, NGO, ENTERPRISE
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    users = relationship("User", back_populates="organisation", cascade="all, delete-orphan")
    location_licenses = relationship("LocationAccess", back_populates="organisation", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="organisation", cascade="all, delete-orphan")
    planted_trees = relationship("PlantedTree", back_populates="organisation")
    audit_logs = relationship("AuditLog", back_populates="organisation")

# 2. Users & Roles
class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), nullable=False, default="ANALYST")  # SUPER_ADMIN, ORG_ADMIN, ANALYST, VIEWER, FIELD_WORKER
    is_active = Column(Boolean, default=True)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    organisation = relationship("Organisation", back_populates="users")
    inspections = relationship("TreeInspection", back_populates="inspector")

# 3. Subscription Plans & Subscriptions
class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), unique=True, nullable=False)
    tier = Column(String(50), nullable=False)  # PILOT_STARTER, MUNICIPAL_STANDARD, ENTERPRISE_PRO
    price_inr = Column(Float, nullable=False)
    billing_period = Column(String(20), default="ANNUAL")  # MONTHLY, ANNUAL
    max_wards = Column(Integer, default=5)
    max_users = Column(Integer, default=10)
    features_json = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(String(36), ForeignKey("subscription_plans.id"), nullable=False)
    status = Column(String(50), default="ACTIVE")  # ACTIVE, EXPIRED, CANCELLED, PENDING
    current_period_start = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    current_period_end = Column(DateTime, nullable=False)
    auto_renew = Column(Boolean, default=True)

    # Relationships
    organisation = relationship("Organisation", back_populates="subscriptions")
    plan = relationship("SubscriptionPlan")
    payments = relationship("Payment", back_populates="subscription")

# 4. Locations & GIS Boundaries
class Location(Base):
    __tablename__ = "locations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    parent_id = Column(String(36), ForeignKey("locations.id"), nullable=True, index=True)
    name = Column(String(150), nullable=False)
    code = Column(String(50), nullable=True, index=True)  # e.g., "JAL-WARD-14"
    location_type = Column(String(50), nullable=False, default="WARD")  # CITY, WARD, INDUSTRIAL_PARK, CAMPUS, CUSTOM_POLYGON
    centroid_lat = Column(Float, nullable=False)
    centroid_lng = Column(Float, nullable=False)
    area_sqkm = Column(Float, default=1.0)
    population_density = Column(Integer, default=5000)
    geojson_geometry = Column(Text, nullable=False)  # GeoJSON polygon string
    metadata_json = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)

    # Relationships
    children = relationship("Location", backref="parent", remote_side=[id])
    licenses = relationship("LocationAccess", back_populates="location", cascade="all, delete-orphan")
    heat_analyses = relationship("HeatAnalysis", back_populates="location", cascade="all, delete-orphan")
    plantation_sites = relationship("PlantationSite", back_populates="location")
    cooling_recommendations = relationship("CoolingRecommendation", back_populates="location")

# 5. Location Access / Licensing (ABAC enforcement)
class LocationAccess(Base):
    __tablename__ = "location_access"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False, index=True)
    location_id = Column(String(36), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    valid_from = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    valid_until = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    license_tier = Column(String(50), default="FULL_SUITE")  # FULL_SUITE, HEAT_ONLY, PLANTATION_ONLY

    # Relationships
    organisation = relationship("Organisation", back_populates="location_licenses")
    location = relationship("Location", back_populates="licenses")

# 6. Satellite Assets & Remote Sensing Metadata
class SatelliteAsset(Base):
    __tablename__ = "satellite_assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    location_id = Column(String(36), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    satellite_platform = Column(String(50), nullable=False)  # SENTINEL_2, LANDSAT_8, LANDSAT_9
    scene_id = Column(String(100), nullable=False, index=True)
    acquisition_date = Column(DateTime, nullable=False)
    cloud_cover_pct = Column(Float, default=0.0)
    spatial_resolution_m = Column(Float, default=30.0)
    processed_ndvi_path = Column(String(500), nullable=True)
    processed_lst_path = Column(String(500), nullable=True)
    data_quality_notes = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# 7. Heat & Vegetation Analysis
class HeatAnalysis(Base):
    __tablename__ = "heat_analysis"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    location_id = Column(String(36), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    asset_id = Column(String(36), ForeignKey("satellite_assets.id"), nullable=True)
    mean_lst_celsius = Column(Float, nullable=False)
    max_lst_celsius = Column(Float, nullable=False)
    min_lst_celsius = Column(Float, nullable=False)
    mean_ndvi = Column(Float, nullable=False)
    mean_ndbi = Column(Float, nullable=False)
    heat_island_intensity_celsius = Column(Float, default=3.5)
    hotspot_severity = Column(String(20), default="HIGH")  # CRITICAL, HIGH, MODERATE, LOW
    vulnerability_rank = Column(Integer, default=1)
    hotspots_geojson = Column(Text, nullable=True)  # Polygons of isolated critical hotspots
    analysis_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    location = relationship("Location", back_populates="heat_analyses")

# 8. Tree Species Catalog (Punjab Native & Resilient)
class TreeSpecies(Base):
    __tablename__ = "tree_species"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    botanical_name = Column(String(200), unique=True, nullable=False, index=True)
    common_name_punjabi = Column(String(100), nullable=False)
    common_name_english = Column(String(100), nullable=False)
    heat_tolerance_max_celsius = Column(Float, nullable=False)
    drought_tolerance_rating = Column(Integer, default=4)  # 1-5 scale
    water_requirement_liters_day = Column(Float, default=15.0)
    mature_canopy_radius_m = Column(Float, default=6.0)
    root_profile = Column(String(50), default="TAPROOT_DEEP")  # TAPROOT_DEEP, FIBROUS_SHALLOW, SPREADING
    air_pollution_tolerance_index = Column(Float, default=18.5)
    carbon_sequestration_kg_yr = Column(Float, default=22.0)
    preferred_soil = Column(String(100), default="Alluvial Sandy-Loam")
    growth_rate = Column(String(50), default="MODERATE")  # FAST, MODERATE, SLOW
    description = Column(Text, nullable=True)

    # Relationships
    planted_trees = relationship("PlantedTree", back_populates="species")

# 9. Plantation Sites
class PlantationSite(Base):
    __tablename__ = "plantation_sites"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    location_id = Column(String(36), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False, index=True)
    site_name = Column(String(200), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    site_type = Column(String(50), default="ROADSIDE_STRIP")  # ROADSIDE_STRIP, PUBLIC_PARK, INSTITUTIONAL_CAMPUS, MEDIAN, VACANT_LOT
    feasibility_status = Column(String(50), default="SUITABLE")  # SUITABLE, CONDITIONALLY_SUITABLE, UNSUITABLE_PLANTATION, REQUIRES_INSPECTION
    unsuitability_reason = Column(Text, nullable=True)
    available_area_sqm = Column(Float, default=50.0)
    estimated_capacity_trees = Column(Integer, default=10)
    soil_type = Column(String(50), default="Alluvial Sandy Loam")
    water_source_distance_m = Column(Float, default=50.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    location = relationship("Location", back_populates="plantation_sites")
    planted_trees = relationship("PlantedTree", back_populates="site")

# 10. Planted Trees Registry
class PlantedTree(Base):
    __tablename__ = "planted_trees"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False, index=True)
    site_id = Column(String(36), ForeignKey("plantation_sites.id"), nullable=True)
    species_id = Column(String(36), ForeignKey("tree_species.id"), nullable=False)
    tree_unique_tag = Column(String(50), unique=True, nullable=False, index=True)  # e.g. "JAL-TR-2026-0041"
    plantation_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    initial_height_cm = Column(Float, default=120.0)
    initial_photo_url = Column(String(500), nullable=True)
    status = Column(String(50), default="THRIVING")  # THRIVING, DISTRESSED, CRITICAL, DEAD, REPLACED
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    organisation = relationship("Organisation", back_populates="planted_trees")
    site = relationship("PlantationSite", back_populates="planted_trees")
    species = relationship("TreeSpecies", back_populates="planted_trees")
    inspections = relationship("TreeInspection", back_populates="tree", cascade="all, delete-orphan")

# 11. Tree Inspections (Post-Planting Tracking)
class TreeInspection(Base):
    __tablename__ = "tree_inspections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    planted_tree_id = Column(String(36), ForeignKey("planted_trees.id", ondelete="CASCADE"), nullable=False, index=True)
    inspector_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    inspection_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    inspection_milestone = Column(String(20), default="DAY_0")  # DAY_0, MONTH_3, MONTH_6, MONTH_12, ANNUAL
    current_height_cm = Column(Float, nullable=False)
    health_rating = Column(Integer, default=5)  # 1 to 5
    soil_moisture_condition = Column(String(50), default="OPTIMAL")  # DRY, OPTIMAL, SATURATED
    watering_evidence_photo_url = Column(String(500), nullable=True)
    gps_latitude = Column(Float, nullable=False)
    gps_longitude = Column(Float, nullable=False)
    gps_verified_distance_m = Column(Float, default=1.2)  # Distance from original registered coordinates
    is_gps_verified = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    tree = relationship("PlantedTree", back_populates="inspections")
    inspector = relationship("User", back_populates="inspections")

# 12. Alternative Cooling Solutions
class CoolingRecommendation(Base):
    __tablename__ = "cooling_recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    location_id = Column(String(36), ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)
    site_id = Column(String(36), ForeignKey("plantation_sites.id"), nullable=True)
    intervention_type = Column(String(50), nullable=False)  # COOL_ROOFS, GREEN_ROOFS, PERMEABLE_COOL_PAVEMENT, TENSILE_SHADE_CANOPY, VERTICAL_LIVING_WALL
    target_area_name = Column(String(200), nullable=False)
    surface_area_sqm = Column(Float, default=250.0)
    estimated_surface_cooling_celsius = Column(Float, default=6.5)
    implementation_complexity = Column(String(20), default="MEDIUM")  # LOW, MEDIUM, HIGH
    water_dependency = Column(String(20), default="NONE")  # NONE, LOW, HIGH
    estimated_cost_inr_sqm = Column(Float, default=450.0)
    engineering_rationale = Column(Text, nullable=False)
    maintenance_requirements = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    location = relationship("Location", back_populates="cooling_recommendations")

# 13. Payments & Invoices
class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=False, index=True)
    subscription_id = Column(String(36), ForeignKey("subscriptions.id"), nullable=True)
    razorpay_order_id = Column(String(100), unique=True, nullable=False)
    razorpay_payment_id = Column(String(100), unique=True, nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    amount_inr = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(50), default="PENDING")  # PENDING, SUCCESS, FAILED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    subscription = relationship("Subscription", back_populates="payments")
    invoice = relationship("Invoice", uselist=False, back_populates="payment")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    payment_id = Column(String(36), ForeignKey("payments.id"), nullable=False, unique=True)
    invoice_number = Column(String(50), unique=True, nullable=False)
    amount_tax_inr = Column(Float, default=0.0)
    amount_total_inr = Column(Float, nullable=False)
    pdf_url = Column(String(500), nullable=True)
    issued_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    payment = relationship("Payment", back_populates="invoice")

# 14. Audit Logs (Security & Compliance)
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    organisation_id = Column(String(36), ForeignKey("organisations.id", ondelete="CASCADE"), nullable=True, index=True)
    user_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)  # AUTH_LOGIN, ACCESS_WARD_DATA, UNAUTHORIZED_ATTEMPT, REGISTER_TREE, EXPORT_REPORT
    resource = Column(String(200), nullable=False)
    client_ip = Column(String(50), nullable=True)
    status_code = Column(Integer, default=200)
    details_json = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    organisation = relationship("Organisation", back_populates="audit_logs")
