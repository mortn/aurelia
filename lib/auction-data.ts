export type AuctionStatus = "live" | "upcoming" | "ended";

export type BidRecord = {
  time: string;
  amount: number;
  bidder: string;
};

export type AuctionHorse = {
  id: string;
  lot: string;
  name: string;
  breed: string;
  age: number;
  sex: string;
  height: string;
  color: string;
  location: string;
  status: "live" | "upcoming";
  currentBid: number;
  startingBid: number;
  bidCount: number;
  secondsRemaining: number;
  opensTomorrow?: boolean;
  image: string;
  imageAlt: string;
  summary: string;
  pedigree: string;
  temperament: string;
  history: BidRecord[];
};

export type SoldHorse = {
  id: string;
  lot: string;
  name: string;
  breed: string;
  age: number;
  price: number;
  soldDate: string;
  image: string;
  imageAlt: string;
  note: string;
};

const horsePhoto = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86`;

export const initialAuctions: AuctionHorse[] = [
  {
    id: "thunder",
    lot: "014",
    name: "Thunder",
    breed: "Warmblood",
    age: 9,
    sex: "Gelding",
    height: "17.1 hh",
    color: "Dark bay",
    location: "Gloucestershire, UK",
    status: "live",
    currentBid: 12000,
    startingBid: 8000,
    bidCount: 18,
    secondsRemaining: 2 * 60 * 60 + 14 * 60,
    image: horsePhoto("photo-1553284965-83fd3e82fa5a"),
    imageAlt: "A strong dark bay horse standing in a sunlit paddock",
    summary: "A beautifully balanced gelding with a generous stride and a level-headed nature. Proven at 1.30m with an amateur-friendly temperament.",
    pedigree: "Totilas × Belissa (by Balou du Rouet)",
    temperament: "Kind, forward-thinking, and confident away from home.",
    history: [
      { time: "10:18", amount: 8000, bidder: "Oak & Ash" },
      { time: "10:42", amount: 9000, bidder: "Fieldstone" },
      { time: "11:06", amount: 10000, bidder: "Oak & Ash" },
      { time: "11:51", amount: 11000, bidder: "Northfield" },
      { time: "12:24", amount: 12000, bidder: "Fieldstone" },
    ],
  },
  {
    id: "belle",
    lot: "015",
    name: "Belle",
    breed: "Thoroughbred",
    age: 7,
    sex: "Mare",
    height: "16.2 hh",
    color: "Chestnut",
    location: "Newmarket, UK",
    status: "live",
    currentBid: 8000,
    startingBid: 5000,
    bidCount: 11,
    secondsRemaining: 5 * 60 * 60 + 40 * 60,
    image: horsePhoto("photo-1598974357801-cbca100e65d3"),
    imageAlt: "A chestnut mare in a quiet country field",
    summary: "A refined, athletic mare with three balanced paces. Belle has a warm character, a careful jump, and a wonderful work ethic.",
    pedigree: "Sea The Stars × Rosewood (by Galileo)",
    temperament: "Sensitive in the best way; responsive, gentle, and people-oriented.",
    history: [
      { time: "09:32", amount: 5000, bidder: "Redgate" },
      { time: "10:15", amount: 6000, bidder: "Ashcombe" },
      { time: "10:47", amount: 6500, bidder: "Redgate" },
      { time: "11:26", amount: 7500, bidder: "Ashcombe" },
      { time: "12:02", amount: 8000, bidder: "Juniper Farm" },
    ],
  },
  {
    id: "atlas",
    lot: "016",
    name: "Atlas",
    breed: "Dutch Warmblood",
    age: 6,
    sex: "Stallion",
    height: "17.0 hh",
    color: "Black",
    location: "Somerset, UK",
    status: "upcoming",
    currentBid: 16500,
    startingBid: 16500,
    bidCount: 0,
    secondsRemaining: 24 * 60 * 60 + 20 * 60,
    opensTomorrow: true,
    image: horsePhoto("photo-1566251037378-5e04e3bec343"),
    imageAlt: "A glossy black stallion in a green field",
    summary: "A striking young stallion with exceptional presence and a wonderfully modern frame. A rare opportunity from an established performance family.",
    pedigree: "Ampère × Luna (by Johnson)",
    temperament: "Curious, composed, and easy to handle for his age.",
    history: [],
  },
];

export const recentlySold: SoldHorse[] = [
  {
    id: "spirit",
    lot: "009",
    name: "Spirit",
    breed: "Irish Sport Horse",
    age: 8,
    price: 25000,
    soldDate: "Sold 18 June",
    image: horsePhoto("photo-1504593811423-6dd665756598", 700),
    imageAlt: "A bay sport horse moving across an open field",
    note: "A confident partner, bound for a new home in Devon.",
  },
  {
    id: "daisy",
    lot: "011",
    name: "Daisy",
    breed: "Connemara",
    age: 10,
    price: 14000,
    soldDate: "Sold 12 June",
    image: horsePhoto("photo-1598974357801-cbca100e65d3", 700),
    imageAlt: "A light grey horse grazing in a meadow",
    note: "A much-loved all-rounder, now with her next young rider.",
  },
];

export const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
