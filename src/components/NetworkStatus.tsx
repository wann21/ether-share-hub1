import { Activity, Users, HardDrive } from "lucide-react";

const NetworkStatus = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Network Status
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <StatusCard
              icon={<Activity className="w-6 h-6" />}
              label="Network Speed"
              value="124 MB/s"
              status="optimal"
            />
            <StatusCard
              icon={<Users className="w-6 h-6" />}
              label="Connected Peers"
              value="1,247"
              status="optimal"
            />
            <StatusCard
              icon={<HardDrive className="w-6 h-6" />}
              label="Storage Used"
              value="28.4 GB"
              status="normal"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatusCard = ({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: "optimal" | "normal";
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-glass shadow-glass">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-accent">{icon}</div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <div
          className={`w-2 h-2 rounded-full ${
            status === "optimal" ? "bg-accent" : "bg-primary"
          } animate-pulse`}
        />
      </div>
    </div>
  );
};

export default NetworkStatus;
