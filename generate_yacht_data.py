#!/usr/bin/env python3
"""
Generate yacht market data files:
- segmentation_analysis.json
- value.json (USD Million)
- volume.json (Number of Yachts)
"""

import json
import random
import os

random.seed(42)

YEARS = list(range(2021, 2034))
YEAR_STRS = [str(y) for y in YEARS]

# Geography structure (same as existing)
GEOGRAPHY = {
    "North America": {
        "countries": ["U.S.", "Canada"],
        "weight": 0.28
    },
    "Europe": {
        "countries": ["U.K.", "Germany", "Italy", "France", "Spain", "Russia", "Rest of Europe"],
        "weight": 0.35
    },
    "Asia Pacific": {
        "countries": ["China", "India", "Japan", "South Korea", "ASEAN", "Australia", "Rest of Asia Pacific"],
        "weight": 0.20
    },
    "Latin America": {
        "countries": ["Brazil", "Argentina", "Mexico", "Rest of Latin America"],
        "weight": 0.08
    },
    "Middle East & Africa": {
        "countries": ["GCC", "South Africa", "Rest of Middle East & Africa"],
        "weight": 0.09
    }
}

# Country weights within their region
COUNTRY_WEIGHTS = {
    "U.S.": 0.82, "Canada": 0.18,
    "U.K.": 0.14, "Germany": 0.12, "Italy": 0.22, "France": 0.18,
    "Spain": 0.10, "Russia": 0.06, "Rest of Europe": 0.18,
    "China": 0.25, "India": 0.08, "Japan": 0.20, "South Korea": 0.12,
    "ASEAN": 0.15, "Australia": 0.12, "Rest of Asia Pacific": 0.08,
    "Brazil": 0.40, "Argentina": 0.15, "Mexico": 0.25, "Rest of Latin America": 0.20,
    "GCC": 0.55, "South Africa": 0.15, "Rest of Middle East & Africa": 0.30
}

# ============================================================
# SEGMENT DEFINITIONS
# ============================================================

# By Service - hierarchical
BY_SERVICE = {
    "Yacht Brokerage Service": {
        "children": [
            "New Build Brokerage",
            "Pre Owned Yacht Brokerage",
            "Sale And Purchase Advisory"
        ],
        "child_weights": [0.45, 0.35, 0.20]
    },
    "Yacht Management Service": {
        "children": [
            "Full Scope Yacht Management",
            "Technical Management Only",
            "Crew Management Only",
            "Compliance And Regulatory Management Only",
            "Financial And Accounting Management Only"
        ],
        "child_weights": [0.30, 0.22, 0.20, 0.15, 0.13]
    },
    "Yacht Charter Service": {
        "children": [],
        "child_weights": []
    }
}
# Global base values (2021, USD Million) for each top-level service
SERVICE_BASE_VALUES = {
    "Yacht Brokerage Service": 3200,
    "Yacht Management Service": 2800,
    "Yacht Charter Service": 1500
}
SERVICE_GROWTH_RATES = {
    "Yacht Brokerage Service": 0.072,
    "Yacht Management Service": 0.068,
    "Yacht Charter Service": 0.085
}

# By Length - flat
BY_LENGTH = [
    "Below 30 Meters",
    "30-50 Meters",
    "50-70 Meters",
    "70-100 Meters",
    "Above 100 Meters"
]
LENGTH_BASE_VALUES = {
    "Below 30 Meters": 1800,
    "30-50 Meters": 2200,
    "50-70 Meters": 1600,
    "70-100 Meters": 1200,
    "Above 100 Meters": 700
}
LENGTH_GROWTH_RATES = {
    "Below 30 Meters": 0.060,
    "30-50 Meters": 0.072,
    "50-70 Meters": 0.075,
    "70-100 Meters": 0.082,
    "Above 100 Meters": 0.090
}

# By Service, By Length - cross product (3-level hierarchy)
# Top level: Service category by Length
# Mid level: Sub-service
# Leaf level: Length range
SERVICE_BY_LENGTH_CATEGORIES = {
    "Yacht Brokerage Service by Length": {
        "sub_services": ["New Build Brokerage", "Pre Owned Yacht Brokerage", "Sale And Purchase Advisory"],
        "sub_weights": [0.45, 0.35, 0.20],
        "base_value": 3200,
        "growth": 0.072
    },
    "Yacht Management Service by Length": {
        "sub_services": ["Full Scope Yacht Management", "Technical Management Only", "Crew Management Only",
                         "Compliance And Regulatory Management Only", "Financial And Accounting Management Only"],
        "sub_weights": [0.30, 0.22, 0.20, 0.15, 0.13],
        "base_value": 2800,
        "growth": 0.068
    },
    "Yacht Charter Service By Length": {
        "sub_services": [],  # Direct to lengths
        "sub_weights": [],
        "base_value": 1500,
        "growth": 0.085
    }
}
LENGTH_DIST_WEIGHTS = {
    "Below 30 Meters": 0.24,
    "30-50 Meters": 0.29,
    "50-70 Meters": 0.21,
    "70-100 Meters": 0.16,
    "Above 100 Meters": 0.10
}

