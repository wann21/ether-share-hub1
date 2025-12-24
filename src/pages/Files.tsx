import { useEffect, useMemo, useState } from "react";
import { Download, Key, Trash2, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEthereum } from "@/contexts/EthereumContext";
import { useIPFS } from "@/contexts/IPFSContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type ChainFile = { fileName: string; fileHash: string; timestamp: number; txHash?: string };

const Files = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<ChainFile[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<Array<{ owner: string; fileName: string; fileHash: string; timestamp: number; txHash?: string }>>([]);
  const [sharedByMe, setSharedByMe] = useState<Array<{ owner: string; fileName: string; fileHash: string; timestamp: number; txHash?: string }>>([]);

  const { isConnected, account, connectWallet, getMyFiles, getSharedWithMe, getMyShares, grantAccess, revokeAccess } = useEthereum();
  const { downloadFile } = useIPFS();

  const [manageOpen, setManageOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<ChainFile | null>(null);
  const [targetAddress, setTargetAddress] = useState<string>("");
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const knownAddresses = [
    { label: "PC-A (0x2363...c9ff)", value: "0x23632e03BAD7C03ED9531d325645Bb1ebE2Ec9Ff" },
    { label: "PC-B (0x40bb...5840)", value: "0x40bb29b81b23aa71413d7C224aC75492B65a5840" },
    { label: "PC-C (0xC91c...3D8e)", value: "0xC91c2393F80A37C99CeC6C3CabbED65703F13D8e" },
    { label: "PC-D (0xBb3D...b420)", value: "0xBb3DC2c02Ec56A68Ac5E6D6F010ed607f331b420" }
  ];

  const shortHash = (h?: string) => {
    if (!h) return "-";
    return `${h.slice(0, 10)}...${h.slice(-6)}`;
  };

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getMyFiles();
      setFiles(items);
    } catch (e: any) {
      setError(e?.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) void refresh();
  }, [isConnected]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.fileName.toLowerCase().includes(q) || f.fileHash.toLowerCase().includes(q));
  }, [files, searchQuery]);

  const handleDownload = async (f: ChainFile) => {
    try {
      const blob = await downloadFile(f.fileHash);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.fileName || f.fileHash;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (e) {
      console.error(e);
    }
  };

  const openManage = (f: ChainFile) => {
    setActiveFile(f);
    setTargetAddress("");
    setTxError(null);
    setManageOpen(true);
  };

  const isAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const onGrant = async () => {
    if (!activeFile) return;
    if (!isAddress(targetAddress)) {
      setTxError("Enter a valid Ethereum address (0x...)");
      return;
    }
    try {
      setTxLoading(true);
      setTxError(null);
      await grantAccess(activeFile.fileHash, targetAddress.trim());
      setManageOpen(false);
    } catch (e: any) {
      setTxError(e?.message || "Grant failed");
    } finally {
      setTxLoading(false);
    }
  };

  const onRevoke = async () => {
    if (!activeFile) return;
    if (!isAddress(targetAddress)) {
      setTxError("Enter a valid Ethereum address (0x...)");
      return;
    }
    try {
      setTxLoading(true);
      setTxError(null);
      await revokeAccess(activeFile.fileHash, targetAddress.trim());
      setManageOpen(false);
    } catch (e: any) {
      setTxError(e?.message || "Revoke failed");
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
          My Files
        </h1>

        <div className="mb-6">
          <Input
            id="filesSearch"
            type="search"
            placeholder="Search files by name or CID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="rounded-lg border border-border bg-[var(--glass-bg)] backdrop-blur-glass overflow-hidden">
          <div className="flex items-center justify-between p-3">
            <div className="text-sm text-muted-foreground">
              {isConnected ? `Connected: ${account}` : "Not connected"}
            </div>
            <div className="flex gap-2">
              {!isConnected && (
                <Button variant="outline" onClick={connectWallet}>Connect Wallet</Button>
              )}
              <Button size="icon" variant="secondary" onClick={refresh} disabled={loading || !isConnected}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Table id="filesTable">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>CID</TableHead>
                <TableHead>Grant Tx</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-red-500">{error}</TableCell>
                </TableRow>
              )}
              {!error && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">{loading ? 'Loading...' : 'No files found'}</TableCell>
                </TableRow>
              )}
              {filtered.map((file, idx) => (
                <TableRow key={`${file.fileHash}-${idx}`}>
                  <TableCell className="font-medium">{file.fileName}</TableCell>
                  <TableCell className="font-mono text-xs break-all">{file.fileHash}</TableCell>
                  <TableCell className="font-mono text-xs">{shortHash(file.txHash)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(file.timestamp * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" className="downloadBtn" onClick={() => handleDownload(file)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="grantBtn" onClick={() => openManage(file)} disabled={!isConnected}>
                        <Key className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border border-border bg-[var(--glass-bg)] backdrop-blur-glass overflow-hidden mt-10">
          <div className="flex items-center justify-between p-3">
            <h2 className="text-lg font-semibold">Shared With Me</h2>
            <div className="flex gap-2">
              {!isConnected && (
                <Button variant="outline" onClick={connectWallet}>Connect Wallet</Button>
              )}
              <Button
                size="icon"
                variant="secondary"
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    const items = await getSharedWithMe();
                    setSharedWithMe(items);
                  } catch (e: any) {
                    setError(e?.message || 'Failed to load shared files');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading || !isConnected}
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Table id="sharedTable">
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>CID</TableHead>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error && (
                <TableRow>
                  <TableCell colSpan={6} className="text-red-500">{error}</TableCell>
                </TableRow>
              )}
              {!error && sharedWithMe.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">{loading ? 'Loading...' : 'No shared files'}</TableCell>
                </TableRow>
              )}
              {sharedWithMe.map((file, idx) => (
                <TableRow key={`${file.owner}-${file.fileHash}-${idx}`}>
                  <TableCell className="font-mono text-xs">{file.owner}</TableCell>
                  <TableCell className="font-medium">{file.fileName || '(no name)'}</TableCell>
                  <TableCell className="font-mono text-xs break-all">{file.fileHash}</TableCell>
                  <TableCell className="font-mono text-xs">{shortHash(file.txHash)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{file.timestamp ? new Date(file.timestamp * 1000).toLocaleString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(file)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border border-border bg-[var(--glass-bg)] backdrop-blur-glass overflow-hidden mt-10">
          <div className="flex items-center justify-between p-3">
            <h2 className="text-lg font-semibold">Shared By Me</h2>
            <div className="flex gap-2">
              {!isConnected && (
                <Button variant="outline" onClick={connectWallet}>Connect Wallet</Button>
              )}
              <Button
                size="icon"
                variant="secondary"
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    const items = await getMyShares();
                    setSharedByMe(items.map(i => ({ owner: i.user, fileName: i.fileName, fileHash: i.fileHash, timestamp: i.timestamp, txHash: i.txHash })));
                  } catch (e: any) {
                    setError(e?.message || 'Failed to load my shares');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading || !isConnected}
              >
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Table id="mySharesTable">
            <TableHeader>
              <TableRow>
                <TableHead>Grantee</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>CID</TableHead>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {error && (
                <TableRow>
                  <TableCell colSpan={6} className="text-red-500">{error}</TableCell>
                </TableRow>
              )}
              {!error && sharedByMe.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">{loading ? 'Loading...' : 'No active shares'}</TableCell>
                </TableRow>
              )}
              {sharedByMe.map((file, idx) => (
                <TableRow key={`mine-${file.owner}-${file.fileHash}-${idx}`}>
                  <TableCell className="font-mono text-xs">{file.owner}</TableCell>
                  <TableCell className="font-medium">{file.fileName || '(no name)'}</TableCell>
                  <TableCell className="font-mono text-xs break-all">{file.fileHash}</TableCell>
                  <TableCell className="font-mono text-xs">{shortHash(file.txHash)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{file.timestamp ? new Date(file.timestamp * 1000).toLocaleString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            setLoading(true);
                            await revokeAccess(file.fileHash, file.owner);
                            const items = await getMyShares();
                            setSharedByMe(
                              items.map((i) => ({
                                owner: i.user,
                                fileName: i.fileName,
                                fileHash: i.fileHash,
                                timestamp: i.timestamp,
                                txHash: i.txHash,
                              }))
                            );
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={manageOpen} onOpenChange={setManageOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Access</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="addr">Target address</Label>
                <div className="flex flex-col gap-2">
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                  >
                    <option value="">Select known address</option>
                    {knownAddresses.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                  <Input
                    id="addr"
                    placeholder="0x..."
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                  />
                </div>
              </div>
              {activeFile && (
                <div className="text-xs text-muted-foreground">
                  File: <code className="font-mono">{activeFile.fileName}</code>
                  <br />
                  CID: <code className="font-mono break-all">{activeFile.fileHash}</code>
                </div>
              )}
              {txError && <div className="text-sm text-red-500">{txError}</div>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onRevoke} disabled={txLoading || !isConnected}>
                <Trash2 className="w-4 h-4 mr-2" /> Revoke
              </Button>
              <Button onClick={onGrant} disabled={txLoading || !isConnected}>
                <Key className="w-4 h-4 mr-2" /> Grant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page 1 of 1</span>
          <Button variant="outline" disabled>
            Next
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Files;
