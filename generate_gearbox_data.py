import json
import random
import math

random.seed(42)

YEARS = list(range(2021, 2034))

GEO_HIERARCHY = {
    "North America": ["U.S.", "Canada"],
    "Europe": ["U.K.", "Germany", "Italy", "France", "Spain", "Russia", "Rest of Europe"],
    "Asia Pacific": ["China", "India", "Japan", "South Korea", "ASEAN", "Australia", "Rest of Asia Pacific"],
    "Latin America": ["Brazil", "Argentina", "Mexico", "Rest of Latin America"],
    "Middle East & Africa": ["GCC", "South Africa", "Rest of Middle East & Africa"]
}

REGION_WEIGHTS = {
    "North America": 0.22,
    "Europe": 0.30,
    "Asia Pacific": 0.32,
    "Latin America": 0.08,
    "Middle East & Africa": 0.08
}

COUNTRY_WEIGHTS = {
    "North America": {"U.S.": 0.78, "Canada": 0.22},
    "Europe": {"U.K.": 0.15, "Germany": 0.22, "Italy": 0.14, "France": 0.16, "Spain": 0.10, "Russia": 0.08, "Rest of Europe": 0.15},
    "Asia Pacific": {"China": 0.30, "India": 0.15, "Japan": 0.22, "South Korea": 0.12, "ASEAN": 0.10, "Australia": 0.05, "Rest of Asia Pacific": 0.06},
    "Latin America": {"Brazil": 0.42, "Argentina": 0.18, "Mexico": 0.25, "Rest of Latin America": 0.15},
    "Middle East & Africa": {"GCC": 0.45, "South Africa": 0.25, "Rest of Middle East & Africa": 0.30}
}

SEGMENTS = {
    "By Product Type": {
        "type": "flat",
        "items": [
            "Helical Gearbox",
            "Bevel Gearbox",
            "Spur Gearbox",
            "Others (Worm Gearbox, Planetary Gearbox, etc.)"
        ]
    },
    "By Gear Train Stage Count": {
        "type": "flat",
        "items": [
            "Single-stage",
            "Two-stage",
            "Three-stage and Above"
        ]
    },
    "By Gearbox Rated Input Power": {
        "type": "flat",
        "items": [
            "Up to 150 kW",
            "151 kW to 500 kW",
            "501 kW to 1,500 kW",
            "1,501 kW to 5,000 kW",
            "Above 5,000 kW"
        ]
    },
    "By Application": {
        "type": "hierarchical",
        "items": {
            "Main Propulsion": None,
            "Secondary, Emergency and Hybrid Propulsion (PTI)": None,
            "PTO and PTI for Auxiliary Loads": {
                "Generator Drive": None,
                "Pump Drive": None,
                "Winch, Crane & Deck Machinery Drive": None
            },
            "Thruster and Maneuvering Drive": None,
            "Dredge Pump and Dredging Drive": None,
            "Special Mission Drive": None
        }
    },
    "By Vessel Type": {
        "type": "hierarchical",
        "items": {
            "Commercial Vessels": {
                "Bulk Carriers": None,
                "Tankers": None,
                "Container Ships": None,
                "General Cargo and Multi-Purpose Vessels": None,
                "Ro-Ro and Car Carriers": None,
                "Others (Tug Boats & Workboats, Inland Waterway Vessels, etc.)": None
            },
            "Naval and Defence Vessels": {
                "Surface Combatants": None,
                "Submarines and Underwater Vehicles": None,
                "Patrol and Coast Guard Vessels": None,
                "Naval Auxiliaries and Replenishment Ships": None
            },
            "Recreational Vessels": None
        }
    },
    "By Sales Channel": {
        "type": "flat",
        "items": [
            "Newbuild OEM Fitment",
            "Retrofit and Replacement"
        ]
    }
}

