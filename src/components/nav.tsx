import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, GraduationCap, Heart, Home, Moon, Sparkles, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/education", label: "Education", icon: GraduationCap },
  { to: "/major", label: "Major", icon: Sparkles },
  { to: "/mental-health", label: "Wellness", icon: Heart },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("tb.theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-white shadow-soft">
            <Compass className="h-5 w-5" />
          </div>
          <div className="leading-none">
            <div className="font-display text-base font-bold">Trailblaze MM</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Discover · Decide · Develop</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-hero text-white shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {links.map((l) => {
          const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
              <span className="font-medium">{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
