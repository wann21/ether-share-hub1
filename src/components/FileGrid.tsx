import { Download, Share2, FileText, Image, Film, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockFiles = [
  {
    id: 1,
    name: "Project_Presentation.pdf",
    size: "2.4 MB",
    type: "pdf",
    date: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    name: "Summer_Vacation.jpg",
    size: "4.1 MB",
    type: "image",
    date: "1 day ago",
    status: "completed",
  },
  {
    id: 3,
    name: "Tutorial_Video.mp4",
    size: "125 MB",
    type: "video",
    date: "3 days ago",
    status: "seeding",
  },
  {
    id: 4,
    name: "Podcast_Episode.mp3",
    size: "48 MB",
    type: "audio",
    date: "1 week ago",
    status: "completed",
  },
];

const FileGrid = () => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-6 h-6" />;
      case "video":
        return <Film className="w-6 h-6" />;
      case "audio":
        return <Music className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <section id="files" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">My Files</h2>
              <p className="text-muted-foreground">
                {mockFiles.length} files shared on the network
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFiles.map((file) => (
              <div
                key={file.id}
                className="group p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-glass shadow-glass hover:shadow-primary transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        file.status === "completed" ? "bg-accent" : "bg-primary animate-pulse"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground capitalize">
                      {file.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold mb-1 truncate group-hover:text-primary transition-colors">
                  {file.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.date}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-secondary hover:bg-secondary/80"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border hover:bg-secondary/50"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileGrid;
