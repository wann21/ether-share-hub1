import { Upload, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-[var(--glass-bg)] backdrop-blur-glass">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
            <Network className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            DecentraShare
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#files" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            My Files
          </a>
        </nav>

        <Button variant="default" size="sm" className="bg-gradient-accent hover:shadow-accent transition-all">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>
    </header>
  );
};

export default Header;
