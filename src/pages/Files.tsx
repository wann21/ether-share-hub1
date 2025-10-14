import { useState } from "react";
import { Download, Key, Trash2 } from "lucide-react";
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

const mockFiles = [
  {
    id: "1",
    name: "project-proposal.pdf",
    cid: "Qm...abc123",
    size: "2.4 MB",
    uploader: "0x1234...5678",
    timestamp: "2025-01-10 14:30",
  },
  {
    id: "2",
    name: "design-assets.zip",
    cid: "Qm...def456",
    size: "15.8 MB",
    uploader: "0x1234...5678",
    timestamp: "2025-01-09 09:15",
  },
  {
    id: "3",
    name: "whitepaper.docx",
    cid: "Qm...ghi789",
    size: "1.2 MB",
    uploader: "0x9876...5432",
    timestamp: "2025-01-08 16:45",
  },
];

const Files = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
          <Table id="filesTable">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>CID</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploader</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-mono text-xs">{file.id}</TableCell>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell className="font-mono text-xs">{file.cid}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell className="font-mono text-xs">{file.uploader}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {file.timestamp}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="downloadBtn"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="grantBtn"
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="revokeBtn"
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
