import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  ArrowUp,
  ArrowDown,
  Share2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const platformTabs = [
  { name: "X", color: "border-platform-x", bg: "bg-platform-x/10" },
  { name: "Reddit", color: "border-platform-reddit", bg: "bg-platform-reddit/10" },
  { name: "Telegram", color: "border-platform-telegram", bg: "bg-platform-telegram/10" },
  { name: "Website", color: "border-platform-website", bg: "bg-platform-website/10" },
];

function XPreview() {
  return (
    <div className="card-elevated rounded-2xl p-4 max-w-[520px] mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-accent-violet/20 flex items-center justify-center">
          <span className="text-body font-bold text-accent-violet">A</span>
        </div>
        <div>
          <span className="text-sub font-bold text-foreground">Ash</span>
          <span className="text-body text-muted-foreground ml-2">@ashtv</span>
        </div>
      </div>
      <p className="text-sub text-foreground font-satoshi mb-3">
        New episode dropping tonight. You're not ready for this one. The grind never stops 🔥
      </p>
      <div className="aspect-video rounded-xl bg-black/50 atmospheric-glow mb-3" />
      <div className="flex items-center justify-between text-muted-foreground pt-2 border-t border-border/40">
        <MessageCircle className="h-4 w-4" />
        <Repeat2 className="h-4 w-4" />
        <Heart className="h-4 w-4" />
        <Bookmark className="h-4 w-4" />
      </div>
    </div>
  );
}

function RedditPreview() {
  return (
    <div className="card-elevated rounded-2xl p-4 max-w-[520px] mx-auto">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <ArrowUp className="h-5 w-5 text-platform-reddit" />
          <span className="text-body font-bold text-platform-reddit">1</span>
          <ArrowDown className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <span className="text-micro text-muted-foreground font-mono">r/ashtv · Posted by u/ash</span>
          <h3 className="text-sub font-bold text-foreground mt-1">
            Episode 47 behind the scenes — the craziest shoot we've done
          </h3>
          <div className="aspect-video rounded-lg bg-black/50 atmospheric-glow mt-3" />
          <div className="flex items-center gap-4 mt-3 text-muted-foreground text-micro">
            <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 0 Comments</span>
            <span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelegramPreview() {
  return (
    <div className="max-w-[420px] mx-auto">
      <div className="rounded-2xl p-4" style={{ background: "#212D3B" }}>
        <div className="aspect-video rounded-xl bg-black/30 atmospheric-glow mb-2" />
        <p className="text-[14px] text-foreground font-satoshi">
          Exclusive preview for the VIP crew. Full episode drops at midnight. You're first in line 🎬
        </p>
        <span className="text-micro text-muted-foreground font-mono float-right mt-1">10:00 AM</span>
      </div>
    </div>
  );
}

function WebsitePreview() {
  return (
    <div className="card-surface rounded-2xl overflow-hidden max-w-[520px] mx-auto">
      <div className="aspect-video bg-black/50 atmospheric-glow" />
      <div className="p-5">
        <p className="text-sub text-foreground font-satoshi">
          Episode 47 is now live. This one pushes every boundary we've set. Watch the full episode on the site.
        </p>
        <div className="mt-3 flex items-center gap-2 text-micro text-muted-foreground font-mono">
          <span>Mar 29, 2026</span>
          <span>·</span>
          <span className="rounded-md bg-elevated px-2 py-0.5">Episode</span>
        </div>
      </div>
    </div>
  );
}

const previews: Record<string, React.FC> = {
  X: XPreview,
  Reddit: RedditPreview,
  Telegram: TelegramPreview,
  Website: WebsitePreview,
};

export default function PreviewView() {
  const navigate = useNavigate();
  const [activePlatform, setActivePlatform] = useState("X");
  const [currentAsset, setCurrentAsset] = useState(3);
  const [approved, setApproved] = useState(false);
  const totalAssets = 12;

  const PreviewComponent = previews[activePlatform];

  return (
    <div className="flex h-full">
      {/* Left Icon Strip */}
      <div className="w-20 shrink-0 border-r border-border bg-sidebar flex flex-col items-center py-6 gap-3">
        {platformTabs.map((p) => (
          <button
            key={p.name}
            onClick={() => setActivePlatform(p.name)}
            className={`h-12 w-12 rounded-full flex items-center justify-center text-micro font-bold transition-all ${
              activePlatform === p.name
                ? `${p.bg} border-2 ${p.color} glow-ring`
                : "bg-elevated text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.name[0]}
          </button>
        ))}
      </div>

      {/* Center Preview */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <button
            onClick={() => navigate("/processing")}
            className="flex items-center gap-1 text-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Processing
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentAsset(Math.max(1, currentAsset - 1))}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-elevated"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-body text-muted-foreground">
              {currentAsset} / {totalAssets}
            </span>
            <button
              onClick={() => setCurrentAsset(Math.min(totalAssets, currentAsset + 1))}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-elevated"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => setApproved(!approved)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-body font-medium transition-all ${
              approved
                ? "bg-success/20 text-success"
                : "bg-elevated text-muted-foreground hover:text-foreground"
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            {approved ? "Approved" : "Approve"}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlatform}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <PreviewComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-border px-6 py-4 flex items-center justify-end">
          <button
            onClick={() => navigate("/scheduler")}
            className="rounded-full bg-accent-violet px-5 py-2.5 text-body font-medium text-white hover:brightness-110 transition-all flex items-center gap-2"
          >
            Schedule Approved <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
