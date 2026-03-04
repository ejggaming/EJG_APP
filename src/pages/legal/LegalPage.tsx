import { useNavigate } from "react-router-dom";
import { Card } from "../../components";
import { ArrowLeft, FileText, Scale, ShieldCheck } from "lucide-react";

const sections = [
  {
    Icon: Scale,
    title: "Terms & Conditions",
    content: `By using EJG Betting, you agree to the following terms. You must be 18 years of age or older to register and place bets. All bets are final once confirmed. EJG reserves the right to void bets in cases of system errors or fraudulent activity. Winnings are subject to applicable taxes under Philippine law.`,
  },
  {
    Icon: ShieldCheck,
    title: "Privacy Policy",
    content: `We collect personal information necessary for account creation, KYC verification, and regulatory compliance. Your data is stored securely and is never sold to third parties. We may share data with government regulators (PAGCOR/PCSO) as required by law. You may request data deletion by contacting support.`,
  },
  {
    Icon: FileText,
    title: "Responsible Gaming",
    content: `EJG promotes responsible gambling. Set personal limits on your bets and deposits. If you feel gambling is affecting your well-being, use the self-exclusion feature or contact our support team. Help is available 24/7 at support@ejg.com. National Problem Gambling Helpline: 1800-000-0000.`,
  },
];

export default function LegalPage() {
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
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Legal</h1>
          <p className="text-xs text-text-muted">Terms, privacy & responsible gaming</p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map(({ Icon, title, content }) => (
          <Card key={title} bento className="lantern-card">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-brand-gold" />
              <h2 className="text-sm font-bold text-text-primary">{title}</h2>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{content}</p>
          </Card>
        ))}
      </div>

      <p className="text-center text-[10px] text-text-muted">
        Last updated: March 2026 · EJG Betting is licensed under PAGCOR
      </p>
    </div>
  );
}
