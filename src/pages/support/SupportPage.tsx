import { useNavigate } from "react-router-dom";
import { Card } from "../../components";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

const FAQ = [
  {
    q: "How do I place a bet?",
    a: "Go to the Bet tab, pick two numbers (1–37), choose a draw schedule, enter your amount, and confirm.",
  },
  {
    q: "How long does withdrawal take?",
    a: "Withdrawals are processed within 24 hours on business days via your registered payment method.",
  },
  {
    q: "What is KYC verification?",
    a: "KYC (Know Your Customer) is an identity check required before withdrawing funds. Upload a valid government ID to get verified.",
  },
  {
    q: "How are winnings calculated?",
    a: "Winning multiplier depends on the game type. Standard Jueteng pays based on the configured payout ratio set per draw.",
  },
  {
    q: "What if my deposit didn't reflect?",
    a: "Wait 15 minutes and refresh. If still missing, contact support with your transaction reference number.",
  },
];

const contacts = [
  { Icon: MessageCircle, label: "Live Chat", sub: "Available 8 AM – 10 PM", action: "#chat" },
  { Icon: Phone, label: "Hotline", sub: "+63 900 000 0000", action: "tel:+639000000000" },
  { Icon: Mail, label: "Email", sub: "support@ejg.com", action: "mailto:support@ejg.com" },
];

export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-surface-card border border-brand-gold/10 hover:border-brand-gold/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-text-muted" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Help & Support</h1>
          <p className="text-xs text-text-muted">FAQ & contact options</p>
        </div>
      </div>

      {/* Contact channels */}
      <div className="space-y-1.5">
        {contacts.map(({ Icon, label, sub, action }) => (
          <a key={label} href={action}>
            <Card bento className="flex items-center gap-3 lantern-card hover:border-brand-gold/20 transition-all">
              <Icon className="w-5 h-5 text-brand-gold/70" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{label}</p>
                <p className="text-xs text-text-muted">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-gold/40" />
            </Card>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <HelpCircle className="w-4 h-4 text-brand-gold" />
          <h2 className="text-sm font-bold text-text-primary">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {FAQ.map(({ q, a }) => (
            <Card key={q} bento className="lantern-card">
              <p className="text-sm font-semibold text-text-primary mb-1">{q}</p>
              <p className="text-xs text-text-muted leading-relaxed">{a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
