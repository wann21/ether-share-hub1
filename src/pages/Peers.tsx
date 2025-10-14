import { useState } from "react";
import { Users, Wifi, Copy } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockPeers = [
  { id: "12D3KooWABC...", status: "connected", latency: "12ms" },
  { id: "12D3KooWDEF...", status: "connected", latency: "45ms" },
  { id: "12D3KooWGHI...", status: "connected", latency: "8ms" },
  { id: "12D3KooWJKL...", status: "connecting", latency: "-" },
  { id: "12D3KooWMNO...", status: "connected", latency: "23ms" },
];

const Peers = () => {
  const [multiaddr, setMultiaddr] = useState("");
  const myPeerId = "12D3KooWMyPeerID123456789ABCDEFG";

  const handleConnect = () => {
    console.log("Connecting to:", multiaddr);
    setMultiaddr("");
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(myPeerId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Network Peers
        </h1>

        <div className="space-y-8 max-w-3xl">
          {/* My Peer ID */}
          <Card className="p-6 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
            <Label className="text-sm text-muted-foreground mb-2 block">
              My Peer ID
            </Label>
            <div className="flex items-center gap-2">
              <code
                id="peerId"
                className="flex-1 px-4 py-2 bg-muted rounded-md font-mono text-sm"
              >
                {myPeerId}
              </code>
              <Button size="icon" variant="outline" onClick={copyPeerId}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Connected Peers */}
          <Card className="p-6 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Connected Peers</h2>
            </div>

            <div id="peersList" className="space-y-3">
              {mockPeers.map((peer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Wifi className="w-4 h-4 text-accent" />
                    <code className="text-sm font-mono">{peer.id}</code>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {peer.latency}
                    </span>
                    <Badge
                      variant={peer.status === "connected" ? "default" : "secondary"}
                    >
                      {peer.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Connect to Peer */}
          <Card className="p-6 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
            <h2 className="text-xl font-semibold mb-4">Connect to Peer</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="peerMultiaddrInput">Peer Multiaddress</Label>
                <Input
                  id="peerMultiaddrInput"
                  type="text"
                  placeholder="/ip4/192.168.1.1/tcp/4001/p2p/12D3KooW..."
                  value={multiaddr}
                  onChange={(e) => setMultiaddr(e.target.value)}
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <Button
                id="connectPeerBtn"
                onClick={handleConnect}
                className="w-full bg-gradient-primary hover:shadow-primary"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Connect Peer
              </Button>
            </div>
          </Card>

          {/* Info Note */}
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> For best
              performance, ensure all peers are on the same WLAN or hotspot
              network. Cross-network connections may have higher latency.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Peers;
