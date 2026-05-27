METRICS = [
    {
        "label": "Total CO2 Emissions",
        "value": "18.2",
        "unit": "Mt",
        "trend": "+3.2% vs 2022",
        "tone": "primary",
        "icon": "CloudSun",
    },
    {
        "label": "Largest Sector",
        "value": "Energy",
        "unit": "42% share",
        "trend": "Hydropower adjusted",
        "tone": "neutral",
        "icon": "Bolt",
    },
    {
        "label": "Emissions Per Capita",
        "value": "0.61",
        "unit": "t",
        "trend": "Low global impact",
        "tone": "positive",
        "icon": "Globe2",
    },
    {
        "label": "Global Share",
        "value": "<0.05%",
        "unit": "rank 104",
        "trend": "Policy watch",
        "tone": "amber",
        "icon": "Globe2",
    },
]

VARIATION_ROWS = [
    ["2023", "18.2", "+3.2%", "Energy", "GCP", "danger"],
    ["2022", "17.6", "+2.8%", "Energy", "GCP", "danger"],
    ["2021", "17.1", "-0.4%", "Transport", "EDGAR", "primary"],
    ["2020", "16.8", "-4.1%", "Transport", "ODIAC", "primary"],
]

SECTORS = [
    {"label": "Energy", "value": 42, "color": "primary"},
    {"label": "Transport", "value": 21, "color": "secondary"},
    {"label": "Agriculture", "value": 18, "color": "tertiary"},
    {"label": "Industry", "value": 12, "color": "muted"},
    {"label": "Waste", "value": 7, "color": "dim"},
]

GHG_COMPOSITION = [
    ["Carbon Dioxide (CO2)", 54, "primary"],
    ["Methane (CH4)", 31, "secondary"],
    ["Nitrous Oxide (N2O)", 12, "tertiary"],
    ["F-Gases", 3, "dim"],
]

DATA_SOURCES = [
    {
        "name": "Global Carbon Project",
        "short": "GCP",
        "years": "1959-2023",
        "type": "API / NetCDF",
        "reliability": "99.8%",
        "icon": "Globe2",
        "summary": "Annual carbon budget authority with global cycle estimates and histori
cal emissions baselines.",
        "featured": True,
    },
    {
        "name": "EDGAR",
        "short": "EDGAR",
        "years": "1970-2022",
        "type": "CSV Export",
        "reliability": "98.1%",
        "icon": "Factory",
        "summary": "High-resolution industrial and atmospheric emissions tracking.",
    },
    {
        "name": "ODIAC",
        "short": "ODIAC",
        "years": "2000-2023",
        "type": "Satellite",
        "reliability": "96.4%",
        "icon": "Satellite",
        "summary": "Satellite-derived anthropogenic CO2 inventory for spatial analysis.",
    },
    {
        "name": "UNFCCC",
        "short": "UNFCCC",
        "years": "1990-2023",
        "type": "API Access",
        "reliability": "99.1%",
        "icon": "Gauge",
        "summary": "Official verified reporting from United Nations climate inventories.",
    },
    {
        "name": "co2data.org",
        "short": "CO2DATA",
        "years": "1750-2023",
        "type": "Research Set",
        "reliability": "94.7%",
        "icon": "BarChart3",
        "summary": "Open research dataset for rapid snapshots and historical comparison.",
    },
]

