import { useState } from "react";
import { Key, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Access = () => {
  const [grantFileId, setGrantFileId] = useState("");
  const [grantAddress, setGrantAddress] = useState("");
  const [revokeFileId, setRevokeFileId] = useState("");
  const [revokeAddress, setRevokeAddress] = useState("");

  const handleGrant = () => {
    if (!grantFileId || !grantAddress) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Access granted to ${grantAddress} for file ${grantFileId}`,
    });
    
    setGrantFileId("");
    setGrantAddress("");
  };

  const handleRevoke = () => {
    if (!revokeFileId || !revokeAddress) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Access revoked from ${revokeAddress} for file ${revokeFileId}`,
    });
    
    setRevokeFileId("");
    setRevokeAddress("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Access Management
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          {/* Grant Access Form */}
          <Card className="p-8 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Key className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Grant Access</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fileIdInput">File ID</Label>
                <Input
                  id="fileIdInput"
                  type="text"
                  placeholder="Enter file ID"
                  value={grantFileId}
                  onChange={(e) => setGrantFileId(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="grantAddressInput">Wallet Address</Label>
                <Input
                  id="grantAddressInput"
                  type="text"
                  placeholder="0x..."
                  value={grantAddress}
                  onChange={(e) => setGrantAddress(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleGrant}
                className="w-full bg-gradient-primary hover:shadow-primary"
              >
                <Key className="w-4 h-4 mr-2" />
                Grant Access
              </Button>
            </div>
          </Card>

          {/* Revoke Access Form */}
          <Card className="p-8 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold">Revoke Access</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="revokeFileIdInput">File ID</Label>
                <Input
                  id="revokeFileIdInput"
                  type="text"
                  placeholder="Enter file ID"
                  value={revokeFileId}
                  onChange={(e) => setRevokeFileId(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="revokeAddressInput">Wallet Address</Label>
                <Input
                  id="revokeAddressInput"
                  type="text"
                  placeholder="0x..."
                  value={revokeAddress}
                  onChange={(e) => setRevokeAddress(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleRevoke}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke Access
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Access;
