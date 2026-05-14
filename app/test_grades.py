import asyncio
from app.services.grade_service import compute_gwa_from_list
from decimal import Decimal

async def test_compute():
    print("Testing compute_gwa_from_list...")
    # Test case: 1.0 (3 units) + 2.0 (3 units) = 1.5 GWA
    courses = [
        {"course_code": "MATH1", "units": 3.0, "course_grade": 1.0},
        {"course_code": "MATH2", "units": 3.0, "course_grade": 2.0},
        {"course_code": "IGNORE", "units": 0, "course_grade": 5.0}, # Zero units ignored
        {"course_code": "INC_TEST", "units": 3.0, "course_grade": "INC"} # Non-numeric ignored
    ]
    
    gwa, count = compute_gwa_from_list(courses)
    print(f"Result GWA: {gwa} (Expected: 1.5000)")
    print(f"Result Count: {count} (Expected: 4)")
    
    if gwa == Decimal("1.5000"):
        print("✅ SUCCESS: Math logic is correct.")
    else:
        print("❌ FAILURE: Math logic mismatch.")

if __name__ == "__main__":
    asyncio.run(test_compute())
