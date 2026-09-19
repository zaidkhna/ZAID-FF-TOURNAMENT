export const SITE_NAME = "ZAID FF TOURNAMENT";
export const WHATSAPP_DISPLAY = "0339 0068468";
export const WHATSAPP_NUMBER = "923390068468"; // for wa.me link (03390068468)
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Assalam-o-Alaikum! Mujhe ZAID FF TOURNAMENT me slot chahiye. Details bhej dein."
)}`;

export const PAYMENT_NUMBER_DISPLAY = "0330 2475360";
export const PAYMENT_NUMBER_RAW = "03302475360";
export const PAYMENT_ACCOUNT_TITLE = "Zaid";

export const PAYMENT_METHODS = [
  {
    id: "easypaisa",
    name: "Easypaisa",
    number: PAYMENT_NUMBER_RAW,
    display: PAYMENT_NUMBER_DISPLAY,
    title: PAYMENT_ACCOUNT_TITLE,
    color: "#4ade80",
    bg: "linear-gradient(135deg,#052e16,#16a34a)",
    icon: "💚",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    number: PAYMENT_NUMBER_RAW,
    display: PAYMENT_NUMBER_DISPLAY,
    title: PAYMENT_ACCOUNT_TITLE,
    color: "#f87171",
    bg: "linear-gradient(135deg,#450a0a,#dc2626)",
    icon: "❤️",
  },
  {
    id: "sadapay",
    name: "Sadapay",
    number: PAYMENT_NUMBER_RAW,
    display: PAYMENT_NUMBER_DISPLAY,
    title: PAYMENT_ACCOUNT_TITLE,
    color: "#facc15",
    bg: "linear-gradient(135deg,#422006,#eab308)",
    icon: "💛",
  },
] as const;

export function whatsappJoinLink(teamName: string, tournamentTitle: string, trxId: string) {
  const msg = `Assalam-o-Alaikum! Maine ZAID FF TOURNAMENT me slot book ki hai.\n\n🏆 Tournament: ${tournamentTitle}\n👥 Team: ${teamName}\n💳 TrxID: ${trxId}\n\nPayment screenshot attach kar raha hoon. Slot confirm kar dein.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
