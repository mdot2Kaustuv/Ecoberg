import { Download, FileText, Filter } from "../icons.jsx";
import { comparisonRows, complianceRows } from "../data/platformContent.js";
import { ComplianceMeters, GroupedBars, Panel, StatusBadge } from "../components/ui.jsx";
import { useApiResource } from "../hooks/useApiResource.js";

const peerFallback = [
  ["Nepal", "Baseline", 100, "primary"],
  ["Bangladesh", "+22.4%", 80, "danger"],
  ["Sri Lanka", "-8.1%", 45, "primary"],
  ["Cambodia", "+3.2%", 60, "amber"],
];

export function ComparePage() {
  const { data } = useApiResource("/api/compare", {
    rows: comparisonRows,
    peers: peerFallback,
    complianceRows,
  });

  return (
    <div className="compare-layout">
      <div className="compare-main space">
        <div className="toolbar-row">
          <div className="segmented">
            <button className="active">Sector Comparison</button>
            <button>Company Comparison</button>
          </div>
          <div className="toolbar-actions">
            <button className="button ghost">
              <Filter size={17} />
              Sector Filter
            </button>
            <button className="button primary">
              <Download size={17} />
              Download
            </button>
          </div>
        </div>

        <Panel title="Carbon Intensity by Scope" subtitle="Comparative analysis across economic sectors">
          <GroupedBars />
        </Panel>

        <Panel title="Detailed Sector Metrics" subtitle="Last updated: Oct 2023">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Entity</th>
                  <th>Scope 1</th>
                  <th>Scope 2</th>
                  <th>Scope 3</th>
                  <th>Total</th>
                  <th>% National</th>
                  <th>ESG Flag</th>
                  <th className="right">Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.entity}>
                    <td>
                      <strong>{row.entity}</strong>
                    </td>
                    <td>{row.scope1}</td>
                    <td>{row.scope2}</td>
                    <td>{row.scope3}</td>
                    <td>{row.total}</td>
                    <td>
                      <div className="inline-progress">
                        <span style={{ width: `${row.national}%` }} />
                      </div>
                      {row.national}%
                    </td>
                    <td>
                      <StatusBadge label={row.flag} />
                    </td>
                    <td className={`right tone-${row.trendTone}`}>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <section className="peer-grid" aria-label="Regional peer benchmarking">
          {data.peers.map(([country, value, pct, tone]) => (
            <article key={country}>
              <div>
                <strong>{country}</strong>
                <span className={`tone-${tone}`}>{value}</span>
              </div>
              <div className="inline-progress full">
                <span className={`bg-${tone}`} style={{ width: `${pct}%` }} />
              </div>
            </article>
          ))}
        </section>
      </div>

      <aside className="compare-aside space">
        <Panel title="ESG Compliance Alignment">
          <ComplianceMeters rows={data.complianceRows} />
        </Panel>
        <Panel title="Quick Links">
          <div className="link-list">
            {["Methodology Document", "Request Verification", "Sector Benchmarks"].map((item) => (
              <button key={item}>
                {item}
                <FileText size={17} />
              </button>
            ))}
          </div>
        </Panel>
      </aside>
    </div>
  );
}
