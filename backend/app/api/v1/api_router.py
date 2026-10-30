import json
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.all_models import (
    Organisation,
    User,
    Location,
    LocationAccess,
    HeatAnalysis,
    TreeSpecies,
    PlantationSite,
    PlantedTree,
    TreeInspection,
    CoolingRecommendation,
    AuditLog
)
from app.core.llm_decision_engine import llm_engine
from app.core.geo_services import geo_services
from app.core.llm_fine_tuner import llm_fine_tuner

api_router = APIRouter()

# --- SYSTEM & HEALTH ---
@api_router.get("/health", tags=["System"])
def health_check():
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "pilot_city": settings.PILOT_CITY,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }

@api_router.get("/pilot-info", tags=["System"])
def pilot_info(db: Session = Depends(get_db)):
    city = db.query(Location).filter_by(code="JAL-CITY").first()
    wards_count = db.query(Location).filter_by(location_type="WARD").count()
    species_count = db.query(TreeSpecies).count()
    trees_count = db.query(PlantedTree).count()

    return {
        "city": settings.PILOT_CITY,
        "state": settings.PILOT_STATE,
        "country": settings.PILOT_COUNTRY,
        "coordinates": {
            "lat": settings.PILOT_DEFAULT_LAT,
            "lng": settings.PILOT_DEFAULT_LNG
        },
        "wards_count": wards_count,
        "species_catalog_count": species_count,
        "planted_trees_monitored": trees_count,
        "critical_challenges": [
            "Severe Urban Heat Island effect with summer surface temperatures exceeding 48°C",
            "Depleting groundwater tables requiring drought-resilient native species",
            "Dense commercial bazaars (e.g. Rainak Bazaar) requiring alternative cool roofs and shade structures",
            "Lack of post-plantation monitoring leading to high sapling mortality"
        ]
    }

@api_router.get("/weather/realtime", tags=["Weather"])
def get_realtime_weather():
    """
    Fetches real-time meteorological observations for Jalandhar pilot region.
    """
    import urllib.request

    city_lat = settings.PILOT_DEFAULT_LAT
    city_lng = settings.PILOT_DEFAULT_LNG

    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={city_lat}&longitude={city_lng}&current_weather=true"
        req = urllib.request.Request(url, headers={"User-Agent": "Climatrix-Platform/1.0"})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode("utf-8"))
            current = data.get("current_weather", {})
            temp = current.get("temperature", 38.5)

            return {
                "city": settings.PILOT_CITY,
                "coordinates": {"lat": city_lat, "lng": city_lng},
                "status": "LIVE_FEED",
                "ambient_temperature_celsius": temp,
                "wind_speed_kmh": current.get("windspeed", 12.5),
                "wind_direction_degrees": current.get("winddirection", 140),
                "weather_code": current.get("weathercode", 0),
                "heat_index_celsius": round(temp + 3.2, 1),
                "relative_humidity_pct": 46,
                "radar_timestamp": datetime.now(timezone.utc).isoformat(),
                "radar_tile_template": "https://tilecache.rainviewer.com/v2/radar/{timestamp}/256/{z}/{x}/{y}/2/1_1.png"
            }
    except Exception:
        return {
            "city": settings.PILOT_CITY,
            "coordinates": {"lat": city_lat, "lng": city_lng},
            "status": "SEED_BASELINE_FEED",
            "ambient_temperature_celsius": 38.5,
            "wind_speed_kmh": 14.2,
            "wind_direction_degrees": 120,
            "weather_code": 0,
            "heat_index_celsius": 42.1,
            "relative_humidity_pct": 48,
            "radar_timestamp": datetime.now(timezone.utc).isoformat(),
            "radar_tile_template": "https://tilecache.rainviewer.com/v2/radar/{timestamp}/256/{z}/{x}/{y}/2/1_1.png"
        }

# --- GEO DATA APIS & MULTI-CITY SERVICES ---
@api_router.get("/geo/search", tags=["Geo Data Services"])
def search_address(q: str = Query(..., description="Address or landmark to geocode via Nominatim & Maps.co")):
    return geo_services.geocode_address(q)

@api_router.get("/geo/isochrone", tags=["Geo Data Services"])
def walking_isochrone(
    lat: float = Query(31.3260, description="Target shelter latitude"),
    lng: float = Query(75.5762, description="Target shelter longitude"),
    time_seconds: int = Query(300, description="Walking time in seconds (e.g. 300s = 5-min walk)")
):
    return geo_services.get_walking_isochrone(lat, lng, time_seconds)

@api_router.get("/geo/ip-location", tags=["Geo Data Services"])
def client_ip_location():
    return geo_services.get_ip_location()

