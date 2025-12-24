import { Upload, Shield, Zap, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-network.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Decentralized network"
          className="w-full h-full object-cover"
          style={{ opacity: "var(--hero-image-opacity)" }}
        />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-glass mb-6">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground/80">Secure • Private • Decentralized</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Share Files Without
            <br />
            Limits or Censorship
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
            Experience true peer-to-peer file sharing powered by blockchain technology.
            Your files, your control, completely decentralized.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-accent hover:shadow-accent transition-all text-lg">
              <Upload className="w-5 h-5 mr-2" />
              Start Sharing
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary/50 text-lg">
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="End-to-End Encrypted"
              description="Your files are encrypted before leaving your device"
            />
            <FeatureCard
              icon={<Network className="w-8 h-8" />}
              title="Peer-to-Peer"
              description="Direct sharing without centralized servers"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Distributed network ensures optimal speed"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-glass shadow-glass hover:shadow-primary transition-all group">
      <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 mx-auto group-hover:shadow-primary transition-all">
        <div className="text-primary-foreground">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Hero;

