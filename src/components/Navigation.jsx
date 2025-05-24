import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Bell, Settings, BarChart2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItems = [
    { name: "Inicio", path: "/", icon: Home },
    { name: "Alertas", path: "/alerts", icon: Bell },
    { name: "Configuración", path: "/configuration", icon: Settings },
    { name: "Estadísticas", path: "/statistics", icon: BarChart2 },
    { name: "Guía", path: "/guide", icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background border-t py-2 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="lg"
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center py-2 h-20 w-[20%] rounded-lg",
              pathname === item.path && "bg-accent text-accent-foreground"
            )}
            aria-current={pathname === item.path ? "page" : undefined}
          >
            <item.icon size={24} aria-hidden="true" />
            <span className="mt-1 text-sm">{item.name}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
