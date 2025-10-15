import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Shield, Network } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      navigate("/");
    }
  }, [navigate]);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("MetaMask not detected. Please install MetaMask extension.");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address);
        toast.success("Wallet connected successfully!");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent">
              <Network className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
            DecentraShare
          </h1>
          <p className="text-muted-foreground">Decentralized File Sharing Network</p>
        </div>

        {/* Main Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect with MetaMask to access the decentralized network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-primary)] transition-all duration-300"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>

            {/* Features */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Secure & Private</h3>
                  <p className="text-xs text-muted-foreground">
                    Your files are encrypted and distributed across the network
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Network className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Decentralized</h3>
                  <p className="text-xs text-muted-foreground">
                    No central servers, peer-to-peer file sharing
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wallet className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Web3 Ready</h3>
                  <p className="text-xs text-muted-foreground">
                    Built on blockchain technology for transparency
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have MetaMask?{" "}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Install it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
