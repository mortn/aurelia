"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  CircleHelp,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { AuctionCard, SoldHorseCard } from "@/components/horse-cards";
import {
  AuctionDetailModal,
  AuthModal,
  BidModal,
  buildBidRecord,
  SoldResultModal,
  TourModal,
} from "@/components/auction-modals";
import { SiteHeader } from "@/components/site-header";
import { formatMoney, initialAuctions, recentlySold, type AuctionHorse, type AuctionStatus } from "@/lib/auction-data";

type NavSection = "home" | "sale" | "sold" | "watchlist" | "newsletter";
type ModalState =
  | { type: "detail"; id: string }
  | { type: "bid"; id: string }
  | { type: "tour"; id: string }
  | { type: "auth"; tab: "login" | "register" }
  | { type: "sold"; id: string }
  | null;

const WATCHLIST_KEY = "aurelia-equine-watchlist-v1";
const initialClockValues = Object.fromEntries(initialAuctions.map((horse) => [horse.id, horse.secondsRemaining]));

function matchesSearch(horse: { name: string; breed: string }, query: string) {
  return !query || `${horse.name} ${horse.breed}`.toLocaleLowerCase().includes(query);
}

export default function HomePage() {
  const [auctions, setAuctions] = useState(initialAuctions);
  const [remainingById, setRemainingById] = useState<Record<string, number>>(initialClockValues);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<NavSection>("home");
  const [modal, setModal] = useState<ModalState>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(WATCHLIST_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setWatchedIds(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      // A blocked or malformed localStorage entry should never prevent browsing.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchedIds));
    } catch {
      // The watchlist remains available in memory if browser storage is disabled.
    }
  }, [storageReady, watchedIds]);

  useEffect(() => {
    const readyTimer = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingById((current) => {
        const next = { ...current };
        for (const id of Object.keys(next)) next[id] = Math.max(0, next[id] - 1);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4200);
  }, []);

  const navigate = (nextSection: NavSection) => {
    setSection(nextSection);
    if (nextSection === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = nextSection === "sale" || nextSection === "watchlist" ? "auctions" : nextSection === "sold" ? "recently-sold" : "newsletter";
    window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };

  const toggleWatch = (id: string) => {
    const horse = auctions.find((item) => item.id === id);
    const exists = watchedIds.includes(id);
    setWatchedIds((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]);
    if (horse) showToast(exists ? `${horse.name} removed from your watchlist.` : `${horse.name} added to your watchlist.`);
  };

  const phaseOf = (horse: AuctionHorse): AuctionStatus => {
    const remaining = remainingById[horse.id] ?? horse.secondsRemaining;
    if (horse.status === "upcoming") return remaining <= 0 ? "live" : "upcoming";
    return remaining <= 0 ? "ended" : "live";
  };

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleAuctions = auctions.filter((horse) => {
    if (section === "watchlist" && !watchedIds.includes(horse.id)) return false;
    return matchesSearch(horse, normalizedQuery);
  });
  const visibleSold = recentlySold.filter((horse) => matchesSearch(horse, normalizedQuery));
  const liveAuctionCount = auctions.filter((horse) => phaseOf(horse) === "live").length;
  const detailHorse = modal && "id" in modal ? auctions.find((horse) => horse.id === modal.id) : undefined;
  const resultHorse = modal?.type === "sold" ? recentlySold.find((horse) => horse.id === modal.id) : undefined;
  const emptyWatchlist = section === "watchlist" && watchedIds.length === 0;
  const showAuctions = section !== "sold";
  const showSoldSection = section === "home" || section === "sold" || section === "newsletter";

  const submitBid = (amount: number) => {
    if (modal?.type !== "bid") return;
    const horse = auctions.find((item) => item.id === modal.id);
    if (!horse) return;
    if (phaseOf(horse) !== "live") {
      setModal(null);
      showToast("This auction has closed. No offer was recorded.");
      return;
    }
    setAuctions((current) => current.map((item) => item.id === horse.id ? {
      ...item,
      currentBid: amount,
      bidCount: item.bidCount + 1,
      history: [...item.history, buildBidRecord(amount)],
    } : item));
    setModal(null);
    showToast(`Your ${formatMoney(amount)} offer for ${horse.name} is recorded in this preview.`);
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail("");
  };

  return (
    <div className="site-shell">
      <SiteHeader
        query={query}
        onQueryChange={setQuery}
        watchCount={watchedIds.length}
        activeSection={section}
        onNavigate={navigate}
        onAuth={(tab) => setModal({ type: "auth", tab })}
      />

      <main className="main-content shell">
        {showAuctions && (
          <section id="auctions" className="auction-section section-anchor" aria-labelledby="auction-section-title">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow section-eyebrow">
                  <span className="eyebrow-line" />
                  {section === "watchlist" ? "Kept close" : section === "sale" ? "Available now" : "The 2026 collection"}
                </p>
                <div className="heading-title-line">
                  <h1 id="auction-section-title" className="section-title">
                    {section === "watchlist" ? "My Watchlist" : section === "sale" ? "Horses for Sale" : "Live & Upcoming Auctions"}
                  </h1>
                  {section !== "watchlist" && section !== "sale" && (
                    <span className="live-indicator"><span className="status-dot" /> {liveAuctionCount} {liveAuctionCount === 1 ? "auction" : "auctions"} live</span>
                  )}
                </div>
                <p className="section-description">
                  {section === "watchlist"
                    ? "The horses you’ve chosen to follow, all in one place."
                    : section === "sale"
                      ? "A considered selection of exceptional horses, each presented with care."
                      : "A small, carefully chosen collection. Follow the bidding as it unfolds."}
                </p>
              </div>
              <div className="collection-note"><span>CURATED WITH CARE</span><span className="collection-note-line" /><span>LOTS 014—016</span></div>
            </div>

            {loading ? (
              <div className="auction-grid" aria-label="Loading auctions" aria-busy="true">
                {initialAuctions.map((horse) => <AuctionSkeleton key={horse.id} />)}
              </div>
            ) : visibleAuctions.length ? (
              <div className="auction-grid">
                {visibleAuctions.map((horse) => (
                  <AuctionCard
                    key={horse.id}
                    horse={horse}
                    secondsRemaining={remainingById[horse.id] ?? horse.secondsRemaining}
                    phase={phaseOf(horse)}
                    isWatched={watchedIds.includes(horse.id)}
                    onOpen={() => setModal({ type: "detail", id: horse.id })}
                    onWatch={() => toggleWatch(horse.id)}
                    onBid={() => setModal({ type: "bid", id: horse.id })}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state" role="status">
                <span className="empty-state-icon">{section === "watchlist" ? <Star size={19} /> : <Search size={19} />}</span>
                <p className="eyebrow mb-2">{emptyWatchlist ? "Nothing tucked away yet" : "No matching lots"}</p>
                <h2 className="font-display text-2xl">{emptyWatchlist ? "Your watchlist is waiting." : section === "watchlist" ? "No saved horse matches." : "We couldn’t find that horse."}</h2>
                <p>{emptyWatchlist ? "Save a horse with the star and we’ll keep it close for you." : section === "watchlist" ? "Try a different search, or return to your full watchlist." : "Try another name or breed, or clear your search to see the full collection."}</p>
                {query && <button type="button" className="text-action" onClick={() => setQuery("")}>Clear search <ArrowRight size={14} /></button>}
                {section === "watchlist" && <button type="button" className="text-action" onClick={() => navigate("sale")}>Explore horses for sale <ArrowRight size={14} /></button>}
              </div>
            )}

            <div className="auction-section-footnote">
              <span><ShieldCheck size={14} /> Every horse is vet-checked and identity verified.</span>
              <button type="button" onClick={() => navigate("sale")}>Explore available horses <ArrowRight size={13} /></button>
            </div>
          </section>
        )}

        {showSoldSection && (
          <section id="recently-sold" className={`lower-section section-anchor ${section === "sold" ? "sold-only-section" : ""}`} aria-labelledby="sold-title">
            <div className="sold-column">
              <div className="lower-heading-row">
                <div>
                  <p className="eyebrow section-eyebrow"><span className="eyebrow-line" />Good homes, good endings</p>
                  {section === "sold" ? <h1 id="sold-title" className="section-title lower-section-title">Recently Sold</h1> : <h2 id="sold-title" className="section-title lower-section-title">Recently Sold</h2>}
                  <p className="section-description">A look back at a few of the horses who’ve found their next chapter.</p>
                </div>
                <span className="sold-count">02 <span>results</span></span>
              </div>
              {visibleSold.length ? (
                <div className="sold-list">
                  {visibleSold.map((horse) => <SoldHorseCard key={horse.id} horse={horse} onResult={() => setModal({ type: "sold", id: horse.id })} />)}
                </div>
              ) : (
                <div className="empty-sold-state" role="status">
                  <CircleHelp size={18} />
                  <span>No sold horses match “{query}”. Try searching a different breed or name.</span>
                  {query && <button type="button" onClick={() => setQuery("")}>Clear</button>}
                </div>
              )}
            </div>

            <aside className="newsletter-panel section-anchor" id="newsletter" aria-labelledby="newsletter-title">
              <div className="newsletter-topline"><span className="newsletter-icon"><Mail size={18} strokeWidth={1.6} /></span><span className="micro-label">A note from Aurelia</span></div>
              {newsletterSuccess ? (
                <div className="newsletter-success" role="status">
                  <span className="newsletter-success-icon"><Check size={17} /></span>
                  <p className="eyebrow mb-2">You’re on the list</p>
                  <h2 id="newsletter-title" className="font-display text-3xl">The next collection, delivered.</h2>
                  <p>Thank you for joining us. We’ll be in touch when a horse catches your eye.</p>
                  <button type="button" className="newsletter-reset" onClick={() => setNewsletterSuccess(false)}>Use another email <ArrowRight size={13} /></button>
                </div>
              ) : (
                <>
                  <p className="eyebrow newsletter-eyebrow">Aurelia dispatches</p>
                  <h2 id="newsletter-title" className="font-display newsletter-title">A little more<br />horse, less noise.</h2>
                  <p className="newsletter-copy">New arrivals, thoughtful advice, and first look access — only when there’s something worth sharing.</p>
                  <form className="newsletter-form" onSubmit={submitNewsletter}>
                    <label className="sr-only" htmlFor="newsletter-email">Your email address</label>
                    <input
                      id="newsletter-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="Your email address"
                      value={newsletterEmail}
                      onChange={(event) => setNewsletterEmail(event.target.value)}
                    />
                    <button type="submit" aria-label="Subscribe to the Aurelia newsletter"><ArrowRight size={17} /></button>
                  </form>
                  <p className="newsletter-privacy"><ShieldCheck size={12} /> A considered email, occasionally. Unsubscribe any time.</p>
                  <div className="newsletter-ornament" aria-hidden="true"><span /><span /><span /></div>
                </>
              )}
            </aside>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-main shell">
          <div className="footer-brand-column">
            <div className="footer-brand-lockup">
              <span className="brand-mark footer-mark" aria-hidden="true">
                <svg viewBox="0 0 42 46" fill="none"><path d="M8.2 39.5c2.4-5.8 1.7-11.3.8-16.2-.8-4.1.5-8.3 4.1-10.8 3.2-2.2 7.5-2.1 10.1-5.1 1.8-2 2.8-4.5 3.1-6.2 3.2 1.7 4.5 4.1 4.2 6.8 3.8 1.8 5.5 5.3 5.1 9-.4 3.5-3.1 5.6-5.4 7.7-1.6 1.5-2.3 3.4-2.1 5.8l.6 8.2M17.2 17.4c1.9 1.4 4.1 1.8 6.5 1.3m-12 5.1c4.2 1 7.8.4 10.8-1.5M14.4 32.2c4.3 1.1 8.7.7 13.2-1.2M9.6 39.5h23.2" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span><span className="footer-brand-name">Aurelia Equine</span><span className="footer-brand-tagline">Exceptional horses, thoughtfully found</span></span>
            </div>
            <p className="footer-manifesto">The right horse changes everything.<br />We’re here to help you find yours.</p>
          </div>
          <div className="footer-column">
            <p className="footer-label">Visit us</p>
            <p className="footer-address"><MapPin size={14} /> Cotswold Equestrian Estate<br /><span>Cirencester, Gloucestershire<br />United Kingdom GL7 5XX</span></p>
          </div>
          <div className="footer-column">
            <p className="footer-label">Speak to our team</p>
            <a className="footer-contact" href="mailto:hello@aureliaequine.com"><Mail size={14} /> hello@aureliaequine.com</a>
            <a className="footer-contact" href="tel:+441285555014"><Phone size={14} /> +44 (0)1285 555 014</a>
            <p className="footer-hours">Monday – Saturday, 9am – 5pm GMT</p>
          </div>
          <div className="footer-column footer-social-column">
            <p className="footer-label">Follow the journey</p>
            <div className="social-links">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Aurelia Equine on Instagram"><Instagram size={16} /></a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Aurelia Equine on Facebook"><span className="facebook-mark">f</span></a>
            </div>
            <a className="footer-help" href="mailto:hello@aureliaequine.com?subject=Buying%20enquiry">A question about buying? <ArrowRight size={13} /></a>
          </div>
        </div>
        <div className="footer-bottom shell"><span>© 2026 Aurelia Equine. All rights reserved.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms of sale</a><span>Made for the love of horses.</span></div></div>
      </footer>

      {modal?.type === "detail" && detailHorse && (
        <AuctionDetailModal
          horse={detailHorse}
          secondsRemaining={remainingById[detailHorse.id] ?? detailHorse.secondsRemaining}
          isWatched={watchedIds.includes(detailHorse.id)}
          onClose={() => setModal(null)}
          onWatch={() => toggleWatch(detailHorse.id)}
          onBid={() => setModal({ type: "bid", id: detailHorse.id })}
          onTour={() => setModal({ type: "tour", id: detailHorse.id })}
        />
      )}
      {modal?.type === "bid" && detailHorse && <BidModal horse={detailHorse} onClose={() => setModal(null)} onSubmit={submitBid} />}
      {modal?.type === "tour" && detailHorse && <TourModal horse={detailHorse} onClose={() => setModal(null)} onSuccess={(name) => showToast(`Tour request received${name ? ` for ${name}` : ""}. We’ll be in touch.`)} />}
      {modal?.type === "auth" && <AuthModal initialTab={modal.tab} onClose={() => setModal(null)} />}
      {modal?.type === "sold" && resultHorse && <SoldResultModal horse={resultHorse} onClose={() => setModal(null)} />}

      {toast && (
        <div className="toast-message" role="status" aria-live="polite">
          <span className="toast-icon"><Check size={15} /></span><span>{toast}</span>
          <button type="button" onClick={() => setToast("")} aria-label="Dismiss message"><X size={15} /></button>
        </div>
      )}
    </div>
  );
}

function AuctionSkeleton() {
  return (
    <div className="auction-card skeleton-card" aria-hidden="true">
      <div className="skeleton-photo" />
      <div className="skeleton-body">
        <span className="skeleton-line skeleton-short" /><span className="skeleton-line skeleton-title" /><span className="skeleton-line skeleton-medium" />
        <span className="skeleton-line skeleton-price" /><span className="skeleton-line skeleton-full" /><span className="skeleton-button" />
      </div>
    </div>
  );
}
