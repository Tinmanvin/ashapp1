import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  Upload,
  Play,
  Image as ImageIcon,
  Film,
  Scissors,
  X,
  Sparkles,
} from "lucide-react";

type AssetType = "VIDEO" | "IMAGE" | "CLIP";
interface Asset {
  id: number;
  name: string;
  type: AssetType;
  ratio: "landscape" | "portrait" | "square";
  duration?: string;
}

const mockAssets: Asset[] = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  name: [
    "EP47_Hero_Shot", "BTS_Lighting_Setup", "Portrait_Closeup", "Clip_Highlight_Reel",
    "EP46_Full_Edit", "Teaser_v2", "Cover_Art_Final", "EP47_Intro_Sequence",
    "BTS_Camera_Rig", "EP45_Thumbnail", "Clip_Funny_Moment", "Portrait_Studio",
    "EP47_Outro", "Landscape_Wide", "Clip_Action_Scene", "EP44_Promo",
    "BTS_Interview", "Cover_Variant_B",
  ][i],
  type: (["VIDEO", "IMAGE", "CLIP", "IMAGE", "VIDEO", "CLIP", "IMAGE", "VIDEO",
    "IMAGE", "IMAGE", "CLIP", "IMAGE", "VIDEO", "IMAGE", "CLIP", "VIDEO",
    "IMAGE", "IMAGE"] as AssetType[])[i],
  ratio: (["landscape", "portrait", "square", "landscape", "landscape", "square",
    "square", "landscape", "portrait", "square", "landscape", "portrait",
    "landscape", "landscape", "square", "landscape", "portrait", "square"] as const)[i],
  duration: ["VIDEO", "CLIP"].includes(
    ["VIDEO", "IMAGE", "CLIP", "IMAGE", "VIDEO", "CLIP", "IMAGE", "VIDEO",
      "IMAGE", "IMAGE", "CLIP", "IMAGE", "VIDEO", "IMAGE", "CLIP", "VIDEO",
      "IMAGE", "IMAGE"][i]
  )
    ? `${Math.floor(Math.random() * 10 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`
    : undefined,
}));

const filters = ["All", "Images", "Videos", "Clips", "Unscheduled"];
const platforms = [
  { name: "X", color: "bg-platform-x text-black" },
  { name: "Reddit", color: "bg-platform-reddit text-white" },
  { name: "Telegram Free", color: "bg-platform-telegram text-white" },
  { name: "Telegram VIP", color: "bg-platform-telegram text-white" },
  { name: "Website", color: "bg-platform-website text-white" },
];

export default function MediaLibrary() {
  const [selected, setSelected] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);

  const toggleSelect = (id: number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const togglePlatform = (name: string) => {
    setActivePlatforms((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name]
    );
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="flex h-full">
      {/* Center Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-elevated px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search assets..."
              className="flex-1 bg-transparent text-body text-foreground placeholder:text-muted-foreground outline-none font-satoshi"
            />
          </div>
          <div className="flex items-center gap-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-3 py-1.5 text-micro font-medium transition-colors ${
                  activeFilter === f
                    ? "bg-accent-violet text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-elevated"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-elevated hover:text-foreground">
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-elevated hover:text-foreground">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Upload zone */}
        <div className="mx-6 mt-4 rounded-xl border border-dashed border-border/60 bg-elevated/30 px-4 py-3 flex items-center justify-center gap-2 text-muted-foreground text-body cursor-pointer hover:border-accent-violet/40 transition-colors">
          <Upload className="h-4 w-4" />
          <span className="font-satoshi">Drop files here or click to upload</span>
        </div>

        {/* Asset Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-auto">
            {mockAssets.map((asset) => {
              const isSelected = selected.includes(asset.id);
              return (
                <motion.div
                  key={asset.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleSelect(asset.id)}
                  className={`group relative cursor-pointer rounded-xl overflow-hidden transition-shadow ${
                    asset.ratio === "portrait" ? "row-span-2" : ""
                  } ${
                    isSelected ? "glow-ring" : ""
                  }`}
                >
                  <div
                    className={`w-full bg-elevated relative ${
                      asset.ratio === "portrait"
                        ? "h-full min-h-[240px]"
                        : asset.ratio === "landscape"
                        ? "aspect-video"
                        : "aspect-square"
                    }`}
                  >
                    <div className="absolute inset-0 atmospheric-glow opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {asset.type === "VIDEO" ? (
                        <Film className="h-8 w-8 text-muted-foreground/30" />
                      ) : asset.type === "CLIP" ? (
                        <Scissors className="h-8 w-8 text-muted-foreground/30" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                      )}
                    </div>

                    {/* Video overlay */}
                    {asset.duration && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="rounded-full bg-black/60 p-2">
                            <Play className="h-5 w-5 text-foreground" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-micro text-foreground">
                          {asset.duration}
                        </span>
                      </>
                    )}

                    {/* Type badge */}
                    <span className="absolute top-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-micro font-mono text-muted-foreground">
                      {asset.type}
                    </span>

                    {/* Hover name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-body text-foreground font-satoshi">{asset.name}</span>
                    </div>

                    {/* Selection check */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 h-5 w-5 rounded-full bg-accent-violet flex items-center justify-center">
                        <span className="text-micro font-bold text-white">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel — Selection */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-l border-border bg-sidebar overflow-hidden shrink-0"
          >
            <div className="w-[320px] flex flex-col h-full p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sub font-satoshi text-foreground">Selected</span>
                  <span className="rounded-full bg-accent-violet px-2 py-0.5 text-micro font-bold text-white">
                    {selected.length}
                  </span>
                </div>
                <button
                  onClick={() => setSelected([])}
                  className="text-micro text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>

              {/* Selected thumbnails */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selected.slice(0, 9).map((id) => (
                  <div key={id} className="aspect-square rounded-lg bg-elevated relative group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(id);
                      }}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-2.5 w-2.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Platform selection */}
              <div className="border-t border-border pt-4">
                <span className="text-body text-muted-foreground font-satoshi">Publish to:</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {platforms.map((p) => {
                    const active = activePlatforms.includes(p.name);
                    return (
                      <button
                        key={p.name}
                        onClick={() => togglePlatform(p.name)}
                        className={`rounded-full px-3 py-1.5 text-micro font-medium transition-all ${
                          active ? p.color : "bg-elevated text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-micro text-muted-foreground/60 font-satoshi">
                  Censoring rules applied automatically per platform
                </p>
              </div>

              {/* Process CTA */}
              <div className="mt-auto pt-6">
                <button
                  disabled={activePlatforms.length === 0}
                  className={`w-full rounded-full py-3 text-sub font-medium transition-all flex items-center justify-center gap-2 ${
                    activePlatforms.length > 0
                      ? "bg-accent-violet text-white hover:brightness-110 animate-glow-breathe"
                      : "bg-elevated text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Process <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
