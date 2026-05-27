import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ChevronDown,
  TrendingUp,
  X,
} from "../icons.jsx";
import { complianceRows, sectors } from "../data/platformContent.js";

export function MetricCard({ label, value, unit, trend, icon: Icon = null, tone = "primary" }) {
  return (
    <article className="metric-card">
      <div>
        <span>{label}</span>
        {Icon && <Icon size={22} className={`tone-${tone}`} />}
      </div>
      <strong>
        {value} <small>{unit}</small>
      </strong>
      <p className={`tone-${tone}`}>{trend}</p>
    </article>
  );
}

export function Panel({ title, subtitle, actions, children, className = "", tone }) {
  return (
    <section className={`panel ${tone ? `panel-${tone}` : ""} ${className}`.trim()}>
      <div className="panel-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="panel-actions">{actions}</div>}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function StatusBadge({ label }) {
  const clean = label.toLowerCase();
  const tone =
    clean.includes("critical") || clean.includes("error")
      ? "danger"
      : clean.includes("warning") || clean.includes("estimated") || clean.includes("monitor") || clean.includes("review")
        ? "amber"
        : "primary";

  return (
    <span className={`status-badge ${tone}`}>
      <CircleDot size={12} />
      {label}
    </span>
  );
}

export function SelectField({ label, options }) {
  return (
    <div className="field span-2">
      <label>{label}</label>
      <div className="select-wrap">
        <select defaultValue={options[0]}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={18} />
      </div>
    </div>
  );
}

export function Insight({ icon: Icon, title, copy }) {
  return (
    <div className="insight">
      <span>
        <Icon size={20} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
    </div>
  );
}

export function DetailDrawer({ open, onClose }) {
  return (
    <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="drawer-head">
        <h2>Data Entry Details</h2>
        <button className="icon-button" onClick={onClose} aria-label="Close details">
          <X size={20} />
        </button>
      </div>
      <div className="drawer-body">
        <div>
          <span className="eyebrow">Primary Metric</span>
          <h3>
            12.450 <small>Mt CO2e</small>
          </h3>
        </div>
        <div className="context-visual">
          <span />
          <span />
          <span />
        </div>
        <div className="fact-grid">
          <span>
            <small>Year</small>
            <strong>2023</strong>
          </span>
          <span>
            <small>Entity</small>
            <strong>Agriculture</strong>
          </span>
          <span>
            <small>GHG Type</small>
            <strong>Methane</strong>
          </span>
          <span>
            <small>Confidence</small>
            <strong>94.2%</strong>
          </span>
        </div>
        <Insight
          icon={CheckCircle2}
          title="Source Verification"
          copy="Verified by UNFCCC External Auditor. Methodology aligns with 2006 IPCC Guidelines."
        />
        <Insight
          icon={TrendingUp}
          title="Historical Context"
          copy="3.2% increase from 2022 levels and above the projected Terai baseline."
        />
        <div className="alert-box">
          <AlertTriangle size={18} />
          <p>This value is 12% higher than the 5-year rolling average for this sector.</p>
        </div>
      </div>
    </aside>
  );
}

export function TrendChart() {
  return (
    <div className="trend-chart">
      <svg viewBox="0 0 1000 320" role="img" aria-label="Nepal emissions trend chart">
        <defs>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3ddc84" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#3ddc84" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 0 290 Q 180 268 350 248 T 590 182 T 800 142 T 1000 95 L 1000 320 L 0 320 Z" fill="url(#trendFill)" />
        <path
          d="M 0 290 Q 180 268 350 248 T 590 182 T 800 142 T 1000 95"
          fill="none"
          stroke="#3ddc84"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path d="M 800 142 Q 910 122 1000 95" fill="none" stroke="#ffda7d" strokeDasharray="9 9" strokeWidth="4" />
        {[1990, 2000, 2010, 2020, 2023].map((year, index) => {
          const points = [
            [285, 257],
            [428, 241],
            [570, 194],
            [714, 158],
            [800, 142],
          ];
          const [x, y] = points[index];
          return (
            <g key={year}>
              <circle cx={x} cy={y} r={index === 4 ? 7 : 5} fill="#3ddc84" stroke="#09160e" strokeWidth="2" />
              <text x={x} y={y + 28} textAnchor="middle">
                {year}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="chart-legend">
        <span>
          <i className="bg-primary" />Historical
        </span>
        <span>
          <i className="bg-amber" />Projection
        </span>
        <span>
          <i className="bg-secondary" />Sector overlays
        </span>
      </div>
    </div>
  );
}

export function DonutChart() {
  let offset = 0;
  const circumference = 251;

  return (
    <div className="donut">
      <svg viewBox="0 0 100 100">
        {sectors.map((sector) => {
          const dash = (sector.value / 100) * circumference;
          const circle = (
            <circle
              key={sector.label}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`var(--${sector.color})`}
              strokeWidth="12"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div>
        <strong>18.2</strong>
        <span>Mt Total</span>
      </div>
    </div>
  );
}

export function Legend({ items }) {
  return (
    <div className="legend">
      {items.map((item) => (
        <div key={item.label}>
          <span className={`bg-${item.color}`} />
          <p>{item.label}</p>
          <strong>{item.value}%</strong>
        </div>
      ))}
    </div>
  );
}

export function BarList({ rows, showValues = false }) {
  return (
    <div className="bar-list">
      {rows.map((row) => {
        const [label, value, widthOrTone, rowTone] = row;
        const hasSeparateWidth = row.length > 3;
        const width = hasSeparateWidth ? widthOrTone : value;
        const tone = hasSeparateWidth ? rowTone : widthOrTone;
        const displayValue = showValues ? (typeof value === "number" ? `${value}%` : value) : `${width}%`;

        return (
          <div className="bar-row" key={label}>
            <div>
              <span>{label}</span>
              <strong>{displayValue}</strong>
            </div>
            <div className="bar-track">
              <span className={`bg-${tone}`} style={{ width: `${Number.parseFloat(width)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MiniBars() {
  return (
    <div className="mini-bars">
      {[
        ["Agri", 60, "12.4"],
        ["Energy", 85, "18.2"],
        ["Waste", 40, "4.2"],
        ["LULUCF", 30, "2.9"],
        ["Industry", 55, "9.8"],
        ["Transport", 70, "13.1"],
        ["Other", 25, "1.7"],
      ].map(([label, height, value]) => (
        <div key={label}>
          <span style={{ height: `${height}%` }}>
            <em>{value}</em>
          </span>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

export function GroupedBars() {
  const groups = [
    ["Energy", [85, 40, 60]],
    ["Transport", [65, 25, 75]],
    ["Agriculture", [92, 15, 35]],
    ["Industry", [50, 55, 88]],
  ];

  return (
    <div className="grouped-bars">
      <div className="chart-legend">
        <span>
          <i className="bg-primary" />Scope 1
        </span>
        <span>
          <i className="bg-amber" />Scope 2
        </span>
        <span>
          <i className="bg-muted" />Scope 3
        </span>
      </div>
      <div className="grouped-bars-canvas">
        {groups.map(([label, values]) => (
          <div key={label} className="bar-group">
            <div>
              {values.map((value, index) => (
                <span
                  key={`${label}-${index}`}
                  className={index === 0 ? "bg-primary" : index === 1 ? "bg-amber" : "bg-muted"}
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
            <p>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComplianceMeters({ rows = complianceRows }) {
  return (
    <div className="compliance">
      {rows.map(([label, value, tone, note]) => (
        <div key={label}>
          <div className="meter-head">
            <span>{label}</span>
            <strong className={`tone-${tone}`}>{value}%</strong>
          </div>
          <div className="meter-track">
            <span className={`bg-${tone}`} style={{ width: `${value}%` }} />
          </div>
          <p>{note}</p>
        </div>
      ))}
    </div>
  );
}
