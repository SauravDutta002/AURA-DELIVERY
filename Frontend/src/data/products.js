// ═══════════════════════════════════════════════════════════════
//  AURA Delivery — Simulation Product Catalog
//  Hardcoded mock data for the drone delivery demo
// ═══════════════════════════════════════════════════════════════
import {
  GiAvocado, GiChickenLeg, GiSlicedBread, GiRiceCooker, GiMedicines, GiCandleLight, GiNotebook, GiBananaPeeled,
} from "react-icons/gi"
import {
  FaEgg, FaPizzaSlice, FaHamburger, FaCoffee, FaBatteryFull, FaHeadphonesAlt,
} from "react-icons/fa"
import {
  MdLocalPharmacy, MdSanitizer, MdPhoneIphone, MdCable, MdMasks, MdFastfood,
} from "react-icons/md"
import {
  TbSalad, TbFirstAidKit, TbBottle, TbCake, TbToolsKitchen2, TbPaperBag,
} from "react-icons/tb"
import {
  BsBox, BsShop, BsCapsule,
} from "react-icons/bs"
import {
  FiShoppingBag, FiZap, FiHeart, FiPackage,
} from "react-icons/fi"
import {
  LuMilk,
} from "react-icons/lu"
import {
  RiDrinks2Line,
} from "react-icons/ri"
import {
  IoFishOutline,
} from "react-icons/io5"
import {
  PiOrangeSliceFill, PiNewspaperClipping,
} from "react-icons/pi"

export const categories = [
  { id: "all",         name: "All",         Icon: BsShop },
  { id: "grocery",     name: "Grocery",     Icon: FiShoppingBag },
  { id: "food",        name: "Food",        Icon: MdFastfood },
  { id: "pharmacy",    name: "Pharmacy",    Icon: MdLocalPharmacy },
  { id: "electronics", name: "Electronics", Icon: MdPhoneIphone },
  { id: "essentials",  name: "Essentials",  Icon: FiPackage },
]

export const products = [
  // ── Grocery ─────────────────────────────────────────
  { id: 1,  name: "Fresh Avocados",    price: 149, weight: "500g",    category: "grocery",     Icon: GiAvocado,       color: "text-green-600",  bg: "bg-green-50",  tag: "Organic" },
  { id: 2,  name: "Farm Eggs",         price: 89,  weight: "12 pcs",  category: "grocery",     Icon: FaEgg,           color: "text-amber-500",  bg: "bg-amber-50",  tag: "Farm Fresh" },
  { id: 3,  name: "Whole Wheat Bread", price: 45,  weight: "400g",    category: "grocery",     Icon: GiSlicedBread,   color: "text-amber-600",  bg: "bg-amber-50",  tag: null },
  { id: 4,  name: "Organic Milk",      price: 68,  weight: "1L",      category: "grocery",     Icon: LuMilk,          color: "text-blue-500",   bg: "bg-blue-50",   tag: "Organic" },
  { id: 5,  name: "Basmati Rice",      price: 199, weight: "1kg",     category: "grocery",     Icon: GiRiceCooker,    color: "text-yellow-600", bg: "bg-yellow-50", tag: "Premium" },
  { id: 6,  name: "Fresh Bananas",     price: 49,  weight: "6 pcs",   category: "grocery",     Icon: GiBananaPeeled,  color: "text-yellow-500", bg: "bg-yellow-50", tag: null },

  // ── Food ────────────────────────────────────────────
  { id: 7,  name: "Margherita Pizza",  price: 249, weight: "Medium",  category: "food",        Icon: FaPizzaSlice,    color: "text-orange-500", bg: "bg-orange-50", tag: "Bestseller" },
  { id: 8,  name: "Chicken Burger",    price: 179, weight: "220g",    category: "food",        Icon: FaHamburger,     color: "text-amber-600",  bg: "bg-amber-50",  tag: "Hot" },
  { id: 9,  name: "Sushi Platter",     price: 599, weight: "12 pcs",  category: "food",        Icon: IoFishOutline,   color: "text-rose-500",   bg: "bg-rose-50",   tag: "Premium" },
  { id: 10, name: "Caesar Salad",      price: 199, weight: "350g",    category: "food",        Icon: TbSalad,         color: "text-green-500",  bg: "bg-green-50",  tag: "Healthy" },
  { id: 11, name: "Chocolate Cake",    price: 349, weight: "500g",    category: "food",        Icon: TbCake,          color: "text-pink-500",   bg: "bg-pink-50",   tag: null },
  { id: 12, name: "Iced Coffee",       price: 129, weight: "300ml",   category: "food",        Icon: FaCoffee,        color: "text-amber-700",  bg: "bg-amber-50",  tag: "Popular" },

  // ── Pharmacy ────────────────────────────────────────
  { id: 13, name: "Paracetamol",       price: 35,  weight: "10 tabs", category: "pharmacy",    Icon: BsCapsule,       color: "text-red-500",    bg: "bg-red-50",    tag: "Essential" },
  { id: 14, name: "Vitamin C",         price: 199, weight: "60 tabs", category: "pharmacy",    Icon: PiOrangeSliceFill, color: "text-orange-500", bg: "bg-orange-50", tag: null },
  { id: 15, name: "First Aid Kit",     price: 299, weight: "Mini",    category: "pharmacy",    Icon: TbFirstAidKit,   color: "text-red-600",    bg: "bg-red-50",    tag: "Must Have" },
  { id: 16, name: "Hand Sanitizer",    price: 79,  weight: "200ml",   category: "pharmacy",    Icon: MdSanitizer,     color: "text-teal-500",   bg: "bg-teal-50",   tag: null },

  // ── Electronics ─────────────────────────────────────
  { id: 17, name: "USB-C Cable",       price: 299, weight: "1m",      category: "electronics", Icon: MdCable,         color: "text-slate-600",  bg: "bg-slate-50",  tag: null },
  { id: 18, name: "Wireless Earbuds",  price: 1499, weight: "45g",    category: "electronics", Icon: FaHeadphonesAlt, color: "text-indigo-500", bg: "bg-indigo-50", tag: "Trending" },
  { id: 19, name: "Power Bank",        price: 899, weight: "200g",    category: "electronics", Icon: FaBatteryFull,   color: "text-emerald-500",bg: "bg-emerald-50",tag: "Fast Charge" },
  { id: 20, name: "Phone Stand",       price: 249, weight: "120g",    category: "electronics", Icon: MdPhoneIphone,   color: "text-violet-500", bg: "bg-violet-50", tag: null },

  // ── Essentials ──────────────────────────────────────
  { id: 21, name: "Face Mask Pack",    price: 149, weight: "50 pcs",  category: "essentials",  Icon: MdMasks,         color: "text-sky-500",    bg: "bg-sky-50",    tag: null },
  { id: 22, name: "Tissue Box",        price: 99,  weight: "200 pcs", category: "essentials",  Icon: BsBox,           color: "text-slate-400",  bg: "bg-slate-50",  tag: null },
  { id: 23, name: "Scented Candle",    price: 349, weight: "150g",    category: "essentials",  Icon: GiCandleLight,   color: "text-amber-500",  bg: "bg-amber-50",  tag: "Aromatic" },
  { id: 24, name: "Notebook",          price: 79,  weight: "A5",      category: "essentials",  Icon: PiNewspaperClipping, color: "text-blue-500", bg: "bg-blue-50", tag: null },
]