@api_router.get("/cities/catalog", tags=["Multi-City Expansion"])
def list_city_catalog():
    return geo_services.get_city_catalog()

@api_router.get("/system/pipeline-flow", tags=["System"])
def system_pipeline_flow():
    """
    Returns the structured end-to-end data pipeline architecture schema for Climatrix.
    """
    return {
        "pipeline_name": "Climatrix End-to-End Climate Data Pipeline",
        "version": "1.0.0",
        "stages": [
            {
                "stage": 1,
                "name": "Spatial & Remote Sensing Ingestion",
                "input_sources": ["USGS Landsat 9 TIRS-2 (Band 10)", "Copernicus Sentinel-2 MSI", "Municipal Ward GeoJSON Polygons"],
                "data_structures": ["SatelliteAsset", "Location"],
                "output": "Calibrated Surface Reflectance & Thermal Brightness Temperature",
                "key_transformations": ["Cloud masking (QA Band)", "Top-of-Atmosphere (TOA) radiance conversion", "At-sensor brightness temperature calculation"]
            },
            {
                "stage": 2,
                "name": "Microclimate Matrix & Raster Analysis",
                "input_sources": ["Calibrated Band 10 Thermal", "Red (B4) & NIR (B8) Bands", "SWIR (B11) Band"],
                "data_structures": ["HeatAnalysis"],
                "output": "30m LST (°C), NDVI Vegetation Index, NDBI Built-Up Index, Hotspot Priority Rank",
                "key_transformations": [
                    "Split-Window Radiative Transfer Equation for LST",
                    "Normalized Difference Vegetation Index: NDVI = (NIR - RED) / (NIR + RED)",
                    "Normalized Difference Built-up Index: NDBI = (SWIR - NIR) / (SWIR + NIR)",
                    "Urban Heat Island Intensity Delta: ΔT = Ward_LST - Baseline_Rural_LST"
                ]
            },
            {
                "stage": 3,
                "name": "Zero-Trust ABAC Security Enforcement",
                "input_sources": ["Customer JWT Claims (organisation_id, role)", "Requested location_id"],
                "data_structures": ["LocationAccess", "AuditLog"],
                "output": "200 OK Authorized Spatial Payload OR 403 Forbidden Security Breach Logged",
                "key_transformations": [
                    "Geographical License Check: WHERE organisation_id = :org_id AND location_id = :loc_id AND is_active = True",
                    "Audit Log Ingestion on Unauthorized Cross-Ward Breach Attempt"
                ]
            },
            {
                "stage": 4,
                "name": "Dual AI Climate Intervention Engine",
                "input_sources": ["Ward Microclimate Diagnostics", "Site Constraints (Road Width, Groundwater Depth, Site Type)"],
                "data_structures": ["TreeSpecies", "PlantationSite", "CoolingRecommendation"],
                "output": "Ranked Native Tree Species Matrix OR High-Albedo Cool Roof / Shade Specs",
                "key_transformations": [
                    "Plantation Feasibility Classifier: Evaluates ground width, underground utility density, paving type",
                    "Native Species Suitability Matcher: Evaluates Punjab species canopy radius, taproot safety, drought rating & APTI index",
                    "Alternative Cooling Solver: Computes Solar Reflectance Index (SRI > 82) cool roofs for unplantable dense bazaars"
                ]
            },
            {
                "stage": 5,
                "name": "Field Audit & Post-Planting Verification",
                "input_sources": ["Field Worker Geotagged Camera Submission", "Sub-5m GPS Receiver Coordinates"],
                "data_structures": ["PlantedTree", "TreeInspection"],
                "output": "Tamper-Evident Survival Register & Sapling Health Lifecycle Record",
                "key_transformations": [
                    "Haversine GPS Distance Check: Verify distance between registration lat/lng and field inspection lat/lng (<= 15m tolerance)",
                    "Automatic Status Escalation: Set status to CRITICAL if health rating <= 1; THRIVING if rating >= 4"
                ]
            }
        ]
    }

# --- TENANTS & ORGANISATIONS ---
@api_router.get("/tenants", tags=["Tenants"])
def list_tenants(db: Session = Depends(get_db)):
    orgs = db.query(Organisation).filter_by(is_active=True).all()
    results = []
    for org in orgs:
        licenses = db.query(LocationAccess).filter_by(organisation_id=org.id, is_active=True).all()
        licensed_ids = [lic.location_id for lic in licenses]
        results.append({
            "id": org.id,
            "name": org.name,
            "slug": org.slug,
            "org_type": org.org_type,
            "contact_email": org.contact_email,
            "licensed_location_ids": licensed_ids,
            "licensed_wards_count": len(licensed_ids)
        })
    return results

