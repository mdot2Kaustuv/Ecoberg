import {
  BarChart3,
  Bolt,
  CloudSun,
  Compass,
  Database,
  Factory,
  Gauge,
  GitCompareArrows,
  Globe2,
  Home,
  Info,
  LayoutDashboard,
  LineChart,
  Satellite,
  ShieldCheck,
} from "../icons.jsx";
import dashboardPreviewAsset from "../assets/nepal-dashboard.png";
import explorerPreviewAsset from "../assets/data-explorer.png";
import comparisonPreviewAsset from "../assets/sector-comparison.png";

export const dashboardPreview = dashboardPreviewAsset;
export const explorerPreview = explorerPreviewAsset;
export const comparisonPreview = comparisonPreviewAsset;

export const routeMeta = {
  home: { label: "Home", title: "Environmental Data Ledger", icon: Home },
  dashboard: { label: "Dashboard", title: "Nepal Overview", icon: LayoutDashboard },
  explorer: { label: "Explorer", title: "Data Explorer", icon: Compass },
  compare: { label: "Compare", title: "Sector Comparison", icon: GitCompareArrows },
  perCapita: { label: "Per Capita", title: "Per Capita Analysis", icon: LineChart },
  sources: { label: "Data Sources", title: "Environmental Intelligence Index", icon: Database },
  about: { label: "About", title: "About Ecoberg", icon: Info },
  admin: { label: "Admin", title: "Pipeline Control Center", icon: ShieldCheck },
};

export const appRoutes = ["dashboard", "explorer", "compare", "perCapita", "sources", "about", "admin"];

export const landingCards = [
  {
    title: "National Trends",
    copy: "Monitor Nepal's historical and projected emissions with sector overlays.",
    img: dashboardPreview,
    route: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Multi-Source Explorer",
    copy: "Filter agency-grade records by year, source, scope, sector, and gas type.",
    img: explorerPreview,
    route: "explorer",
    icon: Compass,
  },
  {
    title: "Sector Comparison",
    copy: "Benchmark carbon intensity, ESG alignment, and peer economies.",
    img: comparisonPreview,
    route: "compare",
    icon: GitCompareArrows,
  },
];

export const metrics = [
  { label: "Total CO2 Emissions", value: "18.2", unit: "Mt", trend: "+3.2% vs 2022", tone: "primary", icon: CloudSun },
  { label: "Largest Sector", value: "Energy", unit: "42% share", trend: "Hydropower adjusted", tone: "neutral", icon: Bolt },
  { label: "Emissions Per Capita", value: "0.61", unit: "t", trend: "Low global impact", tone: "positive", icon: Globe2 },
  { label: "Global Share", value: "<0.05%", unit: "rank 104", trend: "Policy watch", tone: "amber", icon: Globe2 },
];

export const variationRows = [
  ["2023", "18.2", "+3.2%", "Energy", "GCP", "danger"],
  ["2022", "17.6", "+2.8%", "Energy", "GCP", "danger"],
  ["2021", "17.1", "-0.4%", "Transport", "EDGAR", "primary"],
  ["2020", "16.8", "-4.1%", "Transport", "ODIAC", "primary"],
];

export const sectors = [
  { label: "Energy", value: 42, color: "primary" },
  { label: "Transport", value: 21, color: "secondary" },
  { label: "Agriculture", value: 18, color: "tertiary" },
  { label: "Industry", value: 12, color: "muted" },
  { label: "Waste", value: 7, color: "dim" },
];

export const ghgComposition = [
  ["Carbon Dioxide (CO2)", 54, "primary"],
  ["Methane (CH4)", 31, "secondary"],
  ["Nitrous Oxide (N2O)", 12, "tertiary"],
  ["F-Gases", 3, "dim"],
];

export const dataSources = [
  {
    name: "Global Carbon Project",
    short: "GCP",
    years: "1959-2023",
    type: "API / NetCDF",
    reliability: "99.8%",
    icon: Globe2,
    summary:
      "Annual carbon budget authority with global cycle estimates and historical emissions baselines.",
    featured: true,
  },
  {
    name: "EDGAR",
    short: "EDGAR",
    years: "1970-2022",
    type: "CSV Export",
    reliability: "98.1%",
    icon: Factory,
    summary: "High-resolution industrial and atmospheric emissions tracking.",
  },
  {
    name: "ODIAC",
    short: "ODIAC",
    years: "2000-2023",
    type: "Satellite",
    reliability: "96.4%",
    icon: Satellite,
    summary: "Satellite-derived anthropogenic CO2 inventory for spatial analysis.",
  },
  {
    name: "UNFCCC",
    short: "UNFCCC",
    years: "1990-2023",
    type: "API Access",
    reliability: "99.1%",
    icon: Gauge,
    summary: "Official verified reporting from United Nations climate inventories.",
  },
  {
    name: "co2data.org",
    short: "CO2DATA",
    years: "1750-2023",
    type: "Research Set",
    reliability: "94.7%",
    icon: BarChart3,
    summary: "Open research dataset for rapid snapshots and historical comparison.",
  },
];