SEGMENT_WEIGHTS = {
    "By Product Type": {
        "Helical Gearbox": 0.35,
        "Bevel Gearbox": 0.28,
        "Spur Gearbox": 0.20,
        "Others (Worm Gearbox, Planetary Gearbox, etc.)": 0.17
    },
    "By Gear Train Stage Count": {
        "Single-stage": 0.32,
        "Two-stage": 0.42,
        "Three-stage and Above": 0.26
    },
    "By Gearbox Rated Input Power": {
        "Up to 150 kW": 0.18,
        "151 kW to 500 kW": 0.24,
        "501 kW to 1,500 kW": 0.26,
        "1,501 kW to 5,000 kW": 0.20,
        "Above 5,000 kW": 0.12
    },
    "By Application": {
        "Main Propulsion": 0.32,
        "Secondary, Emergency and Hybrid Propulsion (PTI)": 0.15,
        "PTO and PTI for Auxiliary Loads": {
            "_total": 0.22,
            "Generator Drive": 0.40,
            "Pump Drive": 0.35,
            "Winch, Crane & Deck Machinery Drive": 0.25
        },
        "Thruster and Maneuvering Drive": 0.14,
        "Dredge Pump and Dredging Drive": 0.10,
        "Special Mission Drive": 0.07
    },
    "By Vessel Type": {
        "Commercial Vessels": {
            "_total": 0.52,
            "Bulk Carriers": 0.22,
            "Tankers": 0.20,
            "Container Ships": 0.25,
            "General Cargo and Multi-Purpose Vessels": 0.15,
            "Ro-Ro and Car Carriers": 0.10,
            "Others (Tug Boats & Workboats, Inland Waterway Vessels, etc.)": 0.08
        },
        "Naval and Defence Vessels": {
            "_total": 0.33,
            "Surface Combatants": 0.35,
            "Submarines and Underwater Vehicles": 0.28,
            "Patrol and Coast Guard Vessels": 0.22,
            "Naval Auxiliaries and Replenishment Ships": 0.15
        },
        "Recreational Vessels": 0.15
    },
    "By Sales Channel": {
        "Newbuild OEM Fitment": 0.62,
        "Retrofit and Replacement": 0.38
    }
}

GLOBAL_VALUE_2021 = 2850
GLOBAL_VOLUME_2021 = 42000
BASE_CAGR = 0.065


def generate_time_series(base_value, years, cagr, noise_factor=0.03):
    values = {}
    current = base_value
    for i, year in enumerate(years):
        noise = 1 + random.uniform(-noise_factor, noise_factor)
        if i == 0:
            values[str(year)] = round(current, 1)
        else:
            year_growth = cagr * (1 + random.uniform(-0.15, 0.15))
            current = current * (1 + year_growth) * noise
            values[str(year)] = round(current, 1)
    return values


def generate_volume_time_series(base_value, years, cagr, noise_factor=0.03):
    values = {}
    current = base_value
    for i, year in enumerate(years):
        noise = 1 + random.uniform(-noise_factor, noise_factor)
        if i == 0:
            values[str(year)] = round(current)
        else:
            year_growth = cagr * (1 + random.uniform(-0.15, 0.15))
            current = current * (1 + year_growth) * noise
            values[str(year)] = round(current)
    return values


def build_hierarchical_data(seg_type, base_value, years, cagr, is_volume=False):
    data = {}
    w = SEGMENT_WEIGHTS[seg_type]

    for key, val in w.items():
        if isinstance(val, dict):
            parent_total = val["_total"]
            parent_base = base_value * parent_total

            # First generate children data
            children_data = {}
            child_entries = [(ck, cv) for ck, cv in val.items() if ck != "_total"]

            for child_key, child_weight in child_entries:
                child_base = parent_base * child_weight
                if is_volume:
                    children_data[child_key] = generate_volume_time_series(child_base, years, cagr * (1 + random.uniform(-0.1, 0.1)))
                else:
                    children_data[child_key] = generate_time_series(child_base, years, cagr * (1 + random.uniform(-0.1, 0.1)))

            # Build parent node with aggregated year data + children
            # Sum children values per year for the aggregated parent data
            parent_node = {}
            for yr in [str(y) for y in years]:
                total = 0
                for child_ts in children_data.values():
                    total += child_ts[yr]
                if is_volume:
                    parent_node[yr] = round(total)
                else:
                    parent_node[yr] = round(total, 1)
            parent_node["_aggregated"] = True
            parent_node["_level"] = 2

            # Add children as nested objects
            for child_key, child_ts in children_data.items():
                parent_node[child_key] = child_ts

            data[key] = parent_node

        elif isinstance(val, (int, float)):
            seg_base = base_value * val
            if is_volume:
                data[key] = generate_volume_time_series(seg_base, years, cagr * (1 + random.uniform(-0.1, 0.1)))
            else:
                data[key] = generate_time_series(seg_base, years, cagr * (1 + random.uniform(-0.1, 0.1)))

    return data


def build_flat_data(seg_type, base_value, years, cagr, is_volume=False):
    data = {}
    w = SEGMENT_WEIGHTS[seg_type]

    for key, weight in w.items():
        seg_base = base_value * weight
        if is_volume:
            data[key] = generate_volume_time_series(seg_base, years, cagr * (1 + random.uniform(-0.1, 0.1)))
        else:
            data[key] = generate_time_series(seg_base, years, cagr * (1 + random.uniform(-0.1, 0.1)))

    return data


