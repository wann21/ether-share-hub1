import { useState } from "react";
import { Upload as UploadIcon } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");

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

    setIsUploading(true);
    setStatus("Uploading to IPFS...");
    
    // Simulate upload
    setTimeout(() => {
      setStatus(`✓ ${selectedFile.name} uploaded successfully!`);
      setIsUploading(false);
      setSelectedFile(null);
    }, 2000);
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
                disabled={isUploading || !selectedFile}
                className="w-full bg-gradient-primary hover:shadow-primary"
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload to IPFS"}
              </Button>
            </Card>

            <div
              id="statusArea"
              className="p-4 rounded-lg bg-muted/50 min-h-[100px]"
            >
              <h3 className="font-semibold mb-2">Status</h3>
              <p className="text-sm text-muted-foreground">
                {status || "No file selected"}
              </p>
            </div>
          </div>

          {/* Right Column: Help Card */}
          <Card className="p-8 bg-[var(--glass-bg)] backdrop-blur-glass border-border h-fit">
            <h2 className="text-xl font-semibold mb-4">Upload Tips</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Maximum file size: 5GB per file</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Files are encrypted before upload to IPFS</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>You'll receive a unique CID (Content Identifier)</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Grant access to specific addresses after upload</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                <span>Files are permanently stored on the network</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