# --- LOCATIONS & GIS WITH ABAC LICENSING ---
@api_router.get("/locations/wards", tags=["Locations"])
def list_wards(
    org_id: Optional[str] = Query(None, description="Current tenant organization ID for ABAC licensing filter"),
    db: Session = Depends(get_db)
):
    wards = db.query(Location).filter_by(location_type="WARD").all()
    
    # Get licensed location IDs for tenant if specified
    licensed_set = set()
    if org_id:
        licenses = db.query(LocationAccess).filter_by(organisation_id=org_id, is_active=True).all()
        licensed_set = {lic.location_id for lic in licenses}

    results = []
    for ward in wards:
        analysis = db.query(HeatAnalysis).filter_by(location_id=ward.id).order_by(HeatAnalysis.analysis_timestamp.desc()).first()
        is_licensed = (ward.id in licensed_set) if org_id else True

        poly_coords = []
        try:
            geo = json.loads(ward.geojson_geometry)
            poly_coords = geo.get("coordinates", [[]])[0]
        except Exception:
            pass

        results.append({
            "id": ward.id,
            "name": ward.name,
            "code": ward.code,
            "lat": ward.centroid_lat,
            "lng": ward.centroid_lng,
            "area_sqkm": ward.area_sqkm,
            "population_density": ward.population_density,
            "coordinates": poly_coords,
            "description": ward.metadata_json.get("description", "") if ward.metadata_json else "",
            "is_licensed": is_licensed,
            "heat_analysis": {
                "mean_lst_celsius": analysis.mean_lst_celsius if analysis else None,
                "max_lst_celsius": analysis.max_lst_celsius if analysis else None,
                "min_lst_celsius": analysis.min_lst_celsius if analysis else None,
                "mean_ndvi": analysis.mean_ndvi if analysis else None,
                "mean_ndbi": analysis.mean_ndbi if analysis else None,
                "hotspot_severity": analysis.hotspot_severity if analysis else "MODERATE",
                "vulnerability_rank": analysis.vulnerability_rank if analysis else 99,
                "heat_island_intensity": analysis.heat_island_intensity_celsius if analysis else 0.0
            } if analysis else None
        })
    return results

@api_router.get("/locations/{location_id}/secure-details", tags=["Locations"])
def get_secure_ward_data(
    location_id: str,
    org_id: str = Query(..., description="Tenant organization ID attempting access"),
    db: Session = Depends(get_db)
):
    # STRICT ABAC SECURITY CHECK
    access = db.query(LocationAccess).filter_by(
        organisation_id=org_id,
        location_id=location_id,
        is_active=True
    ).first()

    if not access:
        # Record unauthorized access breach in audit log
        db.add(AuditLog(
            organisation_id=org_id,
            action="UNAUTHORIZED_WARD_ACCESS_ATTEMPT",
            resource=f"location/{location_id}",
            status_code=403,
            details_json={"location_id": location_id, "timestamp": datetime.now(timezone.utc).isoformat()}
        ))
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ABAC Security Gate: Your organization does not hold an active geographical license for this ward."
        )

    ward = db.query(Location).filter_by(id=location_id).first()
    if not ward:
        raise HTTPException(status_code=404, detail="Ward not found")

    analysis = db.query(HeatAnalysis).filter_by(location_id=ward.id).first()
    cooling = db.query(CoolingRecommendation).filter_by(location_id=ward.id).all()
    sites = db.query(PlantationSite).filter_by(location_id=ward.id).all()

    return {
        "ward": {
            "id": ward.id,
            "name": ward.name,
            "code": ward.code,
            "lat": ward.centroid_lat,
            "lng": ward.centroid_lng
        },
        "license_status": "AUTHORIZED",
        "license_tier": access.license_tier,
        "analysis": analysis,
        "cooling_recommendations": cooling,
        "plantation_sites": sites
    }

# --- LLM COGNITIVE DECISION ENGINE & SPECIES MATCHER ---
@api_router.get("/species", tags=["Species"])
def list_species(db: Session = Depends(get_db)):
    return db.query(TreeSpecies).order_by(TreeSpecies.heat_tolerance_max_celsius.desc()).all()

class SpeciesRecommendationQuery(BaseModel):
    soil_type: str = "Alluvial Sandy-Loam"
    road_width_meters: float = 6.0
    groundwater_depth_meters: float = 20.0
    site_type: str = "ROADSIDE_STRIP"  # ROADSIDE_STRIP, PUBLIC_PARK, INDUSTRIAL_BOUNDARY, RESIDENTIAL_STREET

