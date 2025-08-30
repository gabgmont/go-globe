import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Heart, Target } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "127",
      label: "Missionários Ativos",
      color: "text-accent"
    },
    {
      icon: MapPin,
      value: "43",
      label: "Países Alcançados",
      color: "text-primary"
    },
    {
      icon: Target,
      value: "89",
      label: "Projetos Ativos",
      color: "text-impact"
    },
    {
      icon: Heart,
      value: "R$ 2.3M",
      label: "Apoio Arrecadado",
      color: "text-destructive"
    }
  ];

  return (
    <div className="py-12 bg-gradient-to-r from-secondary/30 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-card bg-background/80 backdrop-blur-sm hover:shadow-card-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-full bg-background shadow-md ${stat.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};