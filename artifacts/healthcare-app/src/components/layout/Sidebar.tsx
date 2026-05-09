import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  Activity,
  AlertTriangle,
  Calendar,
  Building2,
  Settings,
  MessageSquare,
  Users,
  LogOut,
  LayoutDashboard,
  BarChart3,
  History,
  HeartPulse
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const patientNav: NavItem[] = [
    { title: "Dashboard", href: "/patient", icon: LayoutDashboard },
    { title: "Record Vitals", href: "/patient/vitals", icon: HeartPulse },
    { title: "History", href: "/patient/history", icon: History },
    { title: "Analytics", href: "/patient/analytics", icon: BarChart3 },
    { title: "Alerts", href: "/patient/alerts", icon: AlertTriangle },
    { title: "Appointments", href: "/patient/appointments", icon: Calendar },
    { title: "Hospitals", href: "/patient/hospitals", icon: Building2 },
    { title: "AI Assistant", href: "/patient/ai-assistant", icon: MessageSquare },
    { title: "Settings", href: "/patient/settings", icon: Settings },
  ];

  const doctorNav: NavItem[] = [
    { title: "Dashboard", href: "/doctor", icon: LayoutDashboard },
    { title: "Patients", href: "/doctor/patients", icon: Users },
    { title: "Appointments", href: "/doctor/appointments", icon: Calendar },
    { title: "Alerts", href: "/doctor/alerts", icon: AlertTriangle },
    { title: "Hospitals", href: "/doctor/hospitals", icon: Building2 },
    { title: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  const adminNav: NavItem[] = [
    { title: "Dashboard", href: "/hospital-admin", icon: LayoutDashboard },
    { title: "Doctors", href: "/hospital-admin/doctors", icon: Users },
    { title: "Patients", href: "/hospital-admin/patients", icon: Activity },
    { title: "Appointments", href: "/hospital-admin/appointments", icon: Calendar },
    { title: "Analytics", href: "/hospital-admin/analytics", icon: BarChart3 },
    { title: "Hospitals", href: "/hospital-admin/hospitals", icon: Building2 },
    { title: "Settings", href: "/hospital-admin/settings", icon: Settings },
  ];

  let navItems: NavItem[] = [];
  if (user.role === "patient") navItems = patientNav;
  if (user.role === "doctor") navItems = doctorNav;
  if (user.role === "hospital_admin") navItems = adminNav;

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex h-14 items-center border-b border-sidebar-border px-6">
        <Activity className="h-6 w-6 text-sidebar-primary mr-2" />
        <span className="font-semibold text-lg tracking-tight text-white">VitalCare</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/patient" && item.href !== "/doctor" && item.href !== "/hospital-admin");
            
            // Special handling for exact dashboard match
            const isExactMatch = location === item.href;
            const isReallyActive = (item.href === "/patient" || item.href === "/doctor" || item.href === "/hospital-admin") ? isExactMatch : isActive;

            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isReallyActive
                      ? "bg-sidebar-primary/10 text-sidebar-primary shadow-[0_0_10px_rgba(var(--sidebar-primary),0.2)]"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isReallyActive ? "text-sidebar-primary" : "text-sidebar-foreground/50"
                    )}
                    aria-hidden="true"
                  />
                  {item.title}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-sm font-medium text-white">{user.name}</span>
            <span className="text-xs text-sidebar-foreground/70 capitalize">{user.role.replace('_', ' ')}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-4 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-destructive"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
