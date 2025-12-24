import { useState } from "react";
import { Upload as UploadIcon } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useIPFS } from "@/contexts/IPFSContext";
import { useEthereum } from "@/contexts/EthereumContext";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [cid, setCid] = useState<string | null>(null);

  const { uploadFile, isLoading: ipfsLoading, error: ipfsError } = useIPFS();
  const { connectWallet, account, isConnected, uploadMetadata, contract } = useEthereum();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatus(`Selected: ${e.target.files[0].name}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus("Please select a file first");
      return;
    }
    try {
      setIsUploading(true);
      setStatus("Uploading to IPFS...");
      const uploadedCid = await uploadFile(selectedFile);
      setCid(uploadedCid);
      setStatus(`Uploaded to IPFS. CID: ${uploadedCid}. Saving metadata to blockchain...`);

      if (!isConnected) {
        await connectWallet();
      }
      // Wait briefly until contract is initialized in state (React setState is async)
      if (!contract) {
        for (let i = 0; i < 40 && !contract; i++) {
          // ~2s max
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 50));
        }
      }
      await uploadMetadata(selectedFile.name, uploadedCid);
      setStatus(`Success! On-chain metadata saved for ${selectedFile.name}. CID: ${uploadedCid}`);
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      setStatus(err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Upload Files
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: File Picker & Status */}
          <div className="space-y-6">
            <Card className="p-8 bg-[var(--glass-bg)] backdrop-blur-glass border-border">
              <h2 className="text-xl font-semibold mb-4">Select File</h2>

              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="w-full mb-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
              />

              <Button
                id="uploadButton"
                onClick={handleUpload}
                disabled={isUploading || ipfsLoading || !selectedFile}
                className="w-full bg-gradient-primary hover:shadow-primary"
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                {isUploading || ipfsLoading ? "Uploading..." : "Upload to IPFS + Save to Chain"}
              </Button>

              <div className="mt-4 text-sm text-muted-foreground">
                {!isConnected ? (
                  <Button variant="outline" onClick={connectWallet} className="w-full">
                    Connect MetaMask (Ganache)
                  </Button>
                ) : (
                  <p>Connected: {account}</p>
                )}
              </div>
            </Card>

            <div
              id="statusArea"
              className="p-4 rounded-lg bg-muted/50 min-h-[100px]"
            >
              <h3 className="font-semibold mb-2">Status</h3>
              <p className="text-sm text-muted-foreground">
                {status || "No file selected"}
              </p>
              {ipfsError && (
                <p className="text-sm text-red-500 mt-2">IPFS Error: {ipfsError}</p>
              )}
              {cid && (
                <p className="text-sm mt-2">
                  CID: <code className="font-mono">{cid}</code>
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Help Card */}
          <Card className="p-8 bg-[var(--glass-bg)] backdrop-blur-glass border-border h-fit">
            <h2 className="text-xl font-semibold mb-4">Upload Tips</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start"><span className="text-accent mr-2">•</span><span>Maximum file size: 5GB per file</span></li>
              <li className="flex items-start"><span className="text-accent mr-2">•</span><span>Uploads return a unique CID (Content Identifier)</span></li>
              <li className="flex items-start"><span className="text-accent mr-2">•</span><span>Grant access to specific addresses after upload</span></li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
