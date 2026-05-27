import { ArrowUpRight } from "../icons.jsx";
import { dataSources, ghgComposition, metrics, sectors, variationRows } from "../data/platformContent.js";
import { BarList, DonutChart, Legend, MetricCard, Panel, TrendChart } from "../components/ui.jsx";
import { hydrateDashboard } from "../lib/api.js";
import { useApiResource } from "../hooks/useApiResource.js";

export function DashboardPage({ navigate }) {
  const { data } = useApiResource(
    "/api/dashboard",
    { metrics, variationRows, sectors, ghgComposition, dataSources },
    hydrateDashboard
  );

  return (
    <div className="space">
      <div className="metric-grid">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <Panel
        title="Nepal Emissions Trend (1970-2030)"
        subtitle="Historical data combined with predictive modeling projections"
        actions={
          <div className="segmented">
            <button className="active">Historical</button>
            <button>Projected</button>
          </div>
        }
      >
        <TrendChart />
      </Panel>

      <div className="two-column">
        <Panel title="Emissions by Sector (2023)">
          <div className="donut-layout">
            <DonutChart />
            <Legend items={data.sectors} />
          </div>
        </Panel>

        <Panel title="Yearly Variation Matrix" actions={<button className="text-button">View All</button>}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Total MT</th>
                  <th>Change</th>
                  <th>Top Sector</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {data.variationRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="mono">{row[0]}</td>
                    <td>{row[1]}</td>
                    <td className={`tone-${row[5]}`}>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>
                      <span className="source-pill">{row[4]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="twelve-grid">
        <Panel className="span-8" title="GHG Composition by Gas Type">
          <BarList rows={data.ghgComposition} />
        </Panel>
        <Panel className="span-4" title="Verified Data Sources">
          <div className="source-list">
            {data.dataSources.slice(0, 4).map((source) => {
              const Icon = source.icon;
              return (
                <button key={source.short} onClick={() => navigate("sources") }>
                  <span className="source-icon">
                    <Icon size={18} />
                  </span>
                  <span>
                    <strong>{source.short}</strong>
                    <small>{source.name}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
