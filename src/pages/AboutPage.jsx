import { useState } from "react";
import { ChevronDown, Mail, MapPin, Network, Phone, Quote, ShieldCheck } from "../icons.jsx";
import { dashboardPreview, faqs, team } from "../data/platformContent.js";
import { BarList, Insight, Panel } from "../components/ui.jsx";

export function AboutPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="about-page space">
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(5,17,9,0.95), rgba(9,22,14,0.72)), url(${dashboardPreview})`,
        }}
      >
        <div>
          <span className="eyebrow">Our Mission</span>
          <h1>Catalyzing Nepal's climate resiliency through data.</h1>
          <p>
            Ecoberg is an open-access platform built to democratize environmental intelligence for policy, industry, and grassroots action in the Himalayas.
          </p>
        </div>
      </section>

      <div className="two-column wide-left">
        <Panel title="The Methodology">
          <p className="body-copy">
            Our data engine synchronizes global satellite imagery with ground-level sensors across Nepal's diverse topography, from Terai plains to high-altitude corridors.
          </p>
          <div className="insight-grid">
            <Insight icon={Network} title="Data Normalization" copy="Bayesian filtering reconciles streams into one CO2 metric." />
            <Insight icon={ShieldCheck} title="Independent Verification" copy="Every record is cross-referenced against regional monitoring stations." />
          </div>
        </Panel>
        <Panel title="Sector Coverage">
          <BarList
            rows={[
              ["Urban Transportation", 100, "primary"],
              ["Industrial Emissions", 94, "primary"],
              ["Forest Carbon Sinks", 72, "tertiary"],
              ["Agricultural Output", 58, "secondary"],
            ]}
            showValues
          />
        </Panel>
      </div>

      <section className="team-section">
        <div className="section-heading left">
          <span className="eyebrow">Kathmandu-based collective</span>
          <h2>The minds behind Ecoberg.</h2>
        </div>
        <div className="team-grid">
          {team.map(([name, role, initials]) => (
            <article className="team-card" key={name}>
              <div className="portrait">{initials}</div>
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-layout">
        <div>
          <h2>Frequently Asked Questions</h2>
          <p className="body-copy">Everything you need to know about data integrity and update cycles.</p>
          <div className="quote-card">
            <Quote size={24} />
            <p>Transparency is the first step toward collective accountability.</p>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article key={question} className={openFaq === index ? "open" : ""}>
              <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                {question}
                <ChevronDown size={18} />
              </button>
              {openFaq === index && <p>{answer}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-form">
          <h2>Get in Touch</h2>
          <div className="form-grid">
            <label>
              Full Name
              <input placeholder="John Doe" />
            </label>
            <label>
              Email Address
              <input placeholder="john@example.com" />
            </label>
          </div>
          <label>
            Message
            <textarea rows="4" placeholder="How can we help your research?" />
          </label>
          <button className="button primary">Send Inquiry</button>
        </div>
        <div className="contact-map">
          <div className="map-grid" />
          <div className="hub-card">
            <h3>Our Hub</h3>
            <p>
              <MapPin size={17} /> Kopundol, Lalitpur, Nepal
            </p>
            <p>
              <Mail size={17} /> contact@ecoberg.np
            </p>
            <p>
              <Phone size={17} /> +977 1 42533XX
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