export const explorerRows = [
  ["01", "2023", "Nepal", "Agriculture", "Scope 1", "12.450", "CH4", "UNFCCC", "Verified"],
  ["02", "2023", "Nepal", "Energy", "Scope 2", "8.912", "CO2", "IPCC-R", "Estimated"],
  ["03", "2022", "Nepal", "Manufacturing", "Scope 1", "7.842", "CO2", "Nepal-Env", "Verified"],
  ["04", "2022", "Nepal", "Transport", "Scope 3", "6.420", "CO2", "ODIAC", "Verified"],
  ["05", "2021", "Nepal", "Waste", "Scope 1", "2.114", "CH4", "UNFCCC", "Verified"],
  ["06", "2021", "Nepal", "LULUCF", "Scope 1", "-1.320", "CO2", "GCP", "Reviewed"],
  ["07", "2020", "Nepal", "Residential", "Scope 2", "3.006", "CO2", "EDGAR", "Estimated"],
  ["08", "2020", "Nepal", "Industrial", "Scope 1", "5.221", "N2O", "EDGAR", "Verified"],
  ["09", "2019", "Nepal", "Aviation", "Scope 3", "1.074", "CO2", "ODIAC", "Reviewed"],
  ["10", "2019", "Nepal", "Cement", "Scope 1", "2.890", "CO2", "GCP", "Verified"],
];

export const comparisonRows = [
  { entity: "Energy (Hydropower)", scope1: "12.4M", scope2: "2.1M", scope3: "4.8M", total: "19.3M", national: 24, flag: "Optimal", trend: "-4.2%", trendTone: "primary" },
  { entity: "Manufacturing", scope1: "28.9M", scope2: "14.3M", scope3: "42.1M", total: "85.3M", national: 38, flag: "Critical", trend: "+1.8%", trendTone: "danger" },
  { entity: "Transportation", scope1: "18.2M", scope2: "0.8M", scope3: "12.5M", total: "31.5M", national: 17, flag: "Monitor", trend: "0.0%", trendTone: "neutral" },
  { entity: "Agriculture", scope1: "16.7M", scope2: "1.1M", scope3: "7.3M", total: "25.1M", national: 19, flag: "Review", trend: "+0.6%", trendTone: "amber" },
];

export const perCapitaBars = [
  ["USA", "14.9t", 100, "muted"],
  ["China", "8.0t", 54, "muted"],
  ["Global Average", "4.7t", 32, "muted"],
  ["India", "1.9t", 13, "muted"],
  ["Bhutan (LULUCF Adjusted)", "1.2t", 8, "secondary"],
  ["Nepal", "0.61t", 4, "primary"],
];

export const pipelineRows = [
  ["ICIMOD Sat-Stream", "14:02:11", "Success", "1,402"],
  ["Nepal Ground Sensors", "13:58:45", "Success", "82,109"],
  ["AirVisual Global", "13:45:00", "Warning", "504"],
  ["GCP Mirror", "13:20:04", "Success", "18,884"],
];

export const surveyQueue = [
  ["Air Quality", "Bagmati River Basin Analysis", "Manual entry for localized pollution spikes in Kathmandu Ward 4."],
  ["Methane Scan", "Landfill Emission Report", "Teku waste management center periodic check-in."],
  ["Industry", "Brick Kiln Audit", "New source contribution from Lalitpur industrial belt."],
];

export const team = [
  ["Dr. Arati Sharma", "Head of Data Science", "AS"],
  ["Rohan Rajbhandari", "Lead Software Architect", "RR"],
  ["Maya Gurung", "Policy & Outreach", "MG"],
  ["Siddhartha Thapa", "Hardware Operations", "ST"],
];

export const faqs = [
  [
    "How often is the CO2 data updated?",
    "Urban areas with high sensor density update every 15 minutes. Remote regions that rely on satellite normalization refresh every 6 hours.",
  ],
  [
    "Can I export the data for academic research?",
    "Yes. Historical datasets can be exported as CSV or JSON from the explorer and through the API documentation in data sources.",
  ],
  [
    "What is the margin of error for local measurements?",
    "Kathmandu and Pokhara operate near +/- 1.8%. High-altitude regions can reach +/- 4.2% because sensor density is lower.",
  ],
];

export const complianceRows = [
  ["GRI Indexing", 78, "primary", "Top 15% in SAARC region"],
  ["TCFD Disclosure", 60, "tertiary", "Physical risk assessment pending"],
  ["SASB Mapping", 42, "muted", "Data granularity required for level 2"],
];
