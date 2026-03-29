import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Edit3,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const platforms = [
  { name: "X / Twitter", color: "text-platform-x", dotColor: "bg-platform-x" },
  { name: "Reddit", color: "text-platform-reddit", dotColor: "bg-platform-reddit" },
  { name: "Telegram", color: "text-platform-telegram", dotColor: "bg-platform-telegram" },
  { name: "Website", color: "text-platform-website", dotColor: "bg-platform-website" },
];

const mockAssets = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  name: `EP47_Asset_${i + 1}`,
  status: i < 3 ? "done" : i < 5 ? "generating" : "pending",
}));

const mockCaptions: Record<string, string> = {
  "X / Twitter": "New episode dropping tonight. You're not ready for this one. The grind never stops 🔥",
  Reddit: "Episode 47 behind the scenes — the craziest shoot we've done. r/ashtv what do you think?",
  Telegram: "Exclusive preview for the VIP crew. Full episode drops at midnight. You're first in line 🎬",
  Website: "Episode 47 is now live. This one pushes every boundary we've set. Watch the full episode on the site.",
};

export default function ProcessingHub() {
  const navigate = useNavigate();
  const [activeAsset, setActiveAsset] = useState(0);
  const [expandedPlatforms, setExpandedPlatforms] = useState<string[]>(platforms.map((p) => p.name));

  const toggleExpanded = (name: string) => {
    setExpandedPlatforms((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name]
    );
  };

  return (
    <div className="flex h-full">
      {/* Left Column — Asset Queue */}
      <div className="w-[320px] shrink-0 border-r border-border bg-sidebar flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-5">
          <button
            onClick={() => navigate("/library")}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="font-clash text-section font-bold text-foreground">Processing</h2>
        </div>

        <div className="flex-1 overflow-auto px-3">
          {mockAssets.map((asset, i) => (
            <button
              key={asset.id}
              onClick={() => setActiveAsset(i)}
              className={`w-full flex items-center gap-3 rounded-xl p-3 mb-1 transition-all ${
                activeAsset === i
                  ? "bg-elevated border-l-[3px] border-accent-violet"
                  : "hover:bg-elevated/50"
              }`}
            >
              <div className="h-[60px] w-[60px] rounded-lg bg-elevated flex items-center justify-center shrink-0">
                <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <span className="text-body font-satoshi text-foreground truncate block">
                  {asset.name}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {platforms.map((p) => (
                    <span key={p.name} className={`h-2 w-2 rounded-full ${p.dotColor}`} />
                  ))}
                </div>
              </div>
              <div className="shrink-0">
                {asset.status === "done" ? (
                  <Check className="h-4 w-4 text-success" />
                ) : asset.status === "generating" ? (
                  <Sparkles className="h-4 w-4 text-warning animate-pulse" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30 block" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-border px-5 py-3">
          <span className="font-mono text-micro text-muted-foreground">
            6 assets · 4 platforms · 24 captions
          </span>
        </div>
      </div>

      {/* Center Canvas — Caption Review */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="font-mono text-body text-muted-foreground">
            18 / 24 reviewed
          </span>
          <button
            onClick={() => navigate("/preview")}
            className="rounded-full bg-accent-violet px-5 py-2 text-body font-medium text-white hover:brightness-110 transition-all flex items-center gap-2"
          >
            Preview Selected <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {platforms.map((platform) => {
            const isExpanded = expandedPlatforms.includes(platform.name);
            return (
              <div key={platform.name}>
                <button
                  onClick={() => toggleExpanded(platform.name)}
                  className="flex items-center gap-2 mb-3 w-full"
                >
                  <span className={`h-3 w-3 rounded-full ${platform.dotColor}`} />
                  <span className={`text-sub font-satoshi font-bold ${platform.color}`}>
                    {platform.name}
                  </span>
                  <span className="font-mono text-micro text-muted-foreground ml-1">6 posts</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground ml-auto transition-transform ${
                      isExpanded ? "" : "-rotate-90"
                    }`}
                  />
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-col gap-2"
                  >
                    {mockAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="card-surface rounded-xl p-4 flex gap-4"
                      >
                        <div className="h-20 w-20 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                          <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {asset.status === "generating" ? (
                            <div className="space-y-2">
                              <div className="h-3 rounded-full bg-elevated overflow-hidden">
                                <div className="h-full w-1/2 bg-accent-violet/30 animate-shimmer rounded-full" />
                              </div>
                              <div className="h-3 w-3/4 rounded-full bg-elevated overflow-hidden">
                                <div className="h-full w-1/2 bg-accent-violet/20 animate-shimmer rounded-full" />
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-body text-foreground font-satoshi leading-relaxed">
                                {mockCaptions[platform.name]}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="rounded-md bg-success/10 px-2 py-0.5 text-micro font-mono text-success">
                                  CLEAN
                                </span>
                                <span className="font-mono text-micro text-muted-foreground">
                                  {mockCaptions[platform.name]?.length} / 280
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors">
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