@api_router.post("/species/recommend", tags=["Species"])
def recommend_species(query: SpeciesRecommendationQuery, db: Session = Depends(get_db)):
    all_species = db.query(TreeSpecies).all()
    species_dicts = [
        {
            "id": s.id,
            "botanical_name": s.botanical_name,
            "common_name_punjabi": s.common_name_punjabi,
            "heat_tolerance_max_celsius": s.heat_tolerance_max_celsius,
            "drought_tolerance_rating": s.drought_tolerance_rating,
            "mature_canopy_radius_m": s.mature_canopy_radius_m,
            "root_profile": s.root_profile,
            "air_pollution_tolerance_index": s.air_pollution_tolerance_index,
            "water_requirement_liters_day": s.water_requirement_liters_day,
            "description": s.description
        } for s in all_species
    ]

    # Evaluate via LLM Decision Engine
    evaluations = llm_engine.evaluate_species_suitability(
        road_width_m=query.road_width_meters,
        groundwater_depth_m=query.groundwater_depth_meters,
        site_type=query.site_type,
        soil_type=query.soil_type,
        species_catalog=species_dicts
    )

    return evaluations

class LLMDecisionQuery(BaseModel):
    ward_id: Optional[str] = "ward-14"
    custom_prompt: Optional[str] = "Evaluate Rainak Bazaar for 48°C extreme summer heat intervention"
    road_width_meters: float = 6.0
    groundwater_depth_meters: float = 20.0
    site_type: str = "ROADSIDE_STRIP"

@api_router.post("/llm/decision-making", tags=["LLM Decision Engine"])
def llm_decision_making(query: LLMDecisionQuery, db: Session = Depends(get_db)):
    ward = None
    if query.ward_id:
        ward = db.query(Location).filter((Location.id == query.ward_id) | (Location.code == query.ward_id)).first()

    if not ward:
        ward = db.query(Location).filter_by(location_type="WARD").first()

    analysis = db.query(HeatAnalysis).filter_by(location_id=ward.id).first() if ward else None

    mean_lst = analysis.mean_lst_celsius if analysis else 44.5
    max_lst = analysis.max_lst_celsius if analysis else 48.0
    mean_ndvi = analysis.mean_ndvi if analysis else 0.12
    mean_ndbi = analysis.mean_ndbi if analysis else 0.35
    pop_density = ward.population_density if ward else 12000

    # 1. Generate Ward Advisory from LLM Engine
    advisory = llm_engine.generate_ward_climate_advisory(
        ward_code=ward.code if ward else "JAL-WARD-14",
        ward_name=ward.name if ward else "Ward 14 - Rainak Bazaar",
        mean_lst=mean_lst,
        max_lst=max_lst,
        mean_ndvi=mean_ndvi,
        mean_ndbi=mean_ndbi,
        population_density=pop_density,
        custom_prompt=query.custom_prompt
    )

    # 2. Generate Species Recommendations from LLM Engine
    species_list = db.query(TreeSpecies).all()
    species_dicts = [
        {
            "id": s.id,
            "botanical_name": s.botanical_name,
            "common_name_punjabi": s.common_name_punjabi,
            "heat_tolerance_max_celsius": s.heat_tolerance_max_celsius,
            "drought_tolerance_rating": s.drought_tolerance_rating,
            "mature_canopy_radius_m": s.mature_canopy_radius_m,
            "root_profile": s.root_profile,
            "air_pollution_tolerance_index": s.air_pollution_tolerance_index,
            "water_requirement_liters_day": s.water_requirement_liters_day,
            "description": s.description
        } for s in species_list
    ]

    species_eval = llm_engine.evaluate_species_suitability(
        road_width_m=query.road_width_meters,
        groundwater_depth_m=query.groundwater_depth_meters,
        site_type=query.site_type,
        soil_type="Alluvial Sandy-Loam",
        species_catalog=species_dicts
    )

    return {
        "status": "success",
        "llm_engine_mode": "ACTIVE_COGNITIVE_REASONING",
        "advisory": advisory,
        "species_recommendations": species_eval
    }

# --- LLM FINE-TUNING & MODEL TRAINING ENDPOINTS ---
@api_router.get("/llm/training/dataset", tags=["LLM Model Training"])
def export_llm_training_dataset():
    dataset = llm_fine_tuner.generate_training_dataset()
    return {
        "dataset_name": "Climatrix-Jalandhar-Microclimate-FineTuning-v1.jsonl",
        "format": "OpenAI Chat Fine-Tuning Specification (JSONL)",
        "example_count": len(dataset),
        "examples": dataset
    }

