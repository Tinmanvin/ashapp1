import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Check, Edit3, Sparkles, ChevronDown,
  ChevronRight, Image as ImageIcon, AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProcessingStore } from "../store/processingStore";
import { supabase } from "../lib/supabase";
import { generateCaption } from "../lib/openai";
import { Platform, PLATFORM_META } from "../lib/captionPrompts";

type CaptionStatus = "pending" | "generating" | "ready" | "error";

const ck = (assetId: number, platform: string) => `${assetId}:${platform}`;

export default function ProcessingHub() {
  const navigate = useNavigate();
  const { selectedAssets, selectedPlatforms } = useProcessingStore();

  const [assetUuids, setAssetUuids] = useState<Map<number, string>>(new Map());
  const [statuses, setStatuses] = useState<Map<string, CaptionStatus>>(new Map());
  const [texts, setTexts] = useState<Map<string, string>>(new Map());
  const [activeAsset, setActiveAsset] = useState(0);
  const [expandedPlatforms, setExpandedPlatforms] = useState<string[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const initialized = useRef(false);

  const setStatus = useCallback((key: string, s: CaptionStatus) =>
    setStatuses(prev => new Map(prev).set(key, s)), []);

  const setText = useCallback((key: string, t: string) =>
    setTexts(prev => new Map(prev).set(key, t)), []);

  useEffect(() => {
    return () => saveTimers.current.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    if (initialized.current || selectedAssets.length === 0) return;
    initialized.current = true;
    setExpandedPlatforms(selectedPlatforms.slice(0, 1));

    async function init() {
      const uuids = new Map<number, string>();
      await Promise.all(
        selectedAssets.map(async (asset) => {
          const { data } = await supabase
            .from("assets")
            .upsert(
              { filename: asset.name, type: asset.type, ratio: asset.ratio, status: "ready" },
              { onConflict: "filename" }
            )
            .select("id")
            .single();
          if (data) uuids.set(asset.id, data.id);
        })
      );
      setAssetUuids(uuids);

      await Promise.all(
        selectedAssets.flatMap(asset =>
          selectedPlatforms.map(platform =>
            loadOrGenerate(asset, platform, uuids.get(asset.id)!)
          )
        )
      );
    }

    init();
  }, [selectedAssets, selectedPlatforms]);

  async function loadOrGenerate(
    asset: (typeof selectedAssets)[0],
    platform: string,
    assetUuid: string
  ) {
    const key = ck(asset.id, platform);
    setStatus(key, "generating");

    const { data } = await supabase
      .from("captions")
      .select("body")
      .eq("asset_id", assetUuid)
      .eq("platform", platform)
      .maybeSingle();

    if (data?.body) {
      setText(key, data.body);
      setStatus(key, "ready");
      return;
    }

    try {
      const text = await generateCaption(asset.name, asset.type, platform as Platform);
      await supabase.from("captions").upsert(
        { asset_id: assetUuid, platform, body: text, status: "ready" },
        { onConflict: "asset_id,platform" }
      );
      setText(key, text);
      setStatus(key, "ready");
    } catch {
      setStatus(key, "error");
    }
  }

  async function handleRegenerate(assetId: number, platform: string) {
    const asset = selectedAssets.find(a => a.id === assetId);
    const assetUuid = assetUuids.get(assetId);
    if (!asset || !assetUuid) return;
    const key = ck(assetId, platform);
    setStatus(key, "generating");
    setText(key, "");
    try {
      const text = await generateCaption(asset.name, asset.type, platform as Platform);
      await supabase.from("captions").upsert(
        { asset_id: assetUuid, platform, body: text, status: "ready", edited: false },
        { onConflict: "asset_id,platform" }
      );
      setText(key, text);
      setStatus(key, "ready");
    } catch {
      setStatus(key, "error");
    }
  }

  function startEdit(key: string, current: string) {
    setEditingKey(key);
    setEditDraft(current);
  }

  function handleEditChange(key: string, assetId: number, platform: string, value: string) {
    setEditDraft(value);
    setText(key, value);
    const assetUuid = assetUuids.get(assetId);
    if (!assetUuid) return;
    const existing = saveTimers.current.get(key);
    if (existing) clearTimeout(existing);
    saveTimers.current.set(
      key,
      setTimeout(() => {
        supabase.from("captions")
          .update({ body: value, status: "edited", edited: true })
          .eq("asset_id", assetUuid)
          .eq("platform", platform);
      }, 800)
    );
  }

  function getAssetStatus(assetId: number): CaptionStatus {
    const s = selectedPlatforms.map(p => statuses.get(ck(assetId, p)) ?? "pending");
    if (s.every(x => x === "ready")) return "ready";
    if (s.some(x => x === "generating")) return "generating";
    if (s.some(x => x === "error")) return "error";
    return "pending";
  }

  const readyCount = [...statuses.values()].filter(s => s === "ready").length;
  const totalCount = selectedAssets.length * selectedPlatforms.length;
  const previewEnabled = selectedAssets.some(a =>
    selectedPlatforms.every(p => statuses.get(ck(a.id, p)) === "ready")
  );

  if (selectedAssets.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-satoshi mb-4">
            No assets selected. Go back to the library.
          </p>
          <button
            onClick={() => navigate("/library")}
            className="rounded-full bg-accent-violet px-5 py-2 text-body font-medium text-white hover:brightness-110 transition-all"
          >
            Go to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left — Asset Queue */}
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
          {selectedAssets.map((asset, i) => {
            const status = getAssetStatus(asset.id);
            return (
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
                    {selectedPlatforms.map(p => {
                      const meta = PLATFORM_META[p as Platform];
                      const s = statuses.get(ck(asset.id, p));
                      return (
                        <span
                          key={p}
                          className={`h-2 w-2 rounded-full transition-colors ${
                            s === "ready" ? meta?.dotColor : "bg-muted-foreground/20"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="shrink-0">
                  {status === "ready" ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : status === "generating" ? (
                    <Sparkles className="h-4 w-4 text-warning animate-pulse" />
                  ) : status === "error" ? (
                    <AlertCircle className="h-4 w-4 text-danger" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30 block" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-border px-5 py-3">
          <span className="font-mono text-micro text-muted-foreground">
            {selectedAssets.length} assets · {selectedPlatforms.length} platforms · {readyCount}/{totalCount} captions
          </span>
        </div>
      </div>

      {/* Right — Caption Review */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
          <span className="font-mono text-body text-muted-foreground">
            {readyCount} / {totalCount} ready
          </span>
          <button
            onClick={() => navigate("/preview")}
            disabled={!previewEnabled}
            className={`rounded-full px-5 py-2 text-body font-medium transition-all flex items-center gap-2 ${
              previewEnabled
                ? "bg-accent-violet text-white hover:brightness-110"
                : "bg-elevated text-muted-foreground cursor-not-allowed"
            }`}
          >
            Preview Selected <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {selectedPlatforms.map(platform => {
            const meta = PLATFORM_META[platform as Platform];
            const isExpanded = expandedPlatforms.includes(platform);
            const readyForPlatform = selectedAssets.filter(
              a => statuses.get(ck(a.id, platform)) === "ready"
            ).length;

            return (
              <div key={platform}>
                <button
                  onClick={() =>
                    setExpandedPlatforms(prev =>
                      prev.includes(platform)
                        ? prev.filter(p => p !== platform)
                        : [...prev, platform]
                    )
                  }
                  className="flex items-center gap-2 mb-3 w-full"
                >
                  <span className={`h-3 w-3 rounded-full ${meta?.dotColor}`} />
                  <span className={`text-sub font-satoshi font-bold ${meta?.textColor}`}>
                    {meta?.label}
                  </span>
                  <span className="font-mono text-micro text-muted-foreground ml-1">
                    {readyForPlatform}/{selectedAssets.length} ready
                  </span>
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
                    {selectedAssets.map(asset => {
                      const key = ck(asset.id, platform);
                      const status = statuses.get(key) ?? "pending";
                      const text = texts.get(key) ?? "";
                      const isEditing = editingKey === key;
                      const charLimit = meta?.charLimit ?? 280;

                      return (
                        <div key={asset.id} className="card-surface rounded-xl p-4 flex gap-4">
                          <div className="h-20 w-20 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                            <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {status === "generating" ? (
                              <div className="space-y-2">
                                <div className="h-3 rounded-full bg-elevated overflow-hidden">
                                  <div className="h-full w-1/2 bg-accent-violet/30 animate-shimmer rounded-full" />
                                </div>
                                <div className="h-3 w-3/4 rounded-full bg-elevated overflow-hidden">
                                  <div className="h-full w-1/2 bg-accent-violet/20 animate-shimmer rounded-full" />
                                </div>
                              </div>
                            ) : status === "error" ? (
                              <p className="text-body text-danger font-satoshi">
                                Generation failed — click ✦ to retry.
                              </p>
                            ) : isEditing ? (
                              <textarea
                                autoFocus
                                value={editDraft}
                                onChange={e =>
                                  handleEditChange(key, asset.id, platform, e.target.value)
                                }
                                onBlur={() => setEditingKey(null)}
                                rows={3}
                                className="w-full bg-elevated rounded-lg p-2 text-body text-foreground font-satoshi resize-none outline-none border border-accent-violet/40 focus:border-accent-violet"
                              />
                            ) : (
                              <p
                                className="text-body text-foreground font-satoshi leading-relaxed cursor-text"
                                onClick={() => startEdit(key, text)}
                              >
                                {text || (
                                  <span className="text-muted-foreground italic">No caption yet</span>
                                )}
                              </p>
                            )}
                            {status === "ready" && !isEditing && (
                              <div className="mt-2 flex items-center justify-between">
                                <span className="rounded-md bg-success/10 px-2 py-0.5 text-micro font-mono text-success">
                                  {platform === "telegram_free" || platform === "website"
                                    ? "CLEAN"
                                    : "EXPLICIT OK"}
                                </span>
                                <span
                                  className={`font-mono text-micro ${
                                    text.length > charLimit ? "text-danger" : "text-muted-foreground"
                                  }`}
                                >
                                  {text.length} / {charLimit}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => startEdit(key, text)}
                              disabled={status === "generating"}
                              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors disabled:opacity-30"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleRegenerate(asset.id, platform)}
                              disabled={status === "generating"}
                              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-elevated transition-colors disabled:opacity-30"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
