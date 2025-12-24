import { useState, useEffect } from "react";
import { Upload, Network, Files, Key, Users, Settings, Wallet, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("theme") as "dark" | "light") || "dark"
  );

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
    // ensure initial theme is applied on first render
    applyTheme((localStorage.getItem("theme") as "dark" | "light") || "dark");
  }, []);

  const disconnectWallet = () => {
    localStorage.removeItem("walletAddress");
    setWalletAddress("");
    toast.success("Wallet disconnected");
    navigate("/auth");
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const applyTheme = (t: "dark" | "light") => {
    const root = document.documentElement;
    if (t === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const navItems = [
    { path: "/upload", icon: Upload, label: "Upload" },
    { path: "/files", icon: Files, label: "Files" },
    { path: "/access", icon: Key, label: "Access" },
    { path: "/peers", icon: Users, label: "Peers" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-[var(--glass-bg)] backdrop-blur-glass">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
            <Network className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            DecentraShare
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={isActive ? "bg-gradient-accent" : ""}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {walletAddress ? (
            <div className="flex items-center gap-2 ml-2">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Wallet className="w-4 h-4 text-accent" />
                <span className="text-sm font-mono">{formatAddress(walletAddress)}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" asChild className="ml-2">
              <Link to="/auth">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
