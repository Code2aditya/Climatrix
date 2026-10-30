import pytest
from app.core.database import SessionLocal
from app.models.all_models import (
    Organisation,
    User,
    Location,
    LocationAccess,
    HeatAnalysis,
    TreeSpecies,
    PlantedTree,
    TreeInspection,
    CoolingRecommendation
)

def test_seeded_organisations_and_users():
    db = SessionLocal()
    try:
        mcj = db.query(Organisation).filter_by(slug="mcjalandhar").first()
        pgd = db.query(Organisation).filter_by(slug="pgd-infra").first()
        assert mcj is not None, "MCJ organisation missing"
        assert pgd is not None, "PGD organisation missing"

        # Check users
        mcj_users = db.query(User).filter_by(organisation_id=mcj.id).all()
        roles = {u.role for u in mcj_users}
        assert "ORG_ADMIN" in roles, "MCJ Admin missing"
        assert "ANALYST" in roles, "MCJ Analyst missing"
        assert "FIELD_WORKER" in roles, "MCJ Field Worker missing"
    finally:
        db.close()

def test_abac_location_license_isolation():
    db = SessionLocal()
    try:
        mcj = db.query(Organisation).filter_by(slug="mcjalandhar").first()
        pgd = db.query(Organisation).filter_by(slug="pgd-infra").first()

        # Find Ward 14 (Rainak Bazaar - Critical Heat Hotspot)
        ward_14 = db.query(Location).filter_by(code="JAL-WARD-14").first()
        assert ward_14 is not None, "Ward 14 missing"

        # MCJ MUST have license to Ward 14
        mcj_license = db.query(LocationAccess).filter_by(
            organisation_id=mcj.id,
            location_id=ward_14.id
        ).first()
        assert mcj_license is not None, "MCJ should hold license to Ward 14"

        # PGD MUST NOT have license to Ward 14 (Strict isolation)
        pgd_license = db.query(LocationAccess).filter_by(
            organisation_id=pgd.id,
            location_id=ward_14.id
        ).first()
        assert pgd_license is None, "SECURITY FAILURE: PGD holds unauthorized license to Ward 14!"

        # PGD MUST have license to Ward 22 (Industrial Focal Point)
        ward_22 = db.query(Location).filter_by(code="JAL-WARD-22").first()
        pgd_ward_22 = db.query(LocationAccess).filter_by(
            organisation_id=pgd.id,
            location_id=ward_22.id
        ).first()
        assert pgd_ward_22 is not None, "PGD should hold license to Ward 22"
    finally:
        db.close()

def test_punjab_native_species_catalog():
    db = SessionLocal()
    try:
        species = db.query(TreeSpecies).all()
        assert len(species) >= 8, f"Expected at least 8 native species, found {len(species)}"
        
        botanical_names = {s.botanical_name for s in species}
        assert "Azadirachta indica" in botanical_names  # Neem
        assert "Dalbergia sissoo" in botanical_names    # Shisham / Tahli (Punjab State Tree)
        assert "Vachellia nilotica" in botanical_names  # Kikar
        assert "Bauhinia variegata" in botanical_names  # Kachnar

        # Test climate resilience ratings
        neem = db.query(TreeSpecies).filter_by(botanical_name="Azadirachta indica").first()
        assert neem.heat_tolerance_max_celsius >= 48.0
        assert neem.drought_tolerance_rating == 5
    finally:
        db.close()

def test_planted_tree_inspections_and_survival():
    db = SessionLocal()
    try:
        trees = db.query(PlantedTree).all()
        assert len(trees) >= 5, "Expected planted trees in registry"

        for tree in trees:
            inspections = db.query(TreeInspection).filter_by(planted_tree_id=tree.id).all()
            assert len(inspections) >= 1, f"Tree {tree.tree_unique_tag} missing inspection history"
            for insp in inspections:
                assert insp.is_gps_verified is True
                assert insp.gps_verified_distance_m < 5.0, "GPS deviation exceeds 5m threshold"
    finally:
        db.close()

def test_alternative_cooling_solutions_for_unplantable_zones():
    db = SessionLocal()
    try:
        ward_14 = db.query(Location).filter_by(code="JAL-WARD-14").first()
        cooling = db.query(CoolingRecommendation).filter_by(location_id=ward_14.id).all()
        assert len(cooling) >= 1, "Expected alternative cooling recommendations for Ward 14"
        
        types = {c.intervention_type for c in cooling}
        assert "COOL_ROOFS" in types or "TENSILE_SHADE_CANOPY" in types
    finally:
        db.close()

if __name__ == "__main__":
    test_seeded_organisations_and_users()
    test_abac_location_license_isolation()
    test_punjab_native_species_catalog()
    test_planted_tree_inspections_and_survival()
    test_alternative_cooling_solutions_for_unplantable_zones()
    print("ALL PHASE 2 DATABASE & SEED TESTS PASSED!")