EXPLORER_ROWS = [
    ["01", "2023", "Nepal", "Agriculture", "Scope 1", "12.450", "CH4", "UNFCCC", "Verified
"],
    ["02", "2023", "Nepal", "Energy", "Scope 2", "8.912", "CO2", "IPCC-R", "Estimated"],
    ["03", "2022", "Nepal", "Manufacturing", "Scope 1", "7.842", "CO2", "Nepal-Env", "Veri
fied"],
    ["04", "2022", "Nepal", "Transport", "Scope 3", "6.420", "CO2", "ODIAC", "Verified"],
    ["05", "2021", "Nepal", "Waste", "Scope 1", "2.114", "CH4", "UNFCCC", "Verified"],
    ["06", "2021", "Nepal", "LULUCF", "Scope 1", "-1.320", "CO2", "GCP", "Reviewed"],
    ["07", "2020", "Nepal", "Residential", "Scope 2", "3.006", "CO2", "EDGAR", "Estimated"
],
    ["08", "2020", "Nepal", "Industrial", "Scope 1", "5.221", "N2O", "EDGAR", "Verified"],
    ["09", "2019", "Nepal", "Aviation", "Scope 3", "1.074", "CO2", "ODIAC", "Reviewed"],
    ["10", "2019", "Nepal", "Cement", "Scope 1", "2.890", "CO2", "GCP", "Verified"],
]

COMPARISON_ROWS = [
    {
        "entity": "Energy (Hydropower)",
        "scope1": "12.4M",
        "scope2": "2.1M",
        "scope3": "4.8M",
        "total": "19.3M",
        "national": 24,
        "flag": "Optimal",
        "trend": "-4.2%",
        "trendTone": "primary",
    },
    {
        "entity": "Manufacturing",
        "scope1": "28.9M",
        "scope2": "14.3M",
        "scope3": "42.1M",
        "total": "85.3M",
        "national": 38,
        "flag": "Critical",
        "trend": "+1.8%",
        "trendTone": "danger",
    },
    {
        "entity": "Transportation",
        "scope1": "18.2M",
        "scope2": "0.8M",
        "scope3": "12.5M",
        "total": "31.5M",
        "national": 17,
        "flag": "Monitor",
        "trend": "0.0%",
        "trendTone": "neutral",
    },
    {
        "entity": "Agriculture",
        "scope1": "16.7M",
        "scope2": "1.1M",
        "scope3": "7.3M",
        "total": "25.1M",
        "national": 19,
        "flag": "Review",
        "trend": "+0.6%",
        "trendTone": "amber",
    },
]

PEER_ROWS = [
    ["Nepal", "Baseline", 100, "primary"],
    ["Bangladesh", "+22.4%", 80, "danger"],
    ["Sri Lanka", "-8.1%", 45, "primary"],
    ["Cambodia", "+3.2%", 60, "amber"],
]

COMPLIANCE_ROWS = [
    ["GRI Indexing", 78, "primary", "Top 15% in SAARC region"],
    ["TCFD Disclosure", 60, "tertiary", "Physical risk assessment pending"],
    ["SASB Mapping", 42, "muted", "Data granularity required for level 2"],
]

PER_CAPITA_METRICS = [
    {
        "label": "Nepal Per Capita",
        "value": "0.61",
        "unit": "t CO2",
        "trend": "+2.3% YoY",
        "tone": "primary",
        "icon": "Leaf",
    },
    {
        "label": "Global Average",
        "value": "4.7",
        "unit": "t CO2",
        "trend": "Gap: -87%",
        "tone": "neutral",
        "icon": "Globe2",
    },
    {
        "label": "Regional Rank",
        "value": "7th",
        "unit": "in SAARC",
        "trend": "Lowest: Bhutan",
        "tone": "neutral",
        "icon": "BarChart3",
    },
    {
        "label": "Emission Intensity",
        "value": "0.12",
        "unit": "kg/$ GDP",
        "trend": "Efficiency alert",
        "tone": "amber",
        "icon": "Gauge",
    },
]

PER_CAPITA_BARS = [
    ["USA", "14.9t", 100, "muted"],
    ["China", "8.0t", 54, "muted"],
    ["Global Average", "4.7t", 32, "muted"],
    ["India", "1.9t", 13, "muted"],
    ["Bhutan (LULUCF Adjusted)", "1.2t", 8, "secondary"],
    ["Nepal", "0.61t", 4, "primary"],
]

NETWORK_INTEGRITY = [
    ["Aggregate Uptime", 99, "primary"],
    ["Data Consistency", 98, "tertiary"],
    ["Verification Lag", 85, "secondary"],
]

ADMIN_METRICS = [
    {
        "label": "Pipeline Jobs",
        "value": "14/14",
        "unit": "100% success",
        "trend": "All sources green",
        "tone": "primary",
        "icon": "Server",
    },
    {
        "label": "Pending Reviews",
        "value": "3",
        "unit": "requires action",
        "trend": "Manual queue",
        "tone": "amber",
        "icon": "FileText",
    },
    {
        "label": "Total Records",
        "value": "847,219",
        "unit": "+1.2k today",
        "trend": "Indexed documents",
        "tone": "primary",
        "icon": "Database",
    },
]

PIPELINE_ROWS = [
    ["ICIMOD Sat-Stream", "14:02:11", "Success", "1,402"],
    ["Nepal Ground Sensors", "13:58:45", "Success", "82,109"],
    ["AirVisual Global", "13:45:00", "Warning", "504"],
    ["GCP Mirror", "13:20:04", "Success", "18,884"],
]

SURVEY_QUEUE = [
    ["Air Quality", "Bagmati River Basin Analysis", "Manual entry for localized pollution 
spikes in Kathmandu Ward 4."],
    ["Methane Scan", "Landfill Emission Report", "Teku waste management center periodic ch
eck-in."],
    ["Industry", "Brick Kiln Audit", "New source contribution from Lalitpur industrial bel
t."],
]

ADMIN_USERS = [
    ["N. Shrestha", "Superadmin"],
    ["R. Thapa", "Pipeline Manager"],
    ["S. Gurung", "Data Analyst"],
    ["A. Pandey", "Auditor"],
]

AUDIT_LOG = [
    ["INFO", 'Scheduled pipeline "Nepal Ground Sensors" initiated successfully.'],
    ["AUTH", 'User "N. Shrestha" accessed survey approval queue.'],
    ["WARN", 'API latency spike detected on "AirVisual Global" (350ms).'],
    ["INFO", "Database indexing complete. 847,219 documents current."],
    ["ERROR", 'Webhook timeout on secondary mirror server (404).'],
]
(venv) ┌──[sumit-paudel@root]──[~/Documents/ecoberg]
└──$ 