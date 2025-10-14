import { useState } from "react";
import { Settings as SettingsIcon, Save, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const Settings = () => {
  const [contractAddress, setContractAddress] = useState("0x1234...5678");
  const [ipfsApi, setIpfsApi] = useState("http://127.0.0.1:5001/api/v0");
  const [gateway, setGateway] = useState("http://127.0.0.1:8080");
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    console.log("Saving settings:", { contractAddress, ipfsApi, gateway });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleReset = () => {
    setContractAddress("0x1234...5678");
    setIpfsApi("http://127.0.0.1:5001/api/v0");
    setGateway("http://127.0.0.1:8080");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Settings
        </h1>

        <div className="max-w-2xl">
          {showSaved && (
            <div className="mb-6 p-4 rounded-lg bg-accent/20 border border-accent/40 animate-in fade-in slide-in-from-top-2">
              <p className="text-sm font-medium text-accent-foreground">
                ✓ Settings saved successfully
              </p>
            </div>
          )}

          <Card className="p-8 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Configuration</h2>
            </div>

            <div className="space-y-6">
              {/* Contract Address */}
              <div>
                <Label htmlFor="contractAddressInput">
                  Smart Contract Address
                </Label>
                <Input
                  id="contractAddressInput"
                  type="text"
                  placeholder="0x..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The Ethereum address of your deployed file-sharing contract
                </p>
              </div>

              {/* IPFS API URL */}
              <div>
                <Label htmlFor="ipfsApiInput">IPFS API URL</Label>
                <Input
                  id="ipfsApiInput"
                  type="text"
                  placeholder="http://127.0.0.1:5001/api/v0"
                  value={ipfsApi}
                  onChange={(e) => setIpfsApi(e.target.value)}
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Local or remote IPFS node API endpoint (default: http://127.0.0.1:5001/api/v0)
                </p>
              </div>

              {/* Gateway URL */}
              <div>
                <Label htmlFor="gatewayInput">IPFS Gateway URL</Label>
                <Input
                  id="gatewayInput"
                  type="text"
                  placeholder="http://127.0.0.1:8080"
                  value={gateway}
                  onChange={(e) => setGateway(e.target.value)}
                  className="mt-1 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Gateway for accessing IPFS content (default: http://127.0.0.1:8080)
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-primary hover:shadow-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