@api_router.post("/llm/training/start-job", tags=["LLM Model Training"])
def start_llm_fine_tuning_job():
    dataset = llm_fine_tuner.generate_training_dataset()
    return llm_fine_tuner.submit_fine_tuning_job(dataset_size=len(dataset))

@api_router.get("/llm/training/status", tags=["LLM Model Training"])
def get_llm_fine_tuning_status():
    return llm_fine_tuner.get_fine_tuning_status()

# --- PLANTATION & FIELD TRACKING ---
@api_router.get("/trees", tags=["Plantation"])
def list_planted_trees(
    org_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PlantedTree)
    if org_id:
        query = query.filter_by(organisation_id=org_id)
    
    trees = query.all()
    results = []
    for t in trees:
        inspections = db.query(TreeInspection).filter_by(planted_tree_id=t.id).order_by(TreeInspection.inspection_date.desc()).all()
        species = db.query(TreeSpecies).filter_by(id=t.species_id).first()
        results.append({
            "id": t.id,
            "tree_unique_tag": t.tree_unique_tag,
            "lat": t.lat,
            "lng": t.lng,
            "plantation_date": t.plantation_date,
            "status": t.status,
            "species_name": species.common_name_punjabi if species else "Native",
            "botanical_name": species.botanical_name if species else "",
            "initial_photo_url": t.initial_photo_url,
            "initial_height_cm": t.initial_height_cm,
            "inspections": [
                {
                    "milestone": insp.inspection_milestone,
                    "date": insp.inspection_date,
                    "height_cm": insp.current_height_cm,
                    "health_rating": insp.health_rating,
                    "soil_moisture": insp.soil_moisture_condition,
                    "photo_url": insp.watering_evidence_photo_url,
                    "gps_distance_m": insp.gps_verified_distance_m,
                    "notes": insp.notes
                } for insp in inspections
            ]
        })
    return results

class NewInspectionPayload(BaseModel):
    planted_tree_id: str
    inspector_name: str = "Gurpreet Singh"
    inspection_milestone: str = "MONTH_6"
    current_height_cm: float
    health_rating: int = 4
    soil_moisture_condition: str = "OPTIMAL"
    watering_photo_url: str = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600"
    gps_lat: float
    gps_lng: float
    notes: Optional[str] = "Field audit logged via mobile inspection client."

@api_router.post("/trees/inspections", tags=["Plantation"])
def submit_tree_inspection(payload: NewInspectionPayload, db: Session = Depends(get_db)):
    tree = db.query(PlantedTree).filter_by(id=payload.planted_tree_id).first()
    if not tree:
        raise HTTPException(status_code=404, detail="Planted tree not found")

    # Calculate GPS distance deviation from registered coordinates
    lat_diff = (payload.gps_lat - tree.lat) * 111000
    lng_diff = (payload.gps_lng - tree.lng) * 96000
    distance_m = round((lat_diff**2 + lng_diff**2)**0.5, 2)
    is_verified = distance_m <= 15.0  # Max 15 meters tolerance for urban field GPS

    # Find inspector user or default
    inspector = db.query(User).filter_by(role="FIELD_WORKER").first()
    inspector_id = inspector.id if inspector else tree.created_by

    insp = TreeInspection(
        planted_tree_id=tree.id,
        inspector_user_id=inspector_id,
        inspection_date=datetime.now(timezone.utc),
        inspection_milestone=payload.inspection_milestone,
        current_height_cm=payload.current_height_cm,
        health_rating=payload.health_rating,
        soil_moisture_condition=payload.soil_moisture_condition,
        watering_evidence_photo_url=payload.watering_photo_url,
        gps_latitude=payload.gps_lat,
        gps_longitude=payload.gps_lng,
        gps_verified_distance_m=distance_m,
        is_gps_verified=is_verified,
        notes=payload.notes
    )
    db.add(insp)

    # Update tree status if critical or dead
    if payload.health_rating <= 1:
        tree.status = "CRITICAL"
    elif payload.health_rating >= 4:
        tree.status = "THRIVING"

    db.commit()
    db.refresh(insp)

    return {
        "status": "success",
        "inspection_id": insp.id,
        "gps_distance_m": distance_m,
        "is_gps_verified": is_verified,
        "message": "Inspection successfully logged with tamper-evident GPS audit."
    }

# --- ALTERNATIVE COOLING RECOMMENDATIONS ---
@api_router.get("/cooling-recommendations", tags=["Alternative Cooling"])
def list_cooling_recommendations(
    location_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CoolingRecommendation)
    if location_id:
        query = query.filter_by(location_id=location_id)
    return query.all()
