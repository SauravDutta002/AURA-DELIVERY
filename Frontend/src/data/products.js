// ═══════════════════════════════════════════════════════════════
//  AURA MED-SAR — Emergency Medical Aid & Rescue Payload Catalog
//  Autonomous drone payload packs for search & rescue dispatch
// ═══════════════════════════════════════════════════════════════
import {
  TbFirstAidKit, TbHeartRateMonitor, TbBottle, TbLollipop, TbMedicalCross,
} from "react-icons/tb"
import {
  MdLocalPharmacy, MdSanitizer, MdMasks, MdHealthAndSafety, MdEmergency, MdBloodtype,
} from "react-icons/md"
import {
  BsCapsule, BsShieldCheck, BsThermometerSun,
} from "react-icons/bs"
import {
  FiHeart, FiZap, FiPackage, FiShield, FiAlertTriangle,
} from "react-icons/fi"
import {
  FaBriefcaseMedical, FaHeartbeat, FaBandAid, FaTemperatureHigh, FaFireExtinguisher,
} from "react-icons/fa"
import {
  GiMedicalDrip, GiGasMask, GiPill, GiDefibrilate,
} from "react-icons/gi"

export const categories = [
  { id: "all",           name: "All Payloads",       Icon: FaBriefcaseMedical },
  { id: "trauma",        name: "Trauma & AED",       Icon: GiDefibrilate },
  { id: "resuscitation", name: "Resuscitation",      Icon: FaHeartbeat },
  { id: "hypothermia",   name: "Hypothermia Shield", Icon: BsThermometerSun },
  { id: "respiratory",   name: "Respiratory & Burn", Icon: GiGasMask },
  { id: "survival",      name: "Survival & Beacon",  Icon: FiShield },
]

export const products = [
  // ── Trauma & AED ─────────────────────────────────────
  { id: 1, name: "Automated External Defibrillator (AED)", price: 0, weight: "1.2kg", category: "trauma", Icon: GiDefibrilate, color: "text-red-600", bg: "bg-red-50", tag: "Critical" },
  { id: 2, name: "Combat Hemostatic Tourniquet Pack",      price: 0, weight: "240g",  category: "trauma", Icon: TbFirstAidKit, color: "text-rose-600", bg: "bg-rose-50", tag: "Bleeding Control" },
  { id: 3, name: "Trauma Dressing & QuikClot Gauze",        price: 0, weight: "180g",  category: "trauma", Icon: FaBandAid, color: "text-red-500", bg: "bg-red-50", tag: "Essential" },
  { id: 4, name: "Chest Seal & Decompression Kit",          price: 0, weight: "120g",  category: "trauma", Icon: MdEmergency, color: "text-amber-600", bg: "bg-amber-50", tag: "Pneumothorax" },

  // ── Resuscitation ────────────────────────────────────
  { id: 5, name: "Epinephrine Auto-Injector (EpiPen 2x)",   price: 0, weight: "150g",  category: "resuscitation", Icon: BsCapsule, color: "text-emerald-600", bg: "bg-emerald-50", tag: "Anaphylaxis" },
  { id: 6, name: "Oral Electrolyte & Glucose Resuscitation", price: 0, weight: "350g",  category: "resuscitation", Icon: GiMedicalDrip, color: "text-cyan-600", bg: "bg-cyan-50", tag: "Dehydration" },
  { id: 7, name: "Broad-Spectrum Emergency Antivenom",      price: 0, weight: "200g",  category: "resuscitation", Icon: MdBloodtype, color: "text-purple-600", bg: "bg-purple-50", tag: "Bite Neutralizer" },
  { id: 8, name: "Rapid Narcotic Reversal (Naloxone)",      price: 0, weight: "90g",   category: "resuscitation", Icon: BsCapsule, color: "text-blue-600", bg: "bg-blue-50", tag: "Overdose Rescue" },

  // ── Hypothermia Shield ───────────────────────────────
  { id: 9,  name: "Mylar Thermal Space Blanket",            price: 0, weight: "110g",  category: "hypothermia", Icon: BsThermometerSun, color: "text-amber-500", bg: "bg-amber-50", tag: "Heat Retention" },
  { id: 10, name: "Self-Heating Hypothermia Body Wrap",     price: 0, weight: "420g",  category: "hypothermia", Icon: FaTemperatureHigh, color: "text-orange-600", bg: "bg-orange-50", tag: "Active Heat" },
  { id: 11, name: "Insulated Survivor Bivy Bag",            price: 0, weight: "260g",  category: "hypothermia", Icon: FiShield, color: "text-yellow-600", bg: "bg-yellow-50", tag: "Weatherproof" },

  // ── Respiratory & Burn ───────────────────────────────
  { id: 12, name: "Compressed Emergency Oxygen Canister",   price: 0, weight: "680g",  category: "respiratory", Icon: GiGasMask, color: "text-sky-600", bg: "bg-sky-50", tag: "Pure O2" },
  { id: 13, name: "WaterJel Sterile Burn Dressing Kit",     price: 0, weight: "300g",  category: "respiratory", Icon: TbMedicalCross, color: "text-teal-600", bg: "bg-teal-50", tag: "Cooling Gel" },
  { id: 14, name: "High-Efficiency Smoke & Particulate Mask",price: 0, weight: "75g",  category: "respiratory", Icon: MdMasks, color: "text-slate-600", bg: "bg-slate-50", tag: "N95 / Toxic" },

  // ── Survival & Beacon ────────────────────────────────
  { id: 15, name: "Emergency GPS Rescue Transponder Beacon", price: 0, weight: "140g",  category: "survival", Icon: FiZap, color: "text-red-600", bg: "bg-red-50", tag: "SOS 406MHz" },
  { id: 16, name: "Purified Water Pouches & High-Calorie Bar",price: 0, weight: "500g", category: "survival", Icon: TbBottle, color: "text-blue-500", bg: "bg-blue-50", tag: "Survival Diet" },
]

