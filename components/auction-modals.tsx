"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Gavel,
  MapPin,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney, type AuctionHorse, type BidRecord, type SoldHorse } from "@/lib/auction-data";
import { ModalFrame } from "@/components/modal-frame";

type DetailProps = {
  horse: AuctionHorse;
  secondsRemaining: number;
  isWatched: boolean;
  onClose: () => void;
  onWatch: () => void;
  onBid: () => void;
  onTour: () => void;
};

const compactMoney = (amount: number) => `$${Math.round(amount / 1000)}k`;

export function AuctionDetailModal({
  horse,
  secondsRemaining,
  isWatched,
  onClose,
  onWatch,
  onBid,
  onTour,
}: DetailProps) {
  const chartData = useMemo(
    () => horse.history.map((entry) => ({ ...entry, value: entry.amount })),
    [horse.history],
  );
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const ended = horse.status === "live" && secondsRemaining <= 0;
  const notOpen = horse.status === "upcoming" && secondsRemaining > 0;
  const openingNow = horse.status === "upcoming" && secondsRemaining <= 0;

  return (
    <ModalFrame
      title={horse.name}
      eyebrow={`Lot ${horse.lot} · ${horse.breed}`}
      onClose={onClose}
      className="detail-modal"
      labelledBy="horse-detail-title"
    >
      <div className="detail-layout">
        <div className="detail-visual-column">
          <div className="detail-photo-wrap">
            <img className="detail-photo" src={horse.image} alt={horse.imageAlt} />
            <span className={`status-chip ${ended ? "status-ended" : horse.status === "live" || !notOpen ? "status-live" : "status-upcoming"}`}>
              <span className="status-dot" />
              {ended ? "Auction ended" : notOpen ? "Opens tomorrow" : openingNow ? "Just opened" : "Live auction"}
            </span>
            <span className="photo-lot">AURELIA · LOT {horse.lot}</span>
          </div>
          <div className="detail-price-card">
            <div>
              <p className="micro-label">{horse.bidCount ? "Current bid" : "Starting bid"}</p>
              <p className="font-display text-3xl text-forest">{formatMoney(horse.currentBid)}</p>
            </div>
            <div className="detail-price-meta">
              <span><Gavel size={15} /> {horse.bidCount} {horse.bidCount === 1 ? "bid" : "bids"}</span>
              <span><Clock3 size={15} /> {ended ? "Ended" : notOpen ? `Opens in ${hours}h ${minutes}m` : openingNow ? "Bidding now open" : `${hours}h ${minutes}m left`}</span>
            </div>
            <div className="detail-actions">
              <button type="button" className="button button-primary flex-1" onClick={onBid} disabled={ended || notOpen}>
                <Gavel size={15} /> {notOpen ? "Bidding opens tomorrow" : ended ? "Auction ended" : "Place a bid"}
              </button>
              <button
                type="button"
                className={`button button-outline watch-action ${isWatched ? "is-watched" : ""}`}
                onClick={onWatch}
                aria-pressed={isWatched}
                aria-label={isWatched ? `Remove ${horse.name} from watchlist` : `Add ${horse.name} to watchlist`}
              >
                <Star size={16} fill={isWatched ? "currentColor" : "none"} />
                <span>{isWatched ? "Watching" : "Watch"}</span>
              </button>
            </div>
            <button type="button" className="tour-inline-link" onClick={onTour}>
              <CalendarDays size={15} /> Request a private virtual tour <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="detail-info-column">
          <p className="detail-intro">{horse.summary}</p>
          <div className="spec-grid">
            <Spec label="Age" value={`${horse.age} years`} />
            <Spec label="Sex" value={horse.sex} />
            <Spec label="Height" value={horse.height} />
            <Spec label="Colour" value={horse.color} />
            <Spec label="Pedigree" value={horse.pedigree} wide />
            <Spec label="Temperament" value={horse.temperament} wide />
            <Spec label="Location" value={horse.location} wide icon={<MapPin size={13} />} />
          </div>

          <section className="history-section" aria-labelledby="history-title">
            <div className="history-heading">
              <div>
                <p className="eyebrow mb-1">A transparent process</p>
                <h3 id="history-title" className="font-display text-2xl">Bid history</h3>
              </div>
              {horse.bidCount > 0 && <span className="history-total"><TrendingUp size={14} /> {horse.bidCount} offers</span>}
            </div>
            {chartData.length ? (
              <div className="detail-chart" aria-label={`Bid history chart for ${horse.name}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="#E9E2D7" strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="time" tick={{ fill: "#827D72", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis
                      width={44}
                      tickFormatter={compactMoney}
                      tick={{ fill: "#827D72", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      domain={["dataMin - 1000", "dataMax + 1000"]}
                    />
                    <Tooltip
                      formatter={(value) => [formatMoney(Number(value)), "Offer"]}
                      contentStyle={{ border: "1px solid #DED7CB", borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}
                      labelStyle={{ color: "#827D72", fontSize: 11 }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#1E3A2C" strokeWidth={2.25} dot={{ r: 3, fill: "#A97445", stroke: "#FCFAF6", strokeWidth: 2 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="history-empty"><span className="history-empty-mark"><TrendingUp size={17} /></span><span>The first bid will begin Atlas’s story. Opening price {formatMoney(horse.startingBid)}.</span></div>
            )}
            <div className="bid-table-wrap">
              <table className="bid-table">
                <thead><tr><th>Time</th><th>Bidder</th><th className="text-right">Offer</th></tr></thead>
                <tbody>
                  {horse.history.length ? [...horse.history].reverse().map((bid, index) => (
                    <tr key={`${bid.time}-${index}`}>
                      <td>{bid.time}{index === 0 && <span className="table-new">Latest</span>}</td>
                      <td>{bid.bidder}</td>
                      <td className="text-right font-medium text-ink">{formatMoney(bid.amount)}</td>
                    </tr>
                  )) : <tr><td colSpan={3} className="empty-table-cell">No bids yet · opening tomorrow</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
          <p className="detail-footnote">All horses are presented with verified identity and current veterinary records. Please contact our team for the full sale catalogue.</p>
        </div>
      </div>
    </ModalFrame>
  );
}

function Spec({ label, value, wide = false, icon }: { label: string; value: string; wide?: boolean; icon?: React.ReactNode }) {
  return (
    <div className={`spec-item ${wide ? "spec-wide" : ""}`}>
      <span className="micro-label">{label}</span>
      <span className="spec-value">{icon}{value}</span>
    </div>
  );
}

type BidModalProps = {
  horse: AuctionHorse;
  onClose: () => void;
  onSubmit: (amount: number) => void;
};

export function BidModal({ horse, onClose, onSubmit }: BidModalProps) {
  const minimum = horse.currentBid + 500;
  const [amount, setAmount] = useState(String(minimum));
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed < minimum) {
      setError(`Your offer must be at least ${formatMoney(minimum)}.`);
      return;
    }
    if (!Number.isInteger(parsed)) {
      setError("Please enter a whole dollar amount.");
      return;
    }
    setError("");
    onSubmit(parsed);
  };

  return (
    <ModalFrame title="Make an offer" eyebrow={`Lot ${horse.lot} · ${horse.name}`} onClose={onClose} className="form-modal" labelledBy="bid-modal-title">
      <form className="modal-form" onSubmit={submit} noValidate>
        <div className="bid-summary-panel">
          <div><span className="micro-label">Current bid</span><strong>{formatMoney(horse.currentBid)}</strong></div>
          <div className="bid-increment"><span className="micro-label">Minimum increment</span><strong>+$500</strong></div>
        </div>
        <label className="field-label" htmlFor="bid-amount">Your offer <span className="required-mark">*</span></label>
        <div className="amount-field-wrap">
          <span aria-hidden="true">$</span>
          <input
            autoFocus
            id="bid-amount"
            name="amount"
            type="number"
            min={minimum}
            step="1"
            inputMode="numeric"
            value={amount}
            onChange={(event) => { setAmount(event.target.value); setError(""); }}
            aria-describedby={error ? "bid-error" : "bid-hint"}
            aria-invalid={Boolean(error)}
            required
          />
        </div>
        <p id="bid-hint" className="field-hint">Enter {formatMoney(minimum)} or more. This is a simulated bid and no payment will be taken.</p>
        {error && <p className="field-error" id="bid-error" role="alert">{error}</p>}
        <button type="submit" className="button button-primary w-full mt-5"><Gavel size={15} /> Confirm offer</button>
        <p className="form-disclaimer">By continuing, you confirm that you have reviewed the lot details. This demo does not place a real bid.</p>
      </form>
    </ModalFrame>
  );
}

type TourModalProps = { horse: AuctionHorse; onClose: () => void; onSuccess: (name: string) => void };

export function TourModal({ horse, onClose, onSuccess }: TourModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setError("");
    setSubmitted(true);
    onSuccess(name.trim());
  };

  return (
    <ModalFrame title={submitted ? "We’ll be in touch" : "Meet them from anywhere"} eyebrow={`A private viewing · Lot ${horse.lot}`} onClose={onClose} className="form-modal" labelledBy="tour-modal-title">
      {submitted ? (
        <div className="confirmation-state">
          <span className="confirmation-icon"><Check size={23} /></span>
          <p className="confirmation-copy">Thank you, {name.split(" ")[0] || "there"}. Our equestrian team will contact you shortly to arrange a virtual tour of {horse.name}.</p>
          <div className="confirmation-detail"><CalendarDays size={16} /><span>Your preferred time has been noted with our team.</span></div>
          <button type="button" className="button button-primary w-full mt-6" onClick={onClose}>Done</button>
        </div>
      ) : (
        <form className="modal-form" onSubmit={submit}>
          <p className="form-intro">A quiet, one-to-one look at {horse.name}, hosted by the people who know them best. Tell us when suits you.</p>
          <div className="form-grid-two">
            <div className="field-group field-span-two">
              <label className="field-label" htmlFor="tour-name">Your name <span className="required-mark">*</span></label>
              <input autoFocus id="tour-name" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" />
            </div>
            <div className="field-group field-span-two">
              <label className="field-label" htmlFor="tour-email">Email address <span className="required-mark">*</span></label>
              <input id="tour-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="tour-date">Preferred date <span className="required-mark">*</span></label>
              <input id="tour-date" name="date" type="date" min={new Date().toISOString().slice(0, 10)} required />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="tour-time">Preferred time <span className="required-mark">*</span></label>
              <select id="tour-time" name="time" defaultValue="" required>
                <option value="" disabled>Select a time</option>
                <option>09:00 — 11:00</option>
                <option>11:00 — 13:00</option>
                <option>14:00 — 16:00</option>
                <option>16:00 — 18:00</option>
              </select>
            </div>
            <div className="field-group field-span-two">
              <label className="field-label" htmlFor="tour-notes">Anything you’d like us to know? <span className="optional-label">Optional</span></label>
              <textarea id="tour-notes" name="notes" rows={3} placeholder="Disciplines, questions, or anything else that would help us prepare." />
            </div>
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="submit" className="button button-primary w-full mt-5"><CalendarDays size={15} /> Request virtual tour</button>
          <p className="form-disclaimer">Your details stay with our sales team and are never shared.</p>
        </form>
      )}
    </ModalFrame>
  );
}

type AuthModalProps = { initialTab: "login" | "register"; onClose: () => void };

export function AuthModal({ initialTab, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [complete, setComplete] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setComplete(true);
  };

  return (
    <ModalFrame title={complete ? "You’re all set" : tab === "login" ? "Welcome back" : "Join the collection"} eyebrow="AURELIA EQUINE · PRIVATE ACCESS" onClose={onClose} className="form-modal auth-modal" labelledBy="auth-modal-title">
      {complete ? (
        <div className="confirmation-state">
          <span className="confirmation-icon"><Check size={23} /></span>
          <p className="confirmation-copy">{tab === "login" ? "You’re signed in for this preview." : "Your preview profile is ready."} Your account is simulated here; no personal details have been sent or stored.</p>
          <button type="button" className="button button-primary w-full mt-6" onClick={onClose}>Continue exploring</button>
        </div>
      ) : (
        <>
          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={tab === "login"} aria-controls="auth-form-panel" id="auth-tab-login" className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Log in</button>
            <button type="button" role="tab" aria-selected={tab === "register"} aria-controls="auth-form-panel" id="auth-tab-register" className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>Register</button>
          </div>
          <form id="auth-form-panel" role="tabpanel" aria-labelledby={`auth-tab-${tab}`} className="modal-form" onSubmit={submit}>
            {tab === "register" && <div className="field-group"><label className="field-label" htmlFor="auth-name">Full name <span className="required-mark">*</span></label><input autoFocus id="auth-name" name="name" autoComplete="name" required placeholder="Full name" /></div>}
            <div className="field-group">
              <label className="field-label" htmlFor="auth-email">Email address <span className="required-mark">*</span></label>
              <input autoFocus={tab === "login"} id="auth-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </div>
            <div className="field-group mt-4">
              <label className="field-label" htmlFor="auth-password">Password <span className="required-mark">*</span></label>
              <input id="auth-password" name="password" type="password" autoComplete={tab === "login" ? "current-password" : "new-password"} minLength={8} required placeholder={tab === "login" ? "Your password" : "At least 8 characters"} />
            </div>
            {tab === "register" && <label className="check-row mt-4"><input type="checkbox" required /><span>I agree to receive auction updates and accept the preview terms.</span></label>}
            {tab === "login" && <p className="field-hint mt-3">New to Aurelia? Choose Register to create a simulated preview profile.</p>}
            <button type="submit" className="button button-primary w-full mt-5">{tab === "login" ? "Log in" : "Create preview account"}</button>
            <p className="form-disclaimer">Demo only. No account is created and your information is not transmitted.</p>
          </form>
        </>
      )}
    </ModalFrame>
  );
}

export function SoldResultModal({ horse, onClose }: { horse: SoldHorse; onClose: () => void }) {
  return (
    <ModalFrame title={`${horse.name} found home`} eyebrow={`Sale result · Lot ${horse.lot}`} onClose={onClose} className="form-modal sold-result-modal" labelledBy="sold-result-title">
      <img className="sold-result-photo" src={horse.image} alt={horse.imageAlt} />
      <div className="sold-result-heading">
        <span className="sold-badge">SOLD</span>
        <span className="micro-label">{horse.soldDate}</span>
      </div>
      <p className="sold-result-breed">{horse.age}yo {horse.breed}</p>
      <p className="sold-result-note">{horse.note}</p>
      <div className="sold-result-total"><span className="micro-label">Successful bid</span><strong>{formatMoney(horse.price)}</strong></div>
      <p className="form-disclaimer mt-4">Every Aurelia sale is handled with care, clear communication, and a thoughtful handover.</p>
      <button type="button" className="button button-primary w-full mt-5" onClick={onClose}>Close result</button>
    </ModalFrame>
  );
}

export function buildBidRecord(amount: number, bidder = "You · Preview"): BidRecord {
  return {
    time: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    amount,
    bidder,
  };
}