def generate_geo_data(geo_base, years, cagr, is_volume=False):
    geo_data = {}
    for seg_type in SEGMENTS:
        seg_info = SEGMENTS[seg_type]
        if seg_info["type"] == "flat":
            geo_data[seg_type] = build_flat_data(seg_type, geo_base, years, cagr, is_volume)
        else:
            geo_data[seg_type] = build_hierarchical_data(seg_type, geo_base, years, cagr, is_volume)
    return geo_data


# Generate value.json
print("Generating value.json...")
value_data = {}

for region, countries in GEO_HIERARCHY.items():
    region_base = GLOBAL_VALUE_2021 * REGION_WEIGHTS[region]
    region_cagr = BASE_CAGR * (1 + random.uniform(-0.08, 0.08))

    random.seed(hash(region) % 2**32)
    value_data[region] = generate_geo_data(region_base, YEARS, region_cagr)

    value_data[region]["By Country"] = {}
    for country in countries:
        country_weight = COUNTRY_WEIGHTS[region][country]
        country_base = region_base * country_weight
        value_data[region]["By Country"][country] = generate_time_series(country_base, YEARS, region_cagr)

    for country in countries:
        country_weight = COUNTRY_WEIGHTS[region][country]
        country_base = region_base * country_weight
        country_cagr = region_cagr * (1 + random.uniform(-0.05, 0.05))
        random.seed(hash(country) % 2**32)
        value_data[country] = generate_geo_data(country_base, YEARS, country_cagr)

with open("public/data/value.json", "w") as f:
    json.dump(value_data, f, indent=2)
print(f"  Written value.json with {len(value_data)} geographies")

# Generate volume.json
print("Generating volume.json...")
volume_data = {}

for region, countries in GEO_HIERARCHY.items():
    region_base_vol = GLOBAL_VOLUME_2021 * REGION_WEIGHTS[region]
    region_cagr = BASE_CAGR * (1 + random.uniform(-0.08, 0.08))

    random.seed(hash(region + "_vol") % 2**32)
    volume_data[region] = generate_geo_data(region_base_vol, YEARS, region_cagr, is_volume=True)

    volume_data[region]["By Country"] = {}
    for country in countries:
        country_weight = COUNTRY_WEIGHTS[region][country]
        country_base_vol = region_base_vol * country_weight
        volume_data[region]["By Country"][country] = generate_volume_time_series(country_base_vol, YEARS, region_cagr)

    for country in countries:
        country_weight = COUNTRY_WEIGHTS[region][country]
        country_base_vol = region_base_vol * country_weight
        country_cagr = region_cagr * (1 + random.uniform(-0.05, 0.05))
        random.seed(hash(country + "_vol") % 2**32)
        volume_data[country] = generate_geo_data(country_base_vol, YEARS, country_cagr, is_volume=True)

with open("public/data/volume.json", "w") as f:
    json.dump(volume_data, f, indent=2)
print(f"  Written volume.json with {len(volume_data)} geographies")

# Generate segmentation_analysis.json
print("Generating segmentation_analysis.json...")
seg_analysis = {"Global": {}}

for seg_type, seg_info in SEGMENTS.items():
    if seg_info["type"] == "flat":
        seg_analysis["Global"][seg_type] = {}
        for item in seg_info["items"]:
            seg_analysis["Global"][seg_type][item] = {}
    else:
        seg_analysis["Global"][seg_type] = {}
        items = seg_info["items"]
        for key, children in items.items():
            if children is None:
                seg_analysis["Global"][seg_type][key] = {}
            else:
                seg_analysis["Global"][seg_type][key] = {}
                for child_key in children:
                    seg_analysis["Global"][seg_type][key][child_key] = {}

seg_analysis["Global"]["By Region"] = {}
for region, countries in GEO_HIERARCHY.items():
    seg_analysis["Global"]["By Region"][region] = {}
    for country in countries:
        seg_analysis["Global"]["By Region"][region][country] = {}

with open("public/data/segmentation_analysis.json", "w") as f:
    json.dump(seg_analysis, f, indent=2)
print("  Written segmentation_analysis.json")

print("\nDone! All data files generated for Marine Gearbox Market.")
print(f"Segment types: {list(SEGMENTS.keys())}")
print(f"Geographies: {len(value_data)} total")
