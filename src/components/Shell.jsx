import { useState } from "react";
import {
  Bell,
  ChevronRight,
  Download,
  Filter,
  Leaf,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
} from "../icons.jsx";
import { appRoutes, routeMeta } from "../data/platformContent.js";

export function Shell({ route, navigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const active = routeMeta[route];
  const sidebarClass = ["sidebar", sidebarOpen ? "mobile-open" : "", collapsed ? "collapsed" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className={sidebarClass}>
        <div className="sidebar-top">
          <button className="brand brand-button" onClick={() => navigate("home")}>
            <Leaf size={28} />
            {!collapsed && <span>Ecoberg</span>}
          </button>
          {!collapsed && <p>Last indexed: 3 hours ago</p>}
        </div>
        <nav className="side-nav">
          {appRoutes.map((id) => {
            const Icon = routeMeta[id].icon;
            return (
              <button
                key={id}
                className={route === id ? "active" : ""}
                onClick={() => {
                  navigate(id);
                  setSidebarOpen(false);
                }}
                title={routeMeta[id].label}
              >
                <Icon size={20} />
                {!collapsed && <span>{routeMeta[id].label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-actions">
          <button className="button primary" onClick={() => navigate("admin")}> 
            <ShieldCheck size={18} />
            {!collapsed && "Admin Panel"}
          </button>
          <button
            className="icon-button desktop-only"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />
      )}

      <div className="main-shell">
        <header className="app-header">
          <div className="header-left">
            <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu size={22} />
            </button>
            <div className="breadcrumb">
              <span>Dashboard</span>
              <ChevronRight size={16} />
              <strong>{active.title}</strong>
            </div>
            <span className="date-pill">1970-2023</span>
          </div>
          <div className="header-actions">
            <button className="utility-button">
              <Filter size={18} />
              <span>Sector Filter</span>
            </button>
            <button className="utility-button">
              <Download size={18} />
              <span>Download</span>
            </button>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <button className="icon-button" aria-label="Settings">
              <Settings size={19} />
            </button>
            <div className="avatar">NP</div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
