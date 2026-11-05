"use client";

import { useState } from "react";
import { Menu, Search, X } from "lucide-react";

type Section = "home" | "sale" | "sold" | "watchlist" | "newsletter";

const links: { label: string; section: Section }[] = [
  { label: "Home", section: "home" },
  { label: "Horses for sale", section: "sale" },
  { label: "Recently sold", section: "sold" },
  { label: "Newsletter", section: "newsletter" },
  { label: "My watchlist", section: "watchlist" },
];

export function SiteHeader({
  query,
  onQueryChange,
  watchCount,
  activeSection,
  onNavigate,
  onAuth,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  watchCount: number;
  activeSection: Section;
  onNavigate: (section: Section) => void;
  onAuth: (tab: "login" | "register") => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (section: Section) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-main shell">
        <button type="button" className="brand-lockup" onClick={() => navigate("home")} aria-label="Aurelia Equine home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 42 46" fill="none">
              <path d="M8.2 39.5c2.4-5.8 1.7-11.3.8-16.2-.8-4.1.5-8.3 4.1-10.8 3.2-2.2 7.5-2.1 10.1-5.1 1.8-2 2.8-4.5 3.1-6.2 3.2 1.7 4.5 4.1 4.2 6.8 3.8 1.8 5.5 5.3 5.1 9-.4 3.5-3.1 5.6-5.4 7.7-1.6 1.5-2.3 3.4-2.1 5.8l.6 8.2" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.2 17.4c1.9 1.4 4.1 1.8 6.5 1.3m-12 5.1c4.2 1 7.8.4 10.8-1.5M14.4 32.2c4.3 1.1 8.7.7 13.2-1.2M9.6 39.5h23.2" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
              <path d="M27.3 10.6c1.4 1.1 2.3 2.5 2.6 4.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="brand-type">
            <span className="brand-name">Aurelia Equine</span>
            <span className="brand-caption">Exceptional horses, thoughtfully found</span>
          </span>
        </button>

        <div className="header-tools">
          <label className="search-box">
            <Search size={16} strokeWidth={1.7} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              type="search"
              placeholder="Search horses or breeds"
              aria-label="Search auctions and recently sold horses"
            />
            {query && <button type="button" className="search-clear" onClick={() => onQueryChange("")} aria-label="Clear search"><X size={13} /></button>}
          </label>
          <button type="button" className="header-login" onClick={() => onAuth("login")}>Log in</button>
          <button type="button" className="button button-primary header-register" onClick={() => onAuth("register")}>Register</button>
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <div className={`nav-row shell ${menuOpen ? "nav-open" : ""}`}>
        <nav id="site-navigation" aria-label="Main navigation" className="main-nav">
          {links.map(({ label, section }) => (
            <button
              key={section}
              type="button"
              onClick={() => navigate(section)}
              className={`nav-link ${activeSection === section ? "nav-active" : ""}`}
              aria-current={activeSection === section ? "page" : undefined}
            >
              {label}
              {section === "watchlist" && <span className="nav-count" aria-label={`${watchCount} items in watchlist`}>{watchCount}</span>}
            </button>
          ))}
        </nav>
        <span className="nav-edition">The 2026 collection <span>·</span> carefully curated</span>
        {menuOpen && (
          <div className="mobile-menu-extra">
            <label className="search-box mobile-search-box">
              <Search size={16} strokeWidth={1.7} aria-hidden="true" />
              <input value={query} onChange={(event) => onQueryChange(event.target.value)} type="search" placeholder="Search horses or breeds" aria-label="Search auctions and recently sold horses" />
              {query && <button type="button" className="search-clear" onClick={() => onQueryChange("")} aria-label="Clear search"><X size={13} /></button>}
            </label>
            <div className="mobile-auth-row">
              <button type="button" className="header-login" onClick={() => { onAuth("login"); setMenuOpen(false); }}>Log in</button>
              <button type="button" className="button button-primary" onClick={() => { onAuth("register"); setMenuOpen(false); }}>Register</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
