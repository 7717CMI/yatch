/**
 * Converts Dataset-Global Superyacht Market.xlsx into JSON files
 * for the dashboard: value.json, volume.json, segmentation_analysis.json
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.join(__dirname, 'Dataset-Global Superyacht Market.xlsx');
const OUTPUT_DIR = path.join(__dirname, 'public', 'data');

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

// Known geographies - used to detect geography headers
const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];
const COUNTRIES = {
  'North America': ['U.S.', 'Canada'],
  'Europe': ['U.K.', 'Germany', 'Italy', 'France', 'Spain', 'Russia', 'Rest of Europe'],
  'Asia Pacific': ['China', 'India', 'Japan', 'South Korea', 'ASEAN', 'Australia', 'Rest of Asia Pacific'],
  'Latin America': ['Brazil', 'Mexico', 'Argentina', 'Rest of Latin America'],
  'Middle East & Africa': ['GCC', 'South Africa', 'Rest of Middle East & Africa'],
};
const ALL_COUNTRIES = Object.values(COUNTRIES).flat();
const ALL_GEOGRAPHIES = ['Global', ...REGIONS, ...ALL_COUNTRIES];

// Segment type headers
const SEGMENT_TYPE_HEADERS = ['By Service', 'By Length', 'Propulsion Type', 'By Region', 'By Country'];

// By Service hierarchy definition
const SERVICE_PARENTS = {
  'Yacht Brokerage Service': ['New Build Brokerage', 'Pre Owned Yacht Brokerage', 'Sale And Purchase Advisory'],
  'Yacht Management Service': ['Full Scope Yacht Management', 'Technical Management Only', 'Crew Management Only', 'Compliance And Regulatory Management Only', 'Financial And Accounting Management Only'],
};
const SERVICE_LEAVES = ['Yacht Charter Management Service', 'Charter Retail Service'];
const ALL_SERVICE_SEGMENTS = [
  'Yacht Brokerage Service', 'New Build Brokerage', 'Pre Owned Yacht Brokerage', 'Sale And Purchase Advisory',
  'Yacht Management Service', 'Full Scope Yacht Management', 'Technical Management Only', 'Crew Management Only',
  'Compliance And Regulatory Management Only', 'Financial And Accounting Management Only',
  'Yacht Charter Management Service', 'Charter Retail Service'
];

const LENGTH_SEGMENTS = ['30 to 40 m', '40 to 50 m', '50 to 60 m', '60 to 80 m', '80 m+'];
const PROPULSION_SEGMENTS = ['Conventional Diesel Propulsion', 'Diesel-electric Propulsion', 'Others (Hybrid, Waterjet, Gas Turbine, etc.)'];

function extractYearData(row) {
  const data = {};
  YEARS.forEach((year, idx) => {
    const val = row[idx + 1]; // columns 1-13 are years
    if (val !== undefined && val !== null && val !== '') {
      data[year] = typeof val === 'number' ? val : parseFloat(val);
    }
  });
  // CAGR is column 14
  const cagr = row[14];
  if (cagr !== undefined && cagr !== null && cagr !== '') {
    data['CAGR'] = typeof cagr === 'number' ? cagr : parseFloat(cagr);
  }
  return data;
}

function hasData(row) {
  return row && row[1] !== undefined && row[1] !== null && row[1] !== '';
}

function trimLabel(label) {
  return label ? label.toString().trim() : '';
}

// ============================================================
// PARSE VALUE SHEET
// ============================================================
function parseValueSheet(wb) {
  const ws = wb.Sheets['Value'];
  const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });

  // Find header row (Row Labels, 2021, 2022, ...)
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(rawData.length, 30); i++) {
    const row = rawData[i];
    if (row && row[0] && trimLabel(row[0]) === 'Row Labels') {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) throw new Error('Could not find header row in Value sheet');

  const dataRows = rawData.slice(headerRowIdx + 1);
  const result = {};

  let currentGeo = null;
  let currentSegType = null;
  let currentParentSegment = null; // For tracking parent-child in By Service

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (!row || !row[0]) continue;

    const label = trimLabel(row[0]);
    if (!label) continue;

    const rowHasData = hasData(row);

    // Check if this is a geography header
    if (ALL_GEOGRAPHIES.includes(label) && !rowHasData) {
      // Geography header (no data)
      currentGeo = label;
      currentSegType = null;
      currentParentSegment = null;
      if (!result[currentGeo]) result[currentGeo] = {};
      continue;
    }

    // Check if this is a geography header that also appears as a "By Region"/"By Country" child WITH data
    // E.g., "North America" under Global > By Region has data
    if (ALL_GEOGRAPHIES.includes(label) && rowHasData && currentSegType &&
        (currentSegType === 'By Region' || currentSegType === 'By Country')) {
      // This is a region/country data row under By Region/By Country
      const yearData = extractYearData(row);
      if (!result[currentGeo][currentSegType]) result[currentGeo][currentSegType] = {};
      result[currentGeo][currentSegType][label] = yearData;
      continue;
    }

    // Check if this is a segment type header
    if (SEGMENT_TYPE_HEADERS.includes(label)) {
      currentSegType = label === 'Propulsion Type' ? 'By Propulsion Type' : label;
      currentParentSegment = null;
      if (currentGeo && !result[currentGeo][currentSegType]) {
        result[currentGeo][currentSegType] = {};
      }
      // Don't store the segment type total row data (it's the sum)
      continue;
    }

    // Now handle segment data rows
    if (!currentGeo || !currentSegType) continue;

    if (currentSegType === 'By Service') {
      // Check if this is a parent segment
      if (SERVICE_PARENTS[label]) {
        currentParentSegment = label;
        const yearData = extractYearData(row);
        // Store with _aggregated and _level markers
        result[currentGeo][currentSegType][label] = {
          ...yearData,
          _aggregated: true,
          _level: 2
        };
      } else if (SERVICE_LEAVES.includes(label)) {
        // Leaf segment at top level
        currentParentSegment = null;
        const yearData = extractYearData(row);
        result[currentGeo][currentSegType][label] = yearData;
      } else if (currentParentSegment && SERVICE_PARENTS[currentParentSegment]?.includes(label)) {
        // Child segment
        const yearData = extractYearData(row);
        result[currentGeo][currentSegType][currentParentSegment][label] = yearData;
      }
    } else if (currentSegType === 'By Length') {
      if (LENGTH_SEGMENTS.includes(label)) {
        const yearData = extractYearData(row);
        result[currentGeo][currentSegType][label] = yearData;
      }
    } else if (currentSegType === 'By Propulsion Type') {
      if (PROPULSION_SEGMENTS.includes(label)) {
        const yearData = extractYearData(row);
        result[currentGeo][currentSegType][label] = yearData;
      }
    } else if (currentSegType === 'By Region' || currentSegType === 'By Country') {
      // Region/country entries with data
      if (rowHasData) {
        const yearData = extractYearData(row);
        result[currentGeo][currentSegType][label] = yearData;
      }
    }
  }

  return result;
}

// ============================================================
// PARSE CROSS VALUE SHEET
// ============================================================
function parseCrossValueSheet(wb) {
  const ws = wb.Sheets['Cross Value'];
  const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });

  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(rawData.length, 30); i++) {
    const row = rawData[i];
    if (row && row[0] && trimLabel(row[0]) === 'Row Labels') {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) throw new Error('Could not find header row in Cross Value sheet');

  const dataRows = rawData.slice(headerRowIdx + 1);
  const result = {};

  let currentGeo = null;
  let currentSegType = null;
  let currentServiceSegment = null;

  // Cross value length names may use en-dash (–) instead of "to"
  const CROSS_LENGTH_MAP = {
    '30–40 m': '30 to 40 m', '30-40 m': '30 to 40 m', '30 to 40 m': '30 to 40 m',
    '40–50 m': '40 to 50 m', '40-50 m': '40 to 50 m', '40 to 50 m': '40 to 50 m',
    '50–60 m': '50 to 60 m', '50-60 m': '50 to 60 m', '50 to 60 m': '50 to 60 m',
    '60–80 m': '60 to 80 m', '60-80 m': '60 to 80 m', '60 to 80 m': '60 to 80 m',
    '80 m+': '80 m+',
  };

  // All known service sub-segment names (used as parent keys in cross value)
  const CROSS_SERVICE_SEGMENTS = [
    'Charter Retail Service', 'New Build Brokerage', 'Pre Owned Yacht Brokerage',
    'Sale And Purchase Advisory', 'Full Scope Yacht Management', 'Technical Management Only',
    'Crew Management Only', 'Compliance And Regulatory Management Only',
    'Financial And Accounting Management Only', 'Yacht Charter Management Service',
  ];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (!row || !row[0]) continue;

    const label = trimLabel(row[0]);
    if (!label) continue;

    const rowHasData = hasData(row);

    // Geography header
    if (ALL_GEOGRAPHIES.includes(label) && !rowHasData) {
      currentGeo = label;
      currentSegType = null;
      currentServiceSegment = null;
      if (!result[currentGeo]) result[currentGeo] = {};
      continue;
    }

    // Segment type header "By Service By Length"
    if (label === 'By Service By Length') {
      currentSegType = 'By Service, By Length';
      currentServiceSegment = null;
      if (currentGeo && !result[currentGeo][currentSegType]) {
        result[currentGeo][currentSegType] = {};
      }
      continue;
    }

    if (!currentGeo || !currentSegType) continue;

    // Check if this is a service segment name (parent in cross)
    if (CROSS_SERVICE_SEGMENTS.includes(label)) {
      currentServiceSegment = label;
      if (rowHasData) {
        // This is the aggregated row for the service segment
        const yearData = extractYearData(row);
        result[currentGeo][currentSegType][label] = {
          ...yearData,
          _aggregated: true,
          _level: 2
        };
      } else {
        if (!result[currentGeo][currentSegType][label]) {
          result[currentGeo][currentSegType][label] = {};
        }
      }
      continue;
    }

    // Check if this is a length segment (child of current service segment)
    const normalizedLength = CROSS_LENGTH_MAP[label];
    if (normalizedLength && currentServiceSegment && rowHasData) {
      const yearData = extractYearData(row);
      if (!result[currentGeo][currentSegType][currentServiceSegment]) {
        result[currentGeo][currentSegType][currentServiceSegment] = {};
      }
      result[currentGeo][currentSegType][currentServiceSegment][normalizedLength] = yearData;
      continue;
    }
  }

  return result;
}

// ============================================================
// PARSE VOLUME SHEET
// ============================================================
function parseVolumeSheet(wb) {
  const ws = wb.Sheets['Volume'];
  const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });

  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(rawData.length, 30); i++) {
    const row = rawData[i];
    if (row && row[0] && trimLabel(row[0]) === 'Row Labels') {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) throw new Error('Could not find header row in Volume sheet');

  const dataRows = rawData.slice(headerRowIdx + 1);
  const result = { 'Global': { 'By Service, By Length': {} } };

  let currentServiceSegment = null;

  const CROSS_LENGTH_MAP = {
    '30–40 m': '30 to 40 m', '30-40 m': '30 to 40 m', '30 to 40 m': '30 to 40 m',
    '40–50 m': '40 to 50 m', '40-50 m': '40 to 50 m', '40 to 50 m': '40 to 50 m',
    '50–60 m': '50 to 60 m', '50-60 m': '50 to 60 m', '50 to 60 m': '50 to 60 m',
    '60–80 m': '60 to 80 m', '60-80 m': '60 to 80 m', '60 to 80 m': '60 to 80 m',
    '80 m+': '80 m+',
  };

  const CROSS_SERVICE_SEGMENTS = [
    'Charter Retail Service', 'New Build Brokerage', 'Pre Owned Yacht Brokerage',
    'Sale And Purchase Advisory', 'Full Scope Yacht Management', 'Technical Management Only',
    'Crew Management Only', 'Compliance And Regulatory Management Only',
    'Financial And Accounting Management Only', 'Yacht Charter Management Service',
  ];

  // Skip "Global" and "By Service By Length" headers
  let started = false;

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (!row || !row[0]) continue;

    const label = trimLabel(row[0]);
    if (!label) continue;

    if (label === 'Global' || label === 'By Service By Length') {
      started = true;
      continue;
    }

    if (!started) continue;

    const rowHasData = hasData(row);

    // Service segment parent
    if (CROSS_SERVICE_SEGMENTS.includes(label)) {
      currentServiceSegment = label;
      if (rowHasData) {
        const yearData = extractYearData(row);
        result['Global']['By Service, By Length'][label] = {
          ...yearData,
          _aggregated: true,
          _level: 2
        };
      } else {
        if (!result['Global']['By Service, By Length'][label]) {
          result['Global']['By Service, By Length'][label] = {};
        }
      }
      continue;
    }

    // Length child
    const normalizedLength = CROSS_LENGTH_MAP[label];
    if (normalizedLength && currentServiceSegment && rowHasData) {
      const yearData = extractYearData(row);
      if (!result['Global']['By Service, By Length'][currentServiceSegment]) {
        result['Global']['By Service, By Length'][currentServiceSegment] = {};
      }
      result['Global']['By Service, By Length'][currentServiceSegment][normalizedLength] = yearData;
      continue;
    }
  }

  return result;
}

// ============================================================
// BUILD SEGMENTATION ANALYSIS (structure only)
// ============================================================
function buildSegmentationAnalysis() {
  const analysis = {
    'Global': {
      'By Service': {
        'Yacht Brokerage Service': {
          'New Build Brokerage': {},
          'Pre Owned Yacht Brokerage': {},
          'Sale And Purchase Advisory': {},
        },
        'Yacht Management Service': {
          'Full Scope Yacht Management': {},
          'Technical Management Only': {},
          'Crew Management Only': {},
          'Compliance And Regulatory Management Only': {},
          'Financial And Accounting Management Only': {},
        },
        'Yacht Charter Management Service': {},
        'Charter Retail Service': {},
      },
      'By Length': {
        '30 to 40 m': {},
        '40 to 50 m': {},
        '50 to 60 m': {},
        '60 to 80 m': {},
        '80 m+': {},
      },
      'By Service, By Length': {
        'Charter Retail Service': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'New Build Brokerage': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'Pre Owned Yacht Brokerage': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'Sale And Purchase Advisory': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'Full Scope Yacht Management': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'Technical Management Only': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'Crew Management Only': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'Compliance And Regulatory Management Only': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'Financial And Accounting Management Only': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
        'Yacht Charter Management Service': {
          '30 to 40 m': {}, '40 to 50 m': {}, '50 to 60 m': {}, '60 to 80 m': {}, '80 m+': {},
        },
      },
      'By Propulsion Type': {
        'Conventional Diesel Propulsion': {},
        'Diesel-electric Propulsion': {},
        'Others (Hybrid, Waterjet, Gas Turbine, etc.)': {},
      },
      'By Region': {
        'North America': { 'U.S.': {}, 'Canada': {} },
        'Europe': { 'U.K.': {}, 'Germany.': {}, 'Italy': {}, 'France': {}, 'Spain': {}, 'Russia': {}, 'Rest of Europe': {} },
        'Asia Pacific': { 'China': {}, 'India': {}, 'Japan': {}, 'South Korea': {}, 'ASEAN': {}, 'Australia': {}, 'Rest of Asia Pacific': {} },
        'Latin America': { 'Brazil': {}, 'Mexico': {}, 'Argentina': {}, 'Rest of Latin America': {} },
        'Middle East & Africa': { 'GCC': {}, 'South Africa': {}, 'Rest of Middle East & Africa': {} },
      },
    }
  };

  return analysis;
}

// ============================================================
// MERGE AND OUTPUT
// ============================================================
function main() {
  console.log('Reading Excel file...');
  const wb = XLSX.readFile(EXCEL_FILE);

  console.log('Parsing Value sheet...');
  const valueData = parseValueSheet(wb);

  console.log('Parsing Cross Value sheet...');
  const crossValueData = parseCrossValueSheet(wb);

  console.log('Parsing Volume sheet...');
  const volumeData = parseVolumeSheet(wb);

  // Merge cross value into value data
  console.log('Merging cross value data...');
  for (const geo of Object.keys(crossValueData)) {
    if (!valueData[geo]) valueData[geo] = {};
    const crossSeg = crossValueData[geo]['By Service, By Length'];
    if (crossSeg) {
      valueData[geo]['By Service, By Length'] = crossSeg;
    }
  }

  // Build segmentation analysis
  console.log('Building segmentation analysis...');
  const segAnalysis = buildSegmentationAnalysis();

  // Validate: check some key data points
  console.log('\n=== VALIDATION ===');
  const globalByService = valueData['Global']?.['By Service'];
  if (globalByService) {
    console.log('Global By Service segments:', Object.keys(globalByService));
    const broker = globalByService['Yacht Brokerage Service'];
    if (broker) console.log('  Yacht Brokerage 2023:', broker[2023]);
    const mgmt = globalByService['Yacht Management Service'];
    if (mgmt) console.log('  Yacht Management 2023:', mgmt[2023]);
    const charter = globalByService['Yacht Charter Management Service'];
    if (charter) console.log('  Charter Management 2023:', charter[2023]);
    const retail = globalByService['Charter Retail Service'];
    if (retail) console.log('  Charter Retail 2023:', retail[2023]);
  }

  console.log('Geographies in value:', Object.keys(valueData));

  // Check a country
  const us = valueData['U.S.'];
  if (us) {
    console.log('U.S. segment types:', Object.keys(us));
    const usSvc = us['By Service'];
    if (usSvc) console.log('  U.S. By Service segments:', Object.keys(usSvc));
  }

  // Write output files
  console.log('\nWriting output files...');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'value.json'),
    JSON.stringify(valueData, null, 2)
  );
  console.log('  Written value.json');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'volume.json'),
    JSON.stringify(volumeData, null, 2)
  );
  console.log('  Written volume.json');

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'segmentation_analysis.json'),
    JSON.stringify(segAnalysis, null, 2)
  );
  console.log('  Written segmentation_analysis.json');

  console.log('\nDone! All JSON files updated.');
}

main();
