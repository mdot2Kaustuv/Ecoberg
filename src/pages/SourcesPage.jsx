import { Terminal } from "../icons.jsx";
import { dataSources } from "../data/platformContent.js";
import { BarList, Panel, StatusBadge } from "../components/ui.jsx";
import { hydrateSources } from "../lib/api.js";
import { useApiResource } from "../hooks/useApiResource.js";

const networkIntegrityFallback = [
  ["Aggregate Uptime", 99, "primary"],
  ["Data Consistency", 98, "tertiary"],
  ["Verification Lag", 85, "secondary"],
];

export function SourcesPage() {
  const { data } = useApiResource(
    "/api/sources",
    { dataSources, networkIntegrity: networkIntegrityFallback },
    hydrateSources
  );
  const PrimaryIcon = data.dataSources[0].icon;

  return (
    <div className="space">
      <div className="page-heading">
        <h1>Environmental Intelligence Index</h1>
        <p>
          Connecting global data lakes for precise atmospheric tracking. Ecoberg synchronizes with international verification bodies to keep the dataset transparent and policy-ready.
        </p>
      </div>

      <div className="sources-grid">
        <article className="source-feature">
          <div className="source-feature-head">
            <span className="source-icon large">
              <PrimaryIcon size={30} />
            </span>
            <div>
              <h2>Global Carbon Project (GCP)</h2>
              <p>Primary authority</p>
            </div>
            <StatusBadge label="Live / Active" />
          </div>
          <p>
            Comprehensive greenhouse gas monitoring that provides scientific assessments of carbon cycle changes and annual budget estimates.
          </p>
          <div className="source-metrics">
            <span>
              <small>Coverage</small>
              <strong>1959-2023</strong>
            </span>
            <span>
              <small>Data Type</small>
              <strong>API / NetCDF</strong>
            </span>
            <span>
              <small>Reliability</small>
              <strong>99.8% CER</strong>
            </span>
          </div>
        </article>

        <Panel title="Network Integrity">
          <BarList rows={data.networkIntegrity} showValues />
        </Panel>

        {data.dataSources.slice(1).map((source) => {
          const Icon = source.icon;
          return (
            <article className="source-card" key={source.short}>
              <div className="source-card-top">
                <span className="source-icon">
                  <Icon size={20} />
                </span>
                <StatusBadge label="Live" />
              </div>
              <h3>{source.name}</h3>
              <p>{source.summary}</p>
              <div className="source-card-foot">
                <span>
                  <small>Years</small>
                  <strong>{source.years}</strong>
                </span>
                <em>{source.type}</em>
              </div>
            </article>
          );
        })}

        <article className="developer-card">
          <div>
            <h3>Developer Resources</h3>
            <p>Access API documentation, SDKs, and schema definitions for custom environmental intelligence integrations.</p>
            <div className="button-row">
              <button className="button primary">Read Documentation</button>
              <button className="button ghost">Github Repo</button>
            </div>
          </div>
          <Terminal size={112} />
        </article>
      </div>
    </div>
  );
}
