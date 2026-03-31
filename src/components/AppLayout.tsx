import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Grid3X3,
  Sparkles,
  Eye,
  Calendar,
  Settings,
  FolderOpen,
  Film,
  Image,
  Scissors,
  Clapperboard,
  Star,
  Camera,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/library", icon: Grid3X3, label: "Library" },
  { to: "/processing", icon: Sparkles, label: "Processing" },
  { to: "/preview", icon: Eye, label: "Preview" },
  { to: "/scheduler", icon: Calendar, label: "Scheduler" },
];

const folders = [
  { icon: FolderOpen, label: "All Assets", count: 247 },
  { icon: Film, label: "Episodes", count: 48 },
  { icon: Scissors, label: "Clips", count: 124 },
  { icon: Image, label: "Photos", count: 53 },
  { icon: Clapperboard, label: "Trailers", count: 8 },
  { icon: Star, label: "Teasers", count: 6 },
  { icon: Camera, label: "BTS", count: 8 },
];

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-[220px] flex-col border-r border-border bg-sidebar shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-violet">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-clash text-sub font-bold tracking-tight text-foreground">
            BlackMagic
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-body transition-all duration-150 ${
                  isActive
                    ? "bg-elevated text-foreground"
                    : "text-muted-foreground hover:bg-elevated/50 hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-[18px] w-[18px] ${
                      isActive ? "text-accent-violet" : ""
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.5}
                  />
                  <span className="font-satoshi">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Folder tree */}
        <div className="mt-6 border-t border-border px-3 pt-4">
          <span className="px-3 text-micro font-medium uppercase tracking-widest text-muted-foreground">
            Library
          </span>
          <div className="mt-3 flex flex-col gap-0.5">
            {folders.map((f, i) => (
              <button
                key={i}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-body text-muted-foreground transition-colors hover:bg-elevated/50 hover:text-foreground"
              >
                <f.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="flex-1 text-left font-satoshi">{f.label}</span>
                <span className="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-micro text-muted-foreground">
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto border-t border-border px-3 py-3">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-body text-muted-foreground transition-colors hover:bg-elevated/50 hover:text-foreground"
          >
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.5} />
            <span className="font-satoshi">Settings</span>
          </NavLink>
          <div className="mt-3 flex items-center gap-2.5 px-3">
            <div className="h-7 w-7 rounded-full bg-accent-violet/20 flex items-center justify-center">
              <span className="text-micro font-bold text-accent-violet">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-body font-medium text-foreground">Ash</span>
              <span className="text-micro text-muted-foreground">Creator</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
