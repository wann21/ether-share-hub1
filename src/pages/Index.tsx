import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FileUploadZone from "@/components/FileUploadZone";
import FileGrid from "@/components/FileGrid";
import NetworkStatus from "@/components/NetworkStatus";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FileUploadZone />
      <FileGrid />
      <NetworkStatus />
      
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 DecentraShare. Decentralized file sharing for everyone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