# By Propulsion Type - flat
BY_PROPULSION = [
    "Conventional Diesel Propulsion",
    "Diesel-electric Propulsion",
    "Others (Hybrid, Waterjet propulsion, Gas Turbine, etc.)"
]
PROPULSION_BASE_VALUES = {
    "Conventional Diesel Propulsion": 4200,
    "Diesel-electric Propulsion": 2000,
    "Others (Hybrid, Waterjet propulsion, Gas Turbine, etc.)": 1300
}
PROPULSION_GROWTH_RATES = {
    "Conventional Diesel Propulsion": 0.055,
    "Diesel-electric Propulsion": 0.092,
    "Others (Hybrid, Waterjet propulsion, Gas Turbine, etc.)": 0.105
}

# Volume base values (number of yachts) - much smaller numbers
VOLUME_SCALE = 0.008  # Roughly 0.8% of value to get yacht counts


def generate_time_series(base_value, growth_rate, noise_factor=0.02):
    """Generate a time series with growth and slight noise."""
    values = []
    current = base_value
    for i, year in enumerate(YEARS):
        noise = random.uniform(-noise_factor, noise_factor)
        factor = 1 + growth_rate + noise
        if i == 0:
            values.append(round(current, 1))
        else:
            current = current * factor
            values.append(round(current, 1))
    return {str(y): v for y, v in zip(YEARS, values)}


def scale_time_series(ts, factor):
    """Scale a time series by a factor."""
    return {k: round(v * factor, 1) for k, v in ts.items()}


def sum_time_series(*series_list):
    """Sum multiple time series."""
    result = {}
    for year in YEAR_STRS:
        result[year] = round(sum(ts.get(year, 0) for ts in series_list), 1)
    return result


def generate_segmentation_analysis():
    """Generate the segmentation_analysis.json file."""
    analysis = {
        "Global": {
            "By Service": {},
            "By Length": {},
            "By Service, By Length": {},
            "By Propulsion Type": {},
            "By Region": {}
        }
    }

    # By Service
    for service, info in BY_SERVICE.items():
        if info["children"]:
            analysis["Global"]["By Service"][service] = {
                child: {} for child in info["children"]
            }
        else:
            analysis["Global"]["By Service"][service] = {}

    # By Length
    for length in BY_LENGTH:
        analysis["Global"]["By Length"][length] = {}

    # By Service, By Length
    for cat_name, cat_info in SERVICE_BY_LENGTH_CATEGORIES.items():
        if cat_info["sub_services"]:
            cat_data = {}
            for sub in cat_info["sub_services"]:
                cat_data[sub] = {length: {} for length in BY_LENGTH}
            analysis["Global"]["By Service, By Length"][cat_name] = cat_data
        else:
            # Direct to lengths (Yacht Charter Service)
            analysis["Global"]["By Service, By Length"][cat_name] = {
                length: {} for length in BY_LENGTH
            }

    # By Propulsion Type
    for prop in BY_PROPULSION:
        analysis["Global"]["By Propulsion Type"][prop] = {}

    # By Region
    for region, info in GEOGRAPHY.items():
        if info["countries"]:
            analysis["Global"]["By Region"][region] = {
                country: {} for country in info["countries"]
            }
        else:
            analysis["Global"]["By Region"][region] = {}

    return analysis


def generate_by_service_data(geo_weight):
    """Generate By Service segment data for a geography."""
    data = {}
    for service, info in BY_SERVICE.items():
        base = SERVICE_BASE_VALUES[service] * geo_weight
        growth = SERVICE_GROWTH_RATES[service]

        if info["children"]:
            # Generate children first
            child_series = []
            parent_data = {"_aggregated": True, "_level": 2}
            for child, weight in zip(info["children"], info["child_weights"]):
                child_base = base * weight
                ts = generate_time_series(child_base, growth)
                parent_data[child] = ts
                child_series.append(ts)

            # Parent aggregation
            agg = sum_time_series(*child_series)
            parent_data.update(agg)
            data[service] = parent_data
        else:
            ts = generate_time_series(base, growth)
            data[service] = ts

    return data


def generate_by_length_data(geo_weight):
    """Generate By Length segment data for a geography."""
    data = {}
    for length in BY_LENGTH:
        base = LENGTH_BASE_VALUES[length] * geo_weight
        growth = LENGTH_GROWTH_RATES[length]
        data[length] = generate_time_series(base, growth)
    return data


