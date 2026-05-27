import { Database, FileText, RefreshCw, Server, Settings, Users } from "../icons.jsx";
import { pipelineRows, surveyQueue } from "../data/platformContent.js";
import { MetricCard, Panel, StatusBadge } from "../components/ui.jsx";
import { hydrateAdmin } from "../lib/api.js";
import { useApiResource } from "../hooks/useApiResource.js";

const adminMetricFallback = [
  { label: "Pipeline Jobs", value: "14/14", unit: "100% success", trend: "All sources green", icon: Server },
  { label: "Pending Reviews", value: "3", unit: "requires action", trend: "Manual queue", tone: "amber", icon: FileText },
  { label: "Total Records", value: "847,219", unit: "+1.2k today", trend: "Indexed documents", icon: Database },
];

const userFallback = [
  ["N. Shrestha", "Superadmin"],
  ["R. Thapa", "Pipeline Manager"],
  ["S. Gurung", "Data Analyst"],
  ["A. Pandey", "Auditor"],
];

const auditFallback = [
  ["INFO", 'Scheduled pipeline "Nepal Ground Sensors" initiated successfully.'],
  ["AUTH", 'User "N. Shrestha" accessed survey approval queue.'],
  ["WARN", 'API latency spike detected on "AirVisual Global" (350ms).'],
  ["INFO", "Database indexing complete. 847,219 documents current."],
  ["ERROR", 'Webhook timeout on secondary mirror server (404).'],
];

export function AdminPage() {
  const { data } = useApiResource(
    "/api/admin",
    {
      metrics: adminMetricFallback,
      pipelineRows,
      surveyQueue,
      users: userFallback,
      auditLog: auditFallback,
    },
    hydrateAdmin
  );

  return (
    <div className="space admin-page">
      <div className="admin-heading">
        <div>
          <h1>Pipeline Control Center</h1>
          <p>
            System status: <span>HEALTHY</span>
          </p>
        </div>
        <button className="button primary">
          <RefreshCw size={17} />
          Force Sync
        </button>
      </div>

      <div className="metric-grid three">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="admin-grid">
        <Panel className="span-8" title="Pipeline Monitor" actions={<StatusBadge label="Live Update" />}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Last Run</th>
                  <th>Status</th>
                  <th>Records</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.pipelineRows.map((row) => (
                  <tr key={row[0]}>
                    <td>
                      <strong>{row[0]}</strong>
                    </td>
                    <td>{row[1]}</td>
                    <td>
                      <StatusBadge label={row[2]} />
                    </td>
                    <td className="mono">{row[3]}</td>
                    <td>
                      <button className="icon-button">
                        <Settings size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="span-4" title="Survey Queue" actions={<span className="tone-amber compact-label">3 pending</span>}>
          <div className="survey-list">
            {data.surveyQueue.map(([type, title, copy]) => (
              <article key={title}>
                <span>{type}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <div>
                  <button>Approve</button>
                  <button>Reject</button>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="span-12" title="User Management" actions={<button className="text-button">+ Add New Admin</button>}>
          <div className="user-grid">
            {data.users.map(([name, role]) => (
              <div key={name}>
                <span className="avatar small">
                  <Users size={18} />
                </span>
                <strong>{name}</strong>
                <small>{role}</small>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="span-12 terminal-panel" title="System Audit Log">
          {data.auditLog.map(([level, text], index) => (
            <p key={text}>
              <span className={level === "ERROR" ? "tone-danger" : level === "WARN" ? "tone-amber" : "tone-primary"}>
                [2026-05-25 14:{15 - index}:02]
              </span>{" "}
              {level}: {text}
            </p>
          ))}
        </Panel>
      </div>
    </div>
  );
}
