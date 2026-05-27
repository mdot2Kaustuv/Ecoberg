const defaultPaths = [
  <path key="p1" d="M4 19V5" />,
  <path key="p2" d="M4 19h16" />,
  <path key="p3" d="M8 16V9" />,
  <path key="p4" d="M12 16V6" />,
  <path key="p5" d="M16 16v-4" />,
];

const paths = {
  Activity: [<path key="p" d="M3 12h4l3-7 4 14 3-7h4" />],
  AlertTriangle: [
    <path key="p1" d="M12 3 2 20h20L12 3Z" />,
    <path key="p2" d="M12 9v5" />,
    <path key="p3" d="M12 17h.01" />,
  ],
  ArrowRight: [<path key="p1" d="M5 12h14" />, <path key="p2" d="m13 6 6 6-6 6" />],
  ArrowUpRight: [<path key="p1" d="M7 17 17 7" />, <path key="p2" d="M8 7h9v9" />],
  BarChart3: [<path key="p1" d="M4 20V10" />, <path key="p2" d="M12 20V4" />, <path key="p3" d="M20 20v-7" />],
  Bell: [
    <path key="p1" d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />,
    <path key="p2" d="M10 21h4" />,
  ],
  Bolt: [<path key="p" d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />],
  BookOpen: [
    <path key="p1" d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" />,
    <path key="p2" d="M4 5.5A3.5 3.5 0 0 0 .5 2H4" />,
  ],
  CheckCircle2: [<path key="p1" d="M21 12a9 9 0 1 1-4-7.5" />, <path key="p2" d="m9 12 2 2 6-7" />],
  ChevronDown: [<path key="p" d="m6 9 6 6 6-6" />],
  ChevronRight: [<path key="p" d="m9 6 6 6-6 6" />],
  CircleDot: [<circle key="c1" cx="12" cy="12" r="9" />, <circle key="c2" cx="12" cy="12" r="2" />],
  CloudSun: [
    <path key="p1" d="M12 2v2" />,
    <path key="p2" d="m4.9 4.9 1.4 1.4" />,
    <path key="p3" d="M20 12h2" />,
    <path key="p4" d="M16.5 7.5A5 5 0 0 0 8 11" />,
    <path key="p5" d="M6.5 19H18a4 4 0 0 0 0-8 6 6 0 0 0-11.5 2A3 3 0 0 0 6.5 19Z" />,
  ],
  Compass: [
    <circle key="c" cx="12" cy="12" r="9" />,
    <path key="p" d="m15 9-2 5-5 2 2-5 5-2Z" />,
  ],
  Cpu: [
    <rect key="r" x="7" y="7" width="10" height="10" rx="2" />,
    <path key="p1" d="M9 1v3" />,
    <path key="p2" d="M15 1v3" />,
    <path key="p3" d="M9 20v3" />,
    <path key="p4" d="M15 20v3" />,
    <path key="p5" d="M1 9h3" />,
    <path key="p6" d="M1 15h3" />,
    <path key="p7" d="M20 9h3" />,
    <path key="p8" d="M20 15h3" />,
  ],
  Database: [
    <ellipse key="e1" cx="12" cy="5" rx="8" ry="3" />,
    <path key="p1" d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />,
    <path key="p2" d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />,
  ],
  Download: [<path key="p1" d="M12 3v12" />, <path key="p2" d="m7 10 5 5 5-5" />, <path key="p3" d="M5 21h14" />],
  Factory: [
    <path key="p1" d="M3 21V8l6 4V8l6 4V3h6v18H3Z" />,
    <path key="p2" d="M7 17h.01" />,
    <path key="p3" d="M11 17h.01" />,
    <path key="p4" d="M15 17h.01" />,
  ],
  FileText: [<path key="p1" d="M6 2h9l5 5v15H6V2Z" />, <path key="p2" d="M14 2v6h6" />, <path key="p3" d="M9 13h6" />, <path key="p4" d="M9 17h6" />],
  Filter: [<path key="p" d="M4 4h16l-6 7v7l-4 2v-9L4 4Z" />],
  Gauge: [<path key="p1" d="M4 15a8 8 0 1 1 16 0" />, <path key="p2" d="M12 15l4-5" />, <path key="p3" d="M5 20h14" />],
  Gavel: [<path key="p1" d="m14 4 6 6" />, <path key="p2" d="m4 14 6 6" />, <path key="p3" d="m16 2 6 6-6 6-6-6 6-6Z" />, <path key="p4" d="M2 22h8" />],
  GitCompareArrows: [
    <path key="p1" d="M6 3v12" />,
    <path key="p2" d="m3 12 3 3 3-3" />,
    <path key="p3" d="M18 21V9" />,
    <path key="p4" d="m15 12 3-3 3 3" />,
    <path key="p5" d="M6 6h12" />,
  ],
  Globe2: [<circle key="c" cx="12" cy="12" r="9" />, <path key="p1" d="M3 12h18" />, <path key="p2" d="M12 3a14 14 0 0 1 0 18" />, <path key="p3" d="M12 3a14 14 0 0 0 0 18" />],
  Home: [<path key="p1" d="M3 11 12 3l9 8" />, <path key="p2" d="M5 10v11h14V10" />, <path key="p3" d="M9 21v-7h6v7" />],
  Info: [<circle key="c" cx="12" cy="12" r="9" />, <path key="p1" d="M12 10v6" />, <path key="p2" d="M12 7h.01" />],
  LayoutDashboard: [<rect key="r1" x="3" y="3" width="7" height="8" rx="1" />, <rect key="r2" x="14" y="3" width="7" height="5" rx="1" />, <rect key="r3" x="14" y="12" width="7" height="9" rx="1" />, <rect key="r4" x="3" y="15" width="7" height="6" rx="1" />],
  Leaf: [<path key="p1" d="M20 4C12 4 5 9 5 17c0 2 1 3 3 3 8 0 13-8 12-16Z" />, <path key="p2" d="M4 20c4-8 9-11 16-16" />],
  LineChart: [<path key="p1" d="M4 19V5" />, <path key="p2" d="M4 19h16" />, <path key="p3" d="m7 15 4-5 3 3 5-7" />],
  Mail: [<rect key="r" x="3" y="5" width="18" height="14" rx="2" />, <path key="p" d="m3 7 9 6 9-6" />],
  MapPin: [<path key="p1" d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z" />, <circle key="c" cx="12" cy="9" r="2.5" />],
  Menu: [<path key="p1" d="M4 6h16" />, <path key="p2" d="M4 12h16" />, <path key="p3" d="M4 18h16" />],
  Network: [<circle key="c1" cx="6" cy="6" r="3" />, <circle key="c2" cx="18" cy="6" r="3" />, <circle key="c3" cx="12" cy="18" r="3" />, <path key="p1" d="m8.5 8 2 7" />, <path key="p2" d="m15.5 8-2 7" />, <path key="p3" d="M9 6h6" />],
  PanelLeftClose: [<rect key="r" x="3" y="4" width="18" height="16" rx="2" />, <path key="p1" d="M9 4v16" />, <path key="p2" d="m16 10-3 2 3 2" />],
  PanelLeftOpen: [<rect key="r" x="3" y="4" width="18" height="16" rx="2" />, <path key="p1" d="M9 4v16" />, <path key="p2" d="m13 10 3 2-3 2" />],
  Phone: [<path key="p" d="M22 16.9v3a2 2 0 0 1-2.2 2 19 19 0 0 1-17-17A2 2 0 0 1 4.8 3h3a2 2 0 0 1 2 1.7l.4 2.7a2 2 0 0 1-.6 1.7L8.4 10.3a14 14 0 0 0 5.3 5.3l1.2-1.2a2 2 0 0 1 1.7-.6l2.7.4a2 2 0 0 1 1.7 2Z" />],
  Quote: [<path key="p1" d="M7 17a4 4 0 0 1-4-4V8h6v5H6a1 1 0 0 0 1 1v3Z" />, <path key="p2" d="M18 17a4 4 0 0 1-4-4V8h6v5h-3a1 1 0 0 0 1 1v3Z" />],
  RefreshCw: [<path key="p1" d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />, <path key="p2" d="M3 21v-5h5" />, <path key="p3" d="M3 12A9 9 0 0 1 18.5 5.7L21 8" />, <path key="p4" d="M21 3v5h-5" />],
  Satellite: [<path key="p1" d="M13 7 7 13l4 4 6-6-4-4Z" />, <path key="p2" d="m7 13-4 4" />, <path key="p3" d="m17 3 4 4" />, <path key="p4" d="M16 16a5 5 0 0 1-7 0" />],
  Search: [<circle key="c" cx="11" cy="11" r="7" />, <path key="p" d="m21 21-4.3-4.3" />],
  Server: [<rect key="r1" x="3" y="4" width="18" height="7" rx="2" />, <rect key="r2" x="3" y="13" width="18" height="7" rx="2" />, <path key="p1" d="M7 8h.01" />, <path key="p2" d="M7 17h.01" />],
  Settings: [<circle key="c" cx="12" cy="12" r="3" />, <path key="p" d="M19.4 15a8 8 0 0 0 .1-6l2-1.5-2-3.5-2.4 1a8 8 0 0 0-5.2-3L11.5 0h-4l-.4 2a8 8 0 0 0-5.2 3l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 .1 6l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 5.2 3l.4 2h4l.4-2a8 8 0 0 0 5.2-3l2.4 1 2-3.5-2.2-1.5Z" transform="scale(.58) translate(8 8)" />],
  ShieldCheck: [<path key="p1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />, <path key="p2" d="m9 12 2 2 4-5" />],
  SlidersHorizontal: [<path key="p1" d="M4 7h8" />, <path key="p2" d="M16 7h4" />, <path key="p3" d="M4 17h4" />, <path key="p4" d="M12 17h8" />, <circle key="c1" cx="14" cy="7" r="2" />, <circle key="c2" cx="10" cy="17" r="2" />],
  Sparkles: [<path key="p1" d="m12 3 1.5 5L19 10l-5.5 2L12 17l-1.5-5L5 10l5.5-2L12 3Z" />, <path key="p2" d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />],
  Terminal: [<path key="p1" d="m4 7 5 5-5 5" />, <path key="p2" d="M12 19h8" />],
  TrendingDown: [<path key="p" d="m22 17-8.5-8.5-5 5L2 7" />, <path key="p2" d="M16 17h6v-6" />],
  TrendingUp: [<path key="p" d="m22 7-8.5 8.5-5-5L2 17" />, <path key="p2" d="M16 7h6v6" />],
  User: [<circle key="c" cx="12" cy="8" r="4" />, <path key="p" d="M4 21a8 8 0 0 1 16 0" />],
  Users: [<path key="p1" d="M16 21a6 6 0 0 0-12 0" />, <circle key="c1" cx="10" cy="8" r="4" />, <path key="p2" d="M22 21a5 5 0 0 0-4-4.8" />, <path key="p3" d="M17 4.3a4 4 0 0 1 0 7.4" />],
  X: [<path key="p1" d="M6 6l12 12" />, <path key="p2" d="M18 6 6 18" />],
  Zap: [<path key="p" d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />],
};

function SvgIcon({ size = 24, color = "currentColor", strokeWidth = 2, className = "", children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function icon(name) {
  return function IconComponent(props) {
    return <SvgIcon {...props}>{paths[name] || defaultPaths}</SvgIcon>;
  };
}

export const Activity = icon("Activity");
export const AlertTriangle = icon("AlertTriangle");
export const ArrowRight = icon("ArrowRight");
export const ArrowUpRight = icon("ArrowUpRight");
export const BarChart3 = icon("BarChart3");
export const Bell = icon("Bell");
export const Bolt = icon("Bolt");
export const BookOpen = icon("BookOpen");
export const CheckCircle2 = icon("CheckCircle2");
export const ChevronDown = icon("ChevronDown");
export const ChevronRight = icon("ChevronRight");
export const CircleDot = icon("CircleDot");
export const CloudSun = icon("CloudSun");
export const Compass = icon("Compass");
export const Cpu = icon("Cpu");
export const Database = icon("Database");
export const Download = icon("Download");
export const Factory = icon("Factory");
export const FileText = icon("FileText");
export const Filter = icon("Filter");
export const Gauge = icon("Gauge");
export const Gavel = icon("Gavel");
export const GitCompareArrows = icon("GitCompareArrows");
export const Globe2 = icon("Globe2");
export const Home = icon("Home");
export const Info = icon("Info");
export const LayoutDashboard = icon("LayoutDashboard");
export const Leaf = icon("Leaf");
export const LineChart = icon("LineChart");
export const Mail = icon("Mail");
export const MapPin = icon("MapPin");
export const Menu = icon("Menu");
export const Network = icon("Network");
export const PanelLeftClose = icon("PanelLeftClose");
export const PanelLeftOpen = icon("PanelLeftOpen");
export const Phone = icon("Phone");
export const Quote = icon("Quote");
export const RefreshCw = icon("RefreshCw");
export const Satellite = icon("Satellite");
export const Search = icon("Search");
export const Server = icon("Server");
export const Settings = icon("Settings");
export const ShieldCheck = icon("ShieldCheck");
export const SlidersHorizontal = icon("SlidersHorizontal");
export const Sparkles = icon("Sparkles");
export const Terminal = icon("Terminal");
export const TrendingDown = icon("TrendingDown");
export const TrendingUp = icon("TrendingUp");
export const User = icon("User");
export const Users = icon("Users");
export const X = icon("X");
export const Zap = icon("Zap");
