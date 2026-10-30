import json
from datetime import datetime, timedelta, timezone
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.all_models import (
    Organisation,
    User,
    SubscriptionPlan,
    Subscription,
    Location,
    LocationAccess,
    SatelliteAsset,
    HeatAnalysis,
    TreeSpecies,
    PlantationSite,
    PlantedTree,
    TreeInspection,
    CoolingRecommendation,
    AuditLog
)

def make_geojson_poly(coords):
    return json.dumps({
        "type": "Polygon",
        "coordinates": [coords]
    })

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    existing_org = db.query(Organisation).filter_by(slug="mcjalandhar").first()
    if existing_org:
        print("Database already contains seeded Jalandhar data. Skipping seed.")
        db.close()
        return

    print("--- SEEDING COMPREHENSIVE JALANDHAR CLIMATE DATASET ---")

    # 1. Organisations
    ops_org = Organisation(
        name="Climatrix Platform Operations",
        slug="climatrix-ops",
        org_type="PLATFORM_OPERATOR",
        contact_email="ops@climatrix.io",
        contact_phone="+91-181-5550100",
        is_active=True
    )
    mcj_org = Organisation(
        name="Municipal Corporation Jalandhar (MCJ)",
        slug="mcjalandhar",
        org_type="MUNICIPAL",
        contact_email="commissioner@mcjalandhar.gov.in",
        contact_phone="+91-181-2227015",
        is_active=True
    )
    pgd_org = Organisation(
        name="Punjab Green Developers Ltd (PGD)",
        slug="pgd-infra",
        org_type="DEVELOPER",
        contact_email="sustainability@pgd-infra.in",
        contact_phone="+91-181-4458900",
        is_active=True
    )
    db.add_all([ops_org, mcj_org, pgd_org])
    db.flush()

    # 2. Users with RBAC Roles
    super_admin = User(
        organisation_id=ops_org.id,
        email="admin@climatrix.io",
        hashed_password=get_password_hash("AntigravityAdmin2026!"),
        full_name="Dr. Vikramjit Singh (Super Admin)",
        phone="+91-9876543210",
        role="SUPER_ADMIN",
        is_active=True
    )
    mcj_admin = User(
        organisation_id=mcj_org.id,
        email="commissioner@mcjalandhar.gov.in",
        hashed_password=get_password_hash("MCJAdmin2026!"),
        full_name="Harpreet Kaur, IAS (MCJ Commissioner)",
        phone="+91-9814012345",
        role="ORG_ADMIN",
        is_active=True
    )
    mcj_analyst = User(
        organisation_id=mcj_org.id,
        email="gis.analyst@mcjalandhar.gov.in",
        hashed_password=get_password_hash("MCJAnalyst2026!"),
        full_name="Rajinder Sharma (GIS Lead MCJ)",
        phone="+91-9814054321",
        role="ANALYST",
        is_active=True
    )
    mcj_field = User(
        organisation_id=mcj_org.id,
        email="field.worker@mcjalandhar.gov.in",
        hashed_password=get_password_hash("MCJField2026!"),
        full_name="Gurpreet Singh (Horticulture Ground Officer)",
        phone="+91-9814098765",
        role="FIELD_WORKER",
        is_active=True
    )
    pgd_admin = User(
        organisation_id=pgd_org.id,
        email="sustainability@pgd-infra.in",
        hashed_password=get_password_hash("PGDAdmin2026!"),
        full_name="Amanpreet Varma (VP Sustainability, PGD)",
        phone="+91-9988776655",
        role="ORG_ADMIN",
        is_active=True
    )
    pgd_analyst = User(
        organisation_id=pgd_org.id,
        email="planner@pgd-infra.in",
        hashed_password=get_password_hash("PGDAnalyst2026!"),
        full_name="Simran Bawa (Urban Planner PGD)",
        phone="+91-9988774433",
        role="ANALYST",
        is_active=True
    )
    db.add_all([super_admin, mcj_admin, mcj_analyst, mcj_field, pgd_admin, pgd_analyst])
    db.flush()

    # 3. Subscription Plans
    starter_plan = SubscriptionPlan(
        name="Pilot Starter",
        tier="PILOT_STARTER",
        price_inr=49999.0,
        billing_period="ANNUAL",
        max_wards=5,
        max_users=5,
        features_json={"heat_mapping": True, "species_engine": True, "field_tracking": True}
    )
    municipal_plan = SubscriptionPlan(
        name="Municipal Resilience Suite",
        tier="MUNICIPAL_STANDARD",
        price_inr=249999.0,
        billing_period="ANNUAL",
        max_wards=25,
        max_users=30,
        features_json={"heat_mapping": True, "species_engine": True, "field_tracking": True, "alternative_cooling": True, "pdf_reports": True}
    )
    db.add_all([starter_plan, municipal_plan])
    db.flush()

    # Active Subscriptions
    now = datetime.now(timezone.utc)
    mcj_sub = Subscription(
        organisation_id=mcj_org.id,
        plan_id=municipal_plan.id,
        status="ACTIVE",
        current_period_start=now - timedelta(days=30),
        current_period_end=now + timedelta(days=335),
        auto_renew=True
    )
    pgd_sub = Subscription(
        organisation_id=pgd_org.id,
        plan_id=starter_plan.id,
        status="ACTIVE",
        current_period_start=now - timedelta(days=15),
        current_period_end=now + timedelta(days=350),
        auto_renew=True
    )
    db.add_all([mcj_sub, pgd_sub])
    db.flush()

    # 4. Locations & Jalandhar Wards
    jalandhar_city = Location(
        name="Jalandhar Municipal Corporation Area",
        code="JAL-CITY",
        location_type="CITY",
        centroid_lat=31.3260,
        centroid_lng=75.5762,
        area_sqkm=110.0,
        population_density=8200,
        geojson_geometry=make_geojson_poly([
            [75.50, 31.28], [75.65, 31.28], [75.65, 31.38], [75.50, 31.38], [75.50, 31.28]
        ]),
        metadata_json={"state": "Punjab", "district": "Jalandhar", "wards_total": 80}
    )
    db.add(jalandhar_city)
    db.flush()

    # Key Wards with distinct microclimates
    wards_data = [
        {
            "name": "Ward 4 - Model Town & Lajpat Nagar",
            "code": "JAL-WARD-04",
            "lat": 31.3090, "lng": 75.5810, "area": 3.8, "pop": 6200,
            "coords": [[75.572, 31.301], [75.590, 31.301], [75.590, 31.317], [75.572, 31.317], [75.572, 31.301]],
            "lst": 38.2, "ndvi": 0.32, "ndbi": -0.05, "severity": "MODERATE", "rank": 14,
            "desc": "Planned residential suburb with moderate canopy, wide avenues, and high plantation capacity."
        },
        {
            "name": "Ward 14 - Rainak Bazaar & Jyoti Chowk",
            "code": "JAL-WARD-14",
            "lat": 31.3255, "lng": 75.5750, "area": 1.9, "pop": 18500,
            "coords": [[75.568, 31.320], [75.582, 31.320], [75.582, 31.331], [75.568, 31.331], [75.568, 31.320]],
            "lst": 47.8, "ndvi": 0.07, "ndbi": 0.44, "severity": "CRITICAL", "rank": 1,
            "desc": "Ultra-dense historic commercial bazaar. Severe heat trap. Underground utility lines prevent ground planting. High-priority for Cool Roofs."
        },
        {
            "name": "Ward 18 - Phagwara Gate & Attari Bazaar",
            "code": "JAL-WARD-18",
            "lat": 31.3280, "lng": 75.5830, "area": 2.1, "pop": 16200,
            "coords": [[75.577, 31.322], [75.589, 31.322], [75.589, 31.334], [75.577, 31.334], [75.577, 31.322]],
            "lst": 46.9, "ndvi": 0.08, "ndbi": 0.39, "severity": "CRITICAL", "rank": 2,
            "desc": "Electronics and wholesale market. Metal canopies and asphalt paving. Recommended for tensile shade sails and cool pavements."
        },
        {
            "name": "Ward 22 - Industrial Focal Point & Leather Complex",
            "code": "JAL-WARD-22",
            "lat": 31.3520, "lng": 75.5450, "area": 6.5, "pop": 4100,
            "coords": [[75.535, 31.342], [75.555, 31.342], [75.555, 31.362], [75.535, 31.362], [75.535, 31.342]],
            "lst": 48.4, "ndvi": 0.05, "ndbi": 0.48, "severity": "CRITICAL", "rank": 3,
            "desc": "Industrial hub with heavy machinery emissions and metal sheet sheds. Ideal for boundary buffer plantations of Neem and Kikar."
        },
        {
            "name": "Ward 37 - Basti Sheikh & Basti Guzan",
            "code": "JAL-WARD-37",
            "lat": 31.3180, "lng": 75.5520, "area": 3.2, "pop": 14200,
            "coords": [[75.542, 31.310], [75.562, 31.310], [75.562, 31.326], [75.542, 31.326], [75.542, 31.310]],
            "lst": 44.5, "ndvi": 0.11, "ndbi": 0.28, "severity": "HIGH", "rank": 5,
            "desc": "Dense residential settlements with narrow alleys. Suitable for compact non-invasive species (Kachnar) and pocket green spaces."
        },
        {
            "name": "Ward 55 - Rama Mandi Corridors",
            "code": "JAL-WARD-55",
            "lat": 31.3160, "lng": 75.6180, "area": 4.8, "pop": 9500,
            "coords": [[75.605, 31.305], [75.631, 31.305], [75.631, 31.327], [75.605, 31.327], [75.605, 31.305]],
            "lst": 43.1, "ndvi": 0.16, "ndbi": 0.21, "severity": "HIGH", "rank": 7,
            "desc": "Major transit and highway junction with high particulate pollution. Suitable for avenue multi-tier shelterbelts of Tahli (Shisham) and Arjun."
        },
        {
            "name": "Ward 68 - GNDU Regional Campus & Urban Estate II",
            "code": "JAL-WARD-68",
            "lat": 31.2950, "lng": 75.6020, "area": 5.2, "pop": 5800,
            "coords": [[75.590, 31.285], [75.614, 31.285], [75.614, 31.305], [75.590, 31.305], [75.590, 31.285]],
            "lst": 37.4, "ndvi": 0.36, "ndbi": -0.09, "severity": "LOW", "rank": 18,
            "desc": "Academic campus and planned sector. Serves as reference urban cooling lung for Jalandhar. High potential for Miyawaki micro-forests."
        }
    ]

    ward_objects = {}
    for w in wards_data:
        loc = Location(
            parent_id=jalandhar_city.id,
            name=w["name"],
            code=w["code"],
            location_type="WARD",
            centroid_lat=w["lat"],
            centroid_lng=w["lng"],
            area_sqkm=w["area"],
            population_density=w["pop"],
            geojson_geometry=make_geojson_poly(w["coords"]),
            metadata_json={"description": w["desc"]}
        )
        db.add(loc)
        db.flush()
        ward_objects[w["code"]] = (loc, w)

    # 5. Location Licensing (ABAC Geofence Setup)
    # MCJ has access to Wards 4, 14, 18, 37, 55, 68
    for code, (loc_obj, _) in ward_objects.items():
        db.add(LocationAccess(
            organisation_id=mcj_org.id,
            location_id=loc_obj.id,
            valid_from=now - timedelta(days=30),
            valid_until=now + timedelta(days=335),
            is_active=True,
            license_tier="FULL_SUITE"
        ))

    # PGD (Private Developer) has access ONLY to Ward 22 (Focal Point) and Ward 68 (Campus)
    pgd_licensed_codes = ["JAL-WARD-22", "JAL-WARD-68"]
    for code in pgd_licensed_codes:
        loc_obj, _ = ward_objects[code]
        db.add(LocationAccess(
            organisation_id=pgd_org.id,
            location_id=loc_obj.id,
            valid_from=now - timedelta(days=15),
            valid_until=now + timedelta(days=350),
            is_active=True,
            license_tier="FULL_SUITE"
        ))
    db.flush()

    # 6. Satellite Assets & Heat Analysis
    satellite_scene = SatelliteAsset(
        location_id=jalandhar_city.id,
        satellite_platform="LANDSAT_9",
        scene_id="LC09_L1TP_148038_20260614_20260614_02_T1",
        acquisition_date=datetime(2026, 6, 14, 5, 30, tzinfo=timezone.utc),
        cloud_cover_pct=1.4,
        spatial_resolution_m=30.0,
        processed_ndvi_path="assets/rasters/jalandhar_ndvi_20260614.tif",
        processed_lst_path="assets/rasters/jalandhar_lst_20260614.tif",
        data_quality_notes="Calibrated USGS Collection 2 Level-1 thermal infrared band 10 using split-window radiative transfer.",
        is_verified=True
    )
    db.add(satellite_scene)
    db.flush()

    for code, (loc_obj, w) in ward_objects.items():
        analysis = HeatAnalysis(
            location_id=loc_obj.id,
            asset_id=satellite_scene.id,
            mean_lst_celsius=w["lst"],
            max_lst_celsius=round(w["lst"] + 2.8, 1),
            min_lst_celsius=round(w["lst"] - 3.4, 1),
            mean_ndvi=w["ndvi"],
            mean_ndbi=w["ndbi"],
            heat_island_intensity_celsius=round(w["lst"] - 36.5, 1),
            hotspot_severity=w["severity"],
            vulnerability_rank=w["rank"],
            hotspots_geojson=loc_obj.geojson_geometry,
            analysis_timestamp=datetime(2026, 6, 15, 10, 0, tzinfo=timezone.utc)
        )
        db.add(analysis)
    db.flush()

    # 7. Punjab Native Tree Species Database
    species_catalog = [
        {
            "botanical": "Azadirachta indica",
            "punjabi": "ਨਿੰਮ (Neem)",
            "english": "Neem Tree",
            "heat_max": 48.5, "drought": 5, "water": 12.0, "canopy": 7.0,
            "root": "TAPROOT_DEEP", "air_index": 22.4, "carbon": 24.5,
            "soil": "Alluvial Sandy-Loam", "growth": "MODERATE",
            "desc": "Super-resilient native evergreen. Deep taproot prevents paving upheaval. Unmatched anti-microbial and air purification qualities."
        },
        {
            "botanical": "Dalbergia sissoo",
            "punjabi": "ਟਾਹਲੀ / ਸ਼ੀਸ਼ਮ (Tahli / Shisham)",
            "english": "North Indian Rosewood",
            "heat_max": 47.0, "drought": 4, "water": 18.0, "canopy": 6.5,
            "root": "TAPROOT_DEEP", "air_index": 19.8, "carbon": 28.0,
            "soil": "Sandy Alluvium", "growth": "FAST",
            "desc": "Official State Tree of Punjab. Highly drought-tolerant once established. Fixes soil nitrogen and provides extensive shade."
        },
        {
            "botanical": "Vachellia nilotica",
            "punjabi": "ਕਿੱਕਰ / ਬਬੂਲ (Kikar)",
            "english": "Gum Arabic Tree",
            "heat_max": 49.5, "drought": 5, "water": 8.0, "canopy": 5.0,
            "root": "TAPROOT_DEEP", "air_index": 17.5, "carbon": 16.0,
            "soil": "Degraded / Saline / Sandy", "growth": "FAST",
            "desc": "Extreme heat and water deficit champion. Survives where almost no other tree can. Perfect for industrial wastelands and buffer belts."
        },
        {
            "botanical": "Terminalia arjuna",
            "punjabi": "ਅਰਜੁਨ (Arjun)",
            "english": "Arjun Tree",
            "heat_max": 46.0, "drought": 3, "water": 30.0, "canopy": 8.0,
            "root": "SPREADING", "air_index": 21.0, "carbon": 32.0,
            "soil": "Deep Alluvial Loam", "growth": "MODERATE",
            "desc": "Massive cooling canopy with high transpiration. Ideal for waterbody borders, city parks, and wide road medians."
        },
        {
            "botanical": "Ficus religiosa",
            "punjabi": "ਪਿੱਪਲ (Peepal)",
            "english": "Sacred Fig",
            "heat_max": 48.0, "drought": 5, "water": 16.0, "canopy": 10.0,
            "root": "SPREADING", "air_index": 24.0, "carbon": 35.0,
            "soil": "Adaptable to all soils", "growth": "FAST",
            "desc": "Monumental shade and oxygen producer. Invasive root system requires minimum 10m buffer from underground piping and foundation walls."
        },
        {
            "botanical": "Bauhinia variegata",
            "punjabi": "ਕਚਨਾਰ (Kachnar)",
            "english": "Orchid Tree",
            "heat_max": 44.0, "drought": 4, "water": 14.0, "canopy": 4.0,
            "root": "COMPACT", "air_index": 16.0, "carbon": 14.0,
            "soil": "Well-drained Loam", "growth": "MODERATE",
            "desc": "Medium-sized ornamental native flowering tree. Non-destructive roots make it the #1 recommendation for residential streets and narrow paths."
        },
        {
            "botanical": "Phyllanthus emblica",
            "punjabi": "ਔਂਵਲਾ (Amla)",
            "english": "Indian Gooseberry",
            "heat_max": 45.0, "drought": 4, "water": 15.0, "canopy": 4.5,
            "root": "COMPACT", "air_index": 18.0, "carbon": 15.0,
            "soil": "Light to medium loam", "growth": "MODERATE",
            "desc": "Hardy fruit-bearing tree with high medicinal value and community nutrition appeal. Thrives in institutional grounds."
        },
        {
            "botanical": "Morus alba",
            "punjabi": "ਤੂਤ (Toot)",
            "english": "White Mulberry",
            "heat_max": 45.5, "drought": 4, "water": 20.0, "canopy": 5.5,
            "root": "MODERATE", "air_index": 19.0, "carbon": 18.5,
            "soil": "Sandy-loam", "growth": "FAST",
            "desc": "Rapidly creating dense summer pedestrian shade with edible berries. Attracts high avian biodiversity in urban environments."
        }
    ]

    species_objects = {}
    for s in species_catalog:
        sp = TreeSpecies(
            botanical_name=s["botanical"],
            common_name_punjabi=s["punjabi"],
            common_name_english=s["english"],
            heat_tolerance_max_celsius=s["heat_max"],
            drought_tolerance_rating=s["drought"],
            water_requirement_liters_day=s["water"],
            mature_canopy_radius_m=s["canopy"],
            root_profile=s["root"],
            air_pollution_tolerance_index=s["air_index"],
            carbon_sequestration_kg_yr=s["carbon"],
            preferred_soil=s["soil"],
            growth_rate=s["growth"],
            description=s["desc"]
        )
        db.add(sp)
        db.flush()
        species_objects[s["botanical"]] = sp

    # 8. Plantation Sites & Planted Trees
    # Site 1: Model Town Green Belt (Ward 4)
    model_town_site = PlantationSite(
        location_id=ward_objects["JAL-WARD-04"][0].id,
        organisation_id=mcj_org.id,
        site_name="Model Town Central Green Avenue",
        lat=31.3105, lng=75.5825,
        site_type="ROADSIDE_STRIP",
        feasibility_status="SUITABLE",
        available_area_sqm=1200.0,
        estimated_capacity_trees=60,
        soil_type="Alluvial Sandy Loam",
        water_source_distance_m=25.0
    )
    # Site 2: Rama Mandi Bypass Median (Ward 55)
    rama_mandi_site = PlantationSite(
        location_id=ward_objects["JAL-WARD-55"][0].id,
        organisation_id=mcj_org.id,
        site_name="Rama Mandi GT Road Green Buffer",
        lat=31.3175, lng=75.6190,
        site_type="MEDIAN",
        feasibility_status="SUITABLE",
        available_area_sqm=2500.0,
        estimated_capacity_trees=120,
        soil_type="Compacted Loam",
        water_source_distance_m=40.0
    )
    # Site 3: Rainak Bazaar (Ward 14) - Unsuitable for trees!
    rainak_site = PlantationSite(
        location_id=ward_objects["JAL-WARD-14"][0].id,
        organisation_id=mcj_org.id,
        site_name="Rainak Bazaar Main Market Junction",
        lat=31.3255, lng=75.5750,
        site_type="VACANT_LOT",
        feasibility_status="UNSUITABLE_PLANTATION",
        unsuitability_reason="Dense subterranean sewerage lines, 3m road clearance limit, continuous vehicle/pedestrian movement. Civil alternative cooling required.",
        available_area_sqm=0.0,
        estimated_capacity_trees=0
    )
    db.add_all([model_town_site, rama_mandi_site, rainak_site])
    db.flush()

    # Planted Trees with Geotags & Photo Records
    neem_sp = species_objects["Azadirachta indica"]
    tahli_sp = species_objects["Dalbergia sissoo"]
    kachnar_sp = species_objects["Bauhinia variegata"]

    tree_records = [
        {"tag": "JAL-MCJ-2026-001", "site": model_town_site, "sp": neem_sp, "lat": 31.31045, "lng": 75.58245, "height": 140.0, "status": "THRIVING"},
        {"tag": "JAL-MCJ-2026-002", "site": model_town_site, "sp": neem_sp, "lat": 31.31052, "lng": 75.58255, "height": 135.0, "status": "THRIVING"},
        {"tag": "JAL-MCJ-2026-003", "site": model_town_site, "sp": kachnar_sp, "lat": 31.31060, "lng": 75.58265, "height": 110.0, "status": "THRIVING"},
        {"tag": "JAL-MCJ-2026-004", "site": rama_mandi_site, "sp": tahli_sp, "lat": 31.31745, "lng": 75.61895, "height": 160.0, "status": "THRIVING"},
        {"tag": "JAL-MCJ-2026-005", "site": rama_mandi_site, "sp": tahli_sp, "lat": 31.31755, "lng": 75.61910, "height": 155.0, "status": "DISTRESSED"},
        {"tag": "JAL-MCJ-2026-006", "site": rama_mandi_site, "sp": neem_sp, "lat": 31.31765, "lng": 75.61925, "height": 145.0, "status": "THRIVING"},
    ]

    for tr in tree_records:
        planted = PlantedTree(
            organisation_id=mcj_org.id,
            site_id=tr["site"].id,
            species_id=tr["sp"].id,
            tree_unique_tag=tr["tag"],
            plantation_date=now - timedelta(days=95),
            lat=tr["lat"],
            lng=tr["lng"],
            initial_height_cm=tr["height"] - 25.0,
            initial_photo_url="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
            status=tr["status"],
            created_by=mcj_field.id
        )
        db.add(planted)
        db.flush()

        # Day 0 Inspection
        db.add(TreeInspection(
            planted_tree_id=planted.id,
            inspector_user_id=mcj_field.id,
            inspection_date=now - timedelta(days=95),
            inspection_milestone="DAY_0",
            current_height_cm=tr["height"] - 25.0,
            health_rating=5,
            soil_moisture_condition="OPTIMAL",
            watering_evidence_photo_url="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
            gps_latitude=tr["lat"],
            gps_longitude=tr["lng"],
            gps_verified_distance_m=0.4,
            is_gps_verified=True,
            notes="Initial plantation audit completed. Soil nourished with organic compost."
        ))

        # Month 3 Inspection (Recently completed)
        db.add(TreeInspection(
            planted_tree_id=planted.id,
            inspector_user_id=mcj_field.id,
            inspection_date=now - timedelta(days=5),
            inspection_milestone="MONTH_3",
            current_height_cm=tr["height"],
            health_rating=4 if tr["status"] == "THRIVING" else 2,
            soil_moisture_condition="OPTIMAL" if tr["status"] == "THRIVING" else "DRY",
            watering_evidence_photo_url="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600",
            gps_latitude=tr["lat"] + 0.00001,
            gps_longitude=tr["lng"] + 0.00001,
            gps_verified_distance_m=1.2,
            is_gps_verified=True,
            notes="Month 3 survival audit. New leaf flush observed." if tr["status"] == "THRIVING" else "Water stress signs detected. Direct irrigation scheduled."
        ))
    db.flush()

    # 9. Alternative Urban Cooling Interventions (For dense unplantable zones)
    cooling_solutions = [
        CoolingRecommendation(
            location_id=ward_objects["JAL-WARD-14"][0].id,
            intervention_type="COOL_ROOFS",
            target_area_name="Rainak Bazaar Municipal Complex & Commercial Terraces",
            surface_area_sqm=4500.0,
            estimated_surface_cooling_celsius=7.8,
            implementation_complexity="LOW",
            water_dependency="NONE",
            estimated_cost_inr_sqm=380.0,
            engineering_rationale="High solar reflectance index coating (SRI > 82) on flat concrete and bitumen roofs. Replaces dark heat-absorbing surfaces without requiring soil or plumbing.",
            maintenance_requirements="Semi-annual dust washing prior to peak summer (May)."
        ),
        CoolingRecommendation(
            location_id=ward_objects["JAL-WARD-14"][0].id,
            intervention_type="TENSILE_SHADE_CANOPY",
            target_area_name="Jyoti Chowk to Rainak Bazaar Pedestrian Walkway",
            surface_area_sqm=1200.0,
            estimated_surface_cooling_celsius=5.2,
            implementation_complexity="MEDIUM",
            water_dependency="NONE",
            estimated_cost_inr_sqm=1250.0,
            engineering_rationale="Suspended UV-reflective tensile fabric canopies strung between non-load bearing facade anchors. Immediate thermal comfort relief for pedestrians.",
            maintenance_requirements="Annual cable tension audit and monsoon storm retraction."
        ),
        CoolingRecommendation(
            location_id=ward_objects["JAL-WARD-18"][0].id,
            intervention_type="PERMEABLE_COOL_PAVEMENT",
            target_area_name="Phagwara Gate Hardware Plaza Paving",
            surface_area_sqm=2800.0,
            estimated_surface_cooling_celsius=4.5,
            implementation_complexity="HIGH",
            water_dependency="LOW",
            estimated_cost_inr_sqm=950.0,
            engineering_rationale="High-albedo interlocking porous concrete pavers. Facilitates storm water infiltration into the aquifer while reducing night-time heat radiation.",
            maintenance_requirements="Quarterly suction sweeping to prevent silt pore clogging."
        )
    ]
    db.add_all(cooling_solutions)
    db.flush()

    # 10. Audit Log Initial Records
    db.add(AuditLog(
        organisation_id=ops_org.id,
        user_id=super_admin.id,
        action="SYSTEM_INIT",
        resource="DATABASE_SEED",
        client_ip="127.0.0.1",
        status_code=200,
        details_json={"pilot": "Jalandhar", "wards_seeded": len(ward_objects), "species_seeded": len(species_catalog)}
    ))

    db.commit()
    db.close()
    print("--- SEEDING COMPLETED SUCCESSFULLY! ---")

if __name__ == "__main__":
    seed_database()
