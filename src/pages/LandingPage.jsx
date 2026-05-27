import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowRight, ArrowUpRight, Leaf } from "../icons.jsx";
import { landingCards, routeMeta } from "../data/platformContent.js";
import heroBg from "../assets/hero-bg.jpg";

export function LandingPage({ navigate }) {
  const heroRef = useRef(null);
  
  useEffect(() => {
    let raf = 0;
    const updateFrame = () => {
      raf = 0;
      const scrollY = window.scrollY || 0;
      const maxScroll = window.innerHeight * 1.1;
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      if (heroRef.current) {
        heroRef.current.style.setProperty("--hero-shift", `${Math.min(48, scrollY * 0.08)}px`);
        heroRef.current.style.setProperty("--hero-fade", `${1 - progress * 0.35}`);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateFrame);
    };

    updateFrame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateFrame);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateFrame);
    };
  }, []);

  return (
    <div className="landing">
      <header className="landing-nav">
        <button className="brand brand-button" onClick={() => navigate("home")} aria-label="Ecoberg home">
          <Leaf size={28} />
          <span>Ecoberg</span>
        </button>
        <nav className="landing-links">
          {["dashboard", "explorer", "compare", "about"].map((item) => (
            <button key={item} onClick={() => navigate(item)}>
              {routeMeta[item].label}
            </button>
          ))}
        </nav>
        <button className="button primary" onClick={() => navigate("dashboard")}>
          <Activity size={18} />
          View Live Data
        </button>
      </header>

      <main>
        <section className="hero" ref={heroRef}>
          <div className="hero-media" aria-hidden="true" style={{ backgroundImage: `url(${heroBg})` }} />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-content">
            <div className="chip">
              <span className="pulse" />
              V2.4 Live: high precision mode
            </div>
            <h1>Nepal's environmental data ledger for open carbon intelligence.</h1>
            <p>
              Ecoberg aggregates Global Carbon Project, EDGAR, ODIAC, UNFCCC, and local survey records into a policy-grade emissions workspace.
            </p>
            <div className="hero-actions">
              <button className="button primary large" onClick={() => navigate("dashboard")}>
                Explore Dashboard
                <ArrowRight size={18} />
              </button>
              <button className="button ghost large" onClick={() => navigate("sources")}>
                Browse Data Sources
              </button>
            </div>
          </div>
        </section>

        <section className="stats-strip" aria-label="Ecoberg platform statistics">
          {[
            ["Current Emissions", "18.2 Mt"],
            ["Data Sources", "05 Fixed"],
            ["Temporal Depth", "50+ Years"],
            ["2030 Forecast", "25.4 Mt"],
          ].map(([label, value]) => (
            <div key={label} className="stat-item">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>

        <section className="preview-section">
          <div className="section-heading">
            <span className="eyebrow">Intelligence at scale</span>
            <h2>From national trends to row-level verification.</h2>
          </div>
          <div className="preview-grid">
            {landingCards.map((card) => {
              const Icon = card.icon;
              return (
                <article className="preview-card" key={card.title}>
                  <div className="preview-image">
                    <img src={card.img} alt={`${card.title} interface preview`} />
                  </div>
                  <div className="preview-copy">
                    <Icon size={22} />
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                    <button onClick={() => navigate(card.route)}>
                      Open
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