def generate_by_service_by_length_data(geo_weight):
    """Generate By Service, By Length cross-product data for a geography."""
    data = {}
    for cat_name, cat_info in SERVICE_BY_LENGTH_CATEGORIES.items():
        base = cat_info["base_value"] * geo_weight
        growth = cat_info["growth"]

        if cat_info["sub_services"]:
            # Has sub-services -> 3 level hierarchy
            cat_data = {"_aggregated": True, "_level": 2}
            sub_series_all = []

            for sub, sub_weight in zip(cat_info["sub_services"], cat_info["sub_weights"]):
                sub_base = base * sub_weight
                sub_data = {"_aggregated": True, "_level": 3}
                length_series = []

                for length in BY_LENGTH:
                    l_weight = LENGTH_DIST_WEIGHTS[length]
                    l_base = sub_base * l_weight
                    ts = generate_time_series(l_base, growth)
                    sub_data[length] = ts
                    length_series.append(ts)

                # Sub-service aggregation
                sub_agg = sum_time_series(*length_series)
                sub_data.update(sub_agg)
                cat_data[sub] = sub_data
                sub_series_all.append(sub_agg)

            # Category aggregation
            cat_agg = sum_time_series(*sub_series_all)
            cat_data.update(cat_agg)
            data[cat_name] = cat_data
        else:
            # Direct to lengths (Charter Service)
            cat_data = {"_aggregated": True, "_level": 2}
            length_series = []

            for length in BY_LENGTH:
                l_weight = LENGTH_DIST_WEIGHTS[length]
                l_base = base * l_weight
                ts = generate_time_series(l_base, growth)
                cat_data[length] = ts
                length_series.append(ts)

            cat_agg = sum_time_series(*length_series)
            cat_data.update(cat_agg)
            data[cat_name] = cat_data

    return data


def generate_by_propulsion_data(geo_weight):
    """Generate By Propulsion Type segment data for a geography."""
    data = {}
    for prop in BY_PROPULSION:
        base = PROPULSION_BASE_VALUES[prop] * geo_weight
        growth = PROPULSION_GROWTH_RATES[prop]
        data[prop] = generate_time_series(base, growth)
    return data


def generate_by_country_data(countries, region_data_by_type, country_weights_local):
    """Generate By Country segment data for a region (just country-level totals)."""
    # We use the By Service total as proxy for country distribution
    data = {}
    for country in countries:
        w = country_weights_local.get(country, 1.0 / len(countries))
        # Generate a simple time series based on region total * country weight
        # We'll use the region's By Length total as a base
        base_region_total = 0
        for seg_data in region_data_by_type.get("By Length", {}).values():
            if isinstance(seg_data, dict) and "2021" in seg_data:
                base_region_total += seg_data["2021"]

        country_base = base_region_total * w
        ts = generate_time_series(country_base, 0.07)
        data[country] = ts
    return data


def generate_geography_data(is_value=True):
    """Generate the complete value.json or volume.json data."""
    scale = 1.0 if is_value else VOLUME_SCALE
    all_data = {}

    for region, region_info in GEOGRAPHY.items():
        geo_weight = region_info["weight"] * scale

        # Generate region-level data
        region_data = {}
        region_data["By Service"] = generate_by_service_data(geo_weight)
        region_data["By Length"] = generate_by_length_data(geo_weight)
        region_data["By Service, By Length"] = generate_by_service_by_length_data(geo_weight)
        region_data["By Propulsion Type"] = generate_by_propulsion_data(geo_weight)

        # By Country for regions
        countries = region_info["countries"]
        if countries:
            by_country = {}
            for country in countries:
                w = COUNTRY_WEIGHTS.get(country, 1.0 / len(countries))
                # Simple time series for country entry
                total_2021 = 0
                for seg_data in region_data["By Length"].values():
                    if isinstance(seg_data, dict) and "2021" in seg_data:
                        total_2021 += seg_data["2021"]
                country_base = total_2021 * w
                by_country[country] = generate_time_series(country_base, 0.07)
            region_data["By Country"] = by_country

        all_data[region] = region_data

        # Generate country-level data
        for country in countries:
            c_weight = geo_weight * COUNTRY_WEIGHTS.get(country, 1.0 / len(countries))

            country_data = {}
            country_data["By Service"] = generate_by_service_data(c_weight)
            country_data["By Length"] = generate_by_length_data(c_weight)
            country_data["By Service, By Length"] = generate_by_service_by_length_data(c_weight)
            country_data["By Propulsion Type"] = generate_by_propulsion_data(c_weight)
            all_data[country] = country_data

    return all_data


def main():
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "data")

    # Generate segmentation_analysis.json
    print("Generating segmentation_analysis.json...")
    seg_analysis = generate_segmentation_analysis()
    with open(os.path.join(output_dir, "segmentation_analysis.json"), "w") as f:
        json.dump(seg_analysis, f, indent=2)
    print("  Done.")

    # Generate value.json
    print("Generating value.json...")
    value_data = generate_geography_data(is_value=True)
    with open(os.path.join(output_dir, "value.json"), "w") as f:
        json.dump(value_data, f, indent=2)
    print("  Done.")

    # Generate volume.json
    print("Generating volume.json...")
    volume_data = generate_geography_data(is_value=False)
    with open(os.path.join(output_dir, "volume.json"), "w") as f:
        json.dump(volume_data, f, indent=2)
    print("  Done.")

    print("\nAll files generated successfully!")

    # Print summary
    print("\nSegment Types:")
    for seg_type in seg_analysis["Global"]:
        if seg_type != "By Region":
            items = list(seg_analysis["Global"][seg_type].keys())
            print(f"  {seg_type}: {items}")

    print(f"\nGeographies in value.json: {list(value_data.keys())}")
    print(f"Total geographies: {len(value_data)}")


if __name__ == "__main__":
    main()
