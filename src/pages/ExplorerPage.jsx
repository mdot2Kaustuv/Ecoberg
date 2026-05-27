import { useState } from "react";
import { BarChart3, ChevronDown, Search } from "../icons.jsx";
import { explorerRows } from "../data/platformContent.js";
import { DetailDrawer, MiniBars, Panel, SelectField, StatusBadge } from "../components/ui.jsx";
import { useApiResource } from "../hooks/useApiResource.js";

export function ExplorerPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visualsOpen, setVisualsOpen] = useState(true);
  const { data } = useApiResource("/api/explorer", { rows: explorerRows });

  return (
    <div className="explorer-page">
      <section className="filter-panel">
        <div className="field span-3">
          <label>Search Entities</label>
          <div className="input-with-icon">
            <Search size={18} />
            <input placeholder="Search parameters..." />
          </div>
        </div>
        <div className="field span-3">
          <label>
            Year Range <span>1970-2030</span>
          </label>
          <input type="range" min="1970" max="2030" defaultValue="2024" />
        </div>
        <SelectField label="Scope" options={["All Scopes", "Scope 1", "Scope 2", "Scope 3"]} />
        <SelectField label="Source" options={["All Sources", "UNFCCC", "IPCC", "Internal"]} />
        <SelectField label="Country" options={["Nepal", "India", "China", "Bhutan"]} />
      </section>

      <Panel className="table-panel" title="Filtered Emissions Records" subtitle="Click a row to inspect source metadata">
        <div className="table-wrap large-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Year</th>
                <th>Country</th>
                <th>Sector</th>
                <th>Scope</th>
                <th className="right">Emissions</th>
                <th>GHG</th>
                <th>Source</th>
                <th>Quality</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row[0]} onClick={() => setDrawerOpen(true)} className="clickable-row">
                  <td className="mono">{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>
                    <span className="scope-pill">{row[4]}</span>
                  </td>
                  <td className="right mono tone-primary">{row[5]}</td>
                  <td>{row[6]}</td>
                  <td>{row[7]}</td>
                  <td>
                    <StatusBadge label={row[8]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className={`visual-panel ${visualsOpen ? "open" : ""}`}>
        <button className="visual-toggle" onClick={() => setVisualsOpen(!visualsOpen)}>
          <span>
            <BarChart3 size={19} />
            Visualize current filter: emission trend by sector
          </span>
          <ChevronDown size={18} />
        </button>
        {visualsOpen && <MiniBars />}
      </section>

      <DetailDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
