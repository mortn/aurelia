"use client";

import {
  ArrowUpRight,
  Clock3,
  Gavel,
  MapPin,
  Star,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { formatMoney, type AuctionHorse, type AuctionStatus, type SoldHorse } from "@/lib/auction-data";

export function AuctionCard({
  horse,
  secondsRemaining,
  phase,
  isWatched,
  onOpen,
  onWatch,
  onBid,
}: {
  horse: AuctionHorse;
  secondsRemaining: number;
  phase: AuctionStatus;
  isWatched: boolean;
  onOpen: () => void;
  onWatch: () => void;
  onBid: () => void;
}) {
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const openingNow = horse.status === "upcoming" && secondsRemaining <= 0;
  const timeCopy = phase === "ended"
    ? "Auction ended"
    : openingNow
      ? "Auction now open"
      : phase === "upcoming"
        ? `Opens tomorrow · ${hours}h ${minutes}m`
        : `${hours}h ${minutes}m ${seconds.toString().padStart(2, "0")}s`;

  const clickCard = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button, a")) return;
    onOpen();
  };

  return (
    <article
      className="auction-card group"
      tabIndex={0}
      role="group"
      aria-label={`Lot ${horse.lot}, ${horse.name}, ${horse.breed}. ${phase === "live" ? "Live auction." : phase === "ended" ? "Auction ended." : "Upcoming auction."}`}
      onClick={clickCard}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="auction-photo-wrap">
        <img src={horse.image} alt={horse.imageAlt} className="auction-photo" loading="lazy" />
        <div className="photo-shade" />
        <span className={`status-chip ${phase === "live" ? "status-live" : phase === "ended" ? "status-ended" : "status-upcoming"}`}>
          {phase === "live" ? <span className="status-dot" /> : phase === "ended" ? <Clock3 size={11} /> : <Clock3 size={11} />}
          {phase === "live" ? "Live" : phase === "ended" ? "Ended" : "Coming soon"}
        </span>
        <span className="photo-lot">LOT {horse.lot}</span>
        <button
          type="button"
          className={`photo-watch ${isWatched ? "is-watched" : ""}`}
          onClick={onWatch}
          aria-label={isWatched ? `Remove ${horse.name} from watchlist` : `Add ${horse.name} to watchlist`}
          aria-pressed={isWatched}
          title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Star size={16} fill={isWatched ? "currentColor" : "none"} />
        </button>
        <button type="button" className="photo-open-hitarea" onClick={onOpen} aria-label={`View ${horse.name}, lot ${horse.lot}`} />
      </div>
      <div className="auction-card-content">
        <div className="horse-title-row">
          <div>
            <p className="horse-lot-label">AURELIA · LOT {horse.lot}</p>
            <button type="button" className="horse-name-button" onClick={onOpen}>{horse.name}<span className="horse-name-period">.</span></button>
          </div>
          <span className="horse-age">{horse.age} yrs</span>
        </div>
        <p className="horse-type">{horse.age}yo {horse.breed} {horse.sex.toLowerCase()}</p>
        <div className="horse-location"><MapPin size={12} /> {horse.location}</div>

        <div className="auction-price-row">
          <div>
            <span className="micro-label">{horse.bidCount ? "Current bid" : "Starting bid"}</span>
            <strong className="auction-price">{formatMoney(horse.currentBid)}</strong>
          </div>
          <span className="bid-count"><Gavel size={14} /> {horse.bidCount} {horse.bidCount === 1 ? "bid" : "bids"}</span>
        </div>

        <div className="sparkline-row" aria-label={horse.bidCount ? "Recent bid trend" : "No bids yet"}>
          <div className="sparkline-wrap">
            {horse.history.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={horse.history}>
                  <Line type="monotone" dataKey="amount" stroke="#A97445" strokeWidth={2} dot={false} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <svg viewBox="0 0 120 30" className="sparkline-empty" aria-hidden="true"><path d="M1 22 H119" /></svg>
            )}
          </div>
          <span>{horse.bidCount ? "Bid activity" : "No bids yet"}</span>
        </div>

        <div className={`countdown-row ${phase === "ended" ? "countdown-ended" : ""}`}>
          <Clock3 size={14} />
          <span>{openingNow ? "Status" : phase === "live" ? "Ends in" : phase === "upcoming" ? "Opening" : "Status"}</span>
          <strong aria-live="off">{timeCopy}</strong>
        </div>
        <div className="auction-card-footer">
          <button type="button" className="button button-primary place-bid-button" onClick={onBid} disabled={phase !== "live"} title={phase === "upcoming" ? "Bidding opens tomorrow" : phase === "ended" ? "This auction has ended" : undefined}>
            <Gavel size={14} /> Place bid
          </button>
          <button type="button" className={`text-watch-button ${isWatched ? "is-watched" : ""}`} onClick={onWatch} aria-pressed={isWatched}>
            <Star size={14} fill={isWatched ? "currentColor" : "none"} /> {isWatched ? "Watching" : "Watch lot"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function SoldHorseCard({ horse, onResult }: { horse: SoldHorse; onResult: () => void }) {
  return (
    <article className="sold-card">
      <button type="button" className="sold-image-button" onClick={onResult} aria-label={`View sale result for ${horse.name}`}>
        <img src={horse.image} alt={horse.imageAlt} className="sold-photo" loading="lazy" />
        <span className="sold-badge">SOLD</span>
      </button>
      <div className="sold-content">
        <div className="sold-topline"><span className="horse-lot-label">LOT {horse.lot}</span><span className="sold-date">{horse.soldDate}</span></div>
        <button type="button" className="sold-name-button" onClick={onResult}>{horse.name}<ArrowUpRight size={14} /></button>
        <p className="sold-breed">{horse.age}yo {horse.breed}</p>
        <div className="sold-result-row">
          <div><span className="micro-label">Final price</span><strong>{formatMoney(horse.price)}</strong></div>
          <button type="button" className="result-link" onClick={onResult}>View result <ArrowUpRight size={13} /></button>
        </div>
        <p className="sold-note">{horse.note}</p>
      </div>
    </article>
  );
}
