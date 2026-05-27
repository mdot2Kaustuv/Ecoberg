import { BarChart3, Bolt, Gauge, Globe2, Leaf } from "../icons.jsx";
import { perCapitaBars } from "../data/platformContent.js";
import { BarList, Insight, MetricCard, Panel } from "../components/ui.jsx";
import { hydratePerCapita } from "../lib/api.js";
import { useApiResource } from "../hooks/useApiResource.js";

const perCapitaMetricFallback = [
  { label: "Nepal Per Capita", value: "0.61", unit: "t CO2", trend: "+2.3% YoY", icon: Leaf },
  { label: "Global Average", value: "4.7", unit: "t CO2", trend: "Gap: -87%", icon: Globe2 },
  { label: "Regional Rank", value: "7th", unit: "in SAARC", trend: "Lowest: Bhutan", icon: BarChart3 },
  { label: "Emission Intensity", value: "0.12", unit: "kg/$ GDP", trend: "Efficiency alert", tone: "amber", icon: Gauge },
];

const vulnerabilityFallback = [
  ["Climate Exposure", "Extreme"],
  ["Adaptation Need", "Urgent"],
  ["Contribution", "0.027%"],
];

export function PerCapitaPage() {
  const { data } = useApiResource(
    "/api/per-capita",
    { metrics: perCapitaMetricFallback, bars: perCapitaBars, vulnerability: vulnerabilityFallback },
    hydratePerCapita
  );

  return (
    <div className="space">
      <div className="metric-grid">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <Panel title="Global & Regional Benchmarking (2023)" subtitle="Comparative analysis of per capita CO2 emissions in tonnes">
        <BarList rows={data.bars} showValues />
      </Panel>

      <div className="two-column wide-left">
        <Panel title='The "Low Global Impact" Context'>
          <p className="body-copy">
            Despite year-on-year increases, Nepal's per capita output remains among the lowest globally. The platform frames that headroom against climate exposure, infrastructure growth, and Paris pathway targets.
          </p>
          <div className="insight-grid">
            <Insight icon={Bolt} title="Renewable Baseline" copy="Hydropower keeps grid electricity largely zero-emission." />
            <Insight icon={Gauge} title="Equity Gap" copy="Current 0.61t vs. a 2.0t global 2030 pathway target." />
          </div>
        </Panel>
        <Panel title="Vulnerability Index" tone="danger">
          <p className="body-copy">
            Nepal contributes minimally to global warming but faces material risk from glacial lake outbursts, heat stress, and agricultural disruption.
          </p>
          <div className="stacked-facts">
            {data.vulnerability.map(([label, value]) => (
              <span key={label}>
                <strong>{label}</strong>
                <em>{value}</em>
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
