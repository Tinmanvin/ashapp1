import { motion } from "framer-motion";
import {
  TrendingUp,
  ArrowRight,
  Calendar,
  Play,
  Image as ImageIcon,
  Film,
  Scissors,
} from "lucide-react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

// Mock schedule data for heat map
const scheduleData = Array.from({ length: 28 }, (_, i) => {
  const r = Math.random();
  return r > 0.7 ? "full" : r > 0.4 ? "partial" : "empty";
});

const upcomingPosts = [
  { platform: "X", platformColor: "bg-platform-x/20 text-platform-x", caption: "New episode dropping tonight. You're not ready for this one...", time: "10:00 AM" },
  { platform: "Reddit", platformColor: "bg-platform-reddit/20 text-platform-reddit", caption: "Episode 47 behind the scenes — the craziest shoot we've done", time: "12:00 PM" },
  { platform: "Telegram", platformColor: "bg-platform-telegram/20 text-platform-telegram", caption: "Exclusive preview for VIP members only 🔥", time: "2:00 PM" },
  { platform: "Website", platformColor: "bg-platform-website/20 text-platform-website", caption: "Full episode now live on the site. Go watch.", time: "4:00 PM" },
];

const recentAssets = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  type: ["VIDEO", "IMAGE", "CLIP", "IMAGE", "VIDEO", "CLIP", "IMAGE", "VIDEO"][i],
  name: [`EP47_Hero`, `BTS_Setup`, `Clip_Highlight`, `Portrait_01`, `EP46_Full`, `Teaser_Cut`, `Cover_Art`, `EP47_Intro`][i],
}));

const platformStats = [
  { name: "X / Twitter", count: 18, color: "bg-platform-x", width: "75%" },
  { name: "Reddit", count: 14, color: "bg-platform-reddit", width: "58%" },
  { name: "Telegram", count: 12, color: "bg-platform-telegram", width: "50%" },
  { name: "Website", count: 3, color: "bg-platform-website", width: "12%" },
];

export default function Dashboard() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-6 lg:p-8"
    >
      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Hero Greeting — full width */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 card-surface rounded-2xl p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent-violet/5" />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="font-clash text-hero font-bold text-foreground leading-none">
                {greeting}, Ash.
              </h1>
              <p className="mt-3 text-section text-muted-foreground font-satoshi">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mt-4 text-sub text-foreground font-satoshi">
                You have <span className="font-bold text-accent-violet">3 posts</span> going out today.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative h-32 w-48 rounded-xl bg-elevated overflow-hidden">
                <div className="absolute inset-0 atmospheric-glow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-10 w-10 text-accent-violet/60" />
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-elevated/80 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-platform-x" />
                <span className="font-mono text-micro text-muted-foreground">X · 10:00 AM</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Schedule Health — 7 cols */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 lg:col-span-7 card-surface rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <span className="text-sub font-satoshi text-muted-foreground">Content Calendar</span>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="text-center font-mono text-micro text-muted-foreground/60 pb-1">
                {d}
              </span>
            ))}
            {scheduleData.map((status, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.15 }}
                className={`aspect-square rounded-md transition-colors cursor-pointer ${
                  status === "full"
                    ? "bg-accent-violet/80"
                    : status === "partial"
                    ? "bg-accent-violet/30"
                    : "bg-elevated"
                }`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-micro text-muted-foreground">
              <span className="h-2 w-2 rounded-sm bg-elevated" /> Empty
            </span>
            <span className="flex items-center gap-1.5 font-mono text-micro text-muted-foreground">
              <span className="h-2 w-2 rounded-sm bg-accent-violet/30" /> Partial
            </span>
            <span className="flex items-center gap-1.5 font-mono text-micro text-muted-foreground">
              <span className="h-2 w-2 rounded-sm bg-accent-violet/80" /> Full
            </span>
          </div>
        </motion.div>

        {/* Posts This Month + Revenue — stacked in 5 cols */}
        <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-4">
          <motion.div variants={fadeUp} className="card-surface rounded-2xl p-6">
            <span className="text-body text-muted-foreground font-satoshi">Posts This Month</span>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-clash text-metric font-bold text-foreground">47</span>
              <span className="mb-1 flex items-center gap-1 text-body text-success font-mono">
                <TrendingUp className="h-3 w-3" /> +12 vs last month
              </span>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="card-surface rounded-2xl p-6">
            <span className="text-body text-muted-foreground font-satoshi">Revenue This Month</span>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-mono text-metric font-bold text-foreground">£8,240</span>
            </div>
            {/* Sparkline */}
            <div className="mt-3 flex h-8 items-end gap-1">
              {[35, 42, 38, 55, 48, 62].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-accent-violet/40"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recently Imported — full width */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 card-surface rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sub font-satoshi text-muted-foreground">Recently Imported</span>
            <button className="flex items-center gap-1 text-body text-accent-violet hover:text-accent-light transition-colors">
              View Library <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentAssets.map((asset) => (
              <motion.div
                key={asset.id}
                whileHover={{ scale: 1.03 }}
                className="group relative flex-shrink-0 w-36 h-24 rounded-xl bg-elevated overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 atmospheric-glow opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {asset.type === "VIDEO" ? (
                    <Film className="h-5 w-5 text-muted-foreground/40" />
                  ) : asset.type === "CLIP" ? (
                    <Scissors className="h-5 w-5 text-muted-foreground/40" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-micro text-foreground font-mono">{asset.name}</span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="rounded-md bg-elevated/80 px-1.5 py-0.5 text-micro font-mono text-muted-foreground">
                    {asset.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Breakdown — 6 cols */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 lg:col-span-6 card-surface rounded-2xl p-6"
        >
          <span className="text-sub font-satoshi text-muted-foreground">Platform Posting Breakdown</span>
          <div className="mt-5 flex flex-col gap-3">
            {platformStats.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-24 text-body font-satoshi text-foreground truncate">{p.name}</span>
                <div className="flex-1 h-3 rounded-full bg-elevated overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: p.width }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className={`h-full rounded-full ${p.color}`}
                  />
                </div>
                <span className="font-mono text-body text-muted-foreground w-6 text-right">{p.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Posts — 6 cols */}
        <motion.div
          variants={fadeUp}
          className="col-span-12 lg:col-span-6 card-surface rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sub font-satoshi text-muted-foreground">Upcoming Posts</span>
            <button className="flex items-center gap-1 text-body text-accent-violet hover:text-accent-light transition-colors">
              View Scheduler <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingPosts.map((post, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-elevated/50 p-3 transition-colors hover:bg-elevated"
              >
                <div className="h-10 w-10 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                  <Play className="h-4 w-4 text-muted-foreground/60" />
                </div>
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-micro font-mono font-medium ${post.platformColor}`}>
                  {post.platform}
                </span>
                <span className="flex-1 text-body text-foreground truncate font-satoshi">
                  {post.caption}
                </span>
                <span className="font-mono text-micro text-muted-foreground shrink-0">
                  {post.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
