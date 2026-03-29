import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileSpreadsheet,
  Send,
  Image as ImageIcon,
  GripVertical,
} from "lucide-react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const platformIcons = [
  { name: "X", color: "bg-platform-x text-black" },
  { name: "R", color: "bg-platform-reddit text-white" },
  { name: "T", color: "bg-platform-telegram text-white" },
  { name: "W", color: "bg-platform-website text-white" },
];

// Mock: generate calendar days for March 2026
const calendarDays = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  const scheduled = Array.from({ length: 4 }, () => Math.random() > 0.5);
  const count = scheduled.filter(Boolean).length;
  return { day, scheduled, isFull: count === 4, isToday: day === 29, isPast: day < 29 };
});

const stagingCards = [
  { id: 1, name: "EP47_Hero_Shot", platforms: ["X", "Reddit"], caption: "New episode dropping tonight..." },
  { id: 2, name: "EP47_BTS", platforms: ["Telegram", "Website"], caption: "Behind the scenes of the latest..." },
  { id: 3, name: "EP47_Clip_01", platforms: ["X", "Telegram"], caption: "The highlight reel you didn't..." },
  { id: 4, name: "Portrait_Closeup", platforms: ["Reddit", "Website"], caption: "Studio session vibes 📸" },
  { id: 5, name: "EP47_Teaser", platforms: ["X", "Reddit", "Telegram"], caption: "Something big is coming..." },
];

export default function Scheduler() {
  const [month] = useState("March 2026");

  return (
    <div className="flex h-full">
      {/* Left Staging Panel */}
      <div className="w-[300px] shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="px-5 py-5">
          <h2 className="font-clash text-section font-bold text-foreground">Ready to Schedule</h2>
        </div>

        <div className="px-3 mb-3">
          <button className="w-full rounded-full bg-elevated px-4 py-2 text-body text-accent-violet font-medium flex items-center justify-center gap-2 hover:bg-elevated/80 transition-colors border border-border/50">
            <Sparkles className="h-3.5 w-3.5" /> Auto-fill suggestions
          </button>
        </div>

        <div className="flex-1 overflow-auto px-3">
          {stagingCards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.02 }}
              className="card-surface rounded-xl p-3 mb-2 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                </div>
                <div className="h-12 w-12 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                  <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-body font-satoshi text-foreground block truncate">{card.name}</span>
                  <div className="flex gap-1 mt-1">
                    {card.platforms.map((p) => {
                      const pi = platformIcons.find((x) => x.name === p[0]);
                      return (
                        <span
                          key={p}
                          className={`h-4 w-4 rounded-full text-micro flex items-center justify-center font-bold ${pi?.color || "bg-elevated text-muted-foreground"}`}
                        >
                          {p[0]}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-micro text-muted-foreground font-satoshi mt-1 block truncate">
                    {card.caption}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-border px-5 py-3">
          <span className="font-mono text-micro text-muted-foreground">
            5 assets ready
          </span>
        </div>
      </div>

      {/* Calendar Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Month header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <button className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-elevated">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-clash text-section font-bold text-foreground">{month}</span>
          <button className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-elevated">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {daysOfWeek.map((d) => (
            <div key={d} className="px-2 py-2 text-center font-mono text-micro text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-4 overflow-hidden">
          {calendarDays.map((day) => (
            <motion.div
              key={day.day}
              whileHover={{ backgroundColor: "hsl(240 7% 11%)" }}
              className={`border-r border-b border-border p-2 flex flex-col transition-colors ${
                day.isFull ? "bg-accent-violet/[0.06]" : ""
              } ${day.isPast ? "opacity-50" : ""}`}
            >
              <span
                className={`font-mono text-body self-start mb-1 ${
                  day.isToday
                    ? "text-accent-violet font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {day.day}
              </span>
              <div className="grid grid-cols-2 gap-1 mt-auto">
                {platformIcons.map((p, pi) => (
                  <div
                    key={p.name}
                    className={`relative h-6 w-6 rounded-md flex items-center justify-center text-micro font-bold transition-all ${
                      day.scheduled[pi]
                        ? p.color
                        : "bg-elevated/50 text-muted-foreground/30"
                    }`}
                  >
                    {p.name}
                    {day.scheduled[pi] && (
                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-accent-violet text-[9px] text-white flex items-center justify-center font-bold">
                        {Math.ceil(Math.random() * 5)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border">
          <span className="font-mono text-body text-muted-foreground">
            48 posts · 4 platforms · 14 days covered
          </span>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-border px-4 py-2 text-body text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors flex items-center gap-2">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Export to Sheets
            </button>
            <button className="rounded-full bg-accent-violet px-5 py-2 text-body font-medium text-white hover:brightness-110 transition-all flex items-center gap-2">
              <Send className="h-3.5 w-3.5" /> Publish on Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
