import { Upload, File } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const FileUploadZone = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
  };

  return (
    <section id="upload" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Upload & Share
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Drag and drop your files or click to browse
          </p>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-3xl border-2 border-dashed transition-all p-12 ${
              isDragging
                ? "border-accent bg-accent/10 shadow-accent"
                : "border-border bg-[var(--glass-bg)] backdrop-blur-glass"
            }`}
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-6 shadow-accent">
                <Upload className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drop files here</h3>
              <p className="text-muted-foreground mb-6">or click to browse from your device</p>
              <Button size="lg" className="bg-gradient-primary hover:shadow-primary transition-all">
                <File className="w-5 h-5 mr-2" />
                Select Files
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Maximum file size: 5GB per file
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileUploadZone;
