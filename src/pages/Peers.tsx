import { useEffect, useState } from "react";
import { Users, Wifi, Copy, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIPFS } from "@/contexts/IPFSContext";

const Peers = () => {
  const [multiaddr, setMultiaddr] = useState("");
  const [myPeerId, setMyPeerId] = useState<string>("-");
  const [peers, setPeers] = useState<Array<{ id: string; address: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { listPeers, getPeerId, connectPeer } = useIPFS();

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const [id, peerList] = await Promise.all([getPeerId(), listPeers()]);
      setMyPeerId(id);
      setPeers(peerList);
    } catch (e: any) {
      setError(e?.message || "Failed to refresh peers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleConnect = async () => {
    if (!multiaddr.trim()) return;
    try {
      setLoading(true);
      setError(null);
      await connectPeer(multiaddr.trim());
      setMultiaddr("");
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to connect peer");
    } finally {
      setLoading(false);
    }
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(myPeerId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">Network Peers</h1>

        <div className="space-y-8 max-w-3xl">
          <Card className="p-6 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
            <Label className="text-sm text-muted-foreground mb-2 block">My Peer ID</Label>
            <div className="flex items-center gap-2">
              <code id="peerId" className="flex-1 px-4 py-2 bg-muted rounded-md font-mono text-sm">
                {myPeerId}
              </code>
              <Button size="icon" variant="outline" onClick={copyPeerId}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={refresh} disabled={loading}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Connected IPFS Peers</h2>
            </div>

            <div id="peersList" className="space-y-3">
              {peers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading peers..." : "No peers connected"}
                </p>
              )}
              {peers.map((peer, index) => (
                <div key={`${peer.id}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-4 h-4 text-accent" />
                      <span className="font-semibold">Peer ID</span>
                    </div>
                    <code className="font-mono text-xs break-all">{peer.id}</code>
                    <span className="text-xs text-muted-foreground">Address</span>
                    <code className="font-mono text-xs break-all">{peer.address}</code>
                  </div>
                  <Badge>connected</Badge>
                </div>
              ))}
            </div>
          </Card>

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
                disabled={loading || !multiaddr.trim()}
                className="w-full bg-gradient-primary hover:shadow-primary"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Connect Peer
              </Button>
            </div>
          </Card>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Ensure every node runs <code>ipfs daemon</code> and is on the same LAN
              or hotspot for the lowest latency. Use the multiaddress shown above to connect new peers.
            </p>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Peers;

