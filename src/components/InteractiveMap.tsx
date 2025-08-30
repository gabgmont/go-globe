import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";

interface MapPin {
  id: string;
  name: string;
  location: string;
  type: 'missionary' | 'project';
  coordinates: { x: number; y: number };
  status: 'active' | 'preparing' | 'completed';
}

const mockPins: MapPin[] = [
  { id: '1', name: 'Maria Silva', location: 'Moçambique', type: 'missionary', coordinates: { x: 65, y: 45 }, status: 'active' },
  { id: '2', name: 'João Santos', location: 'Bolívia', type: 'missionary', coordinates: { x: 25, y: 65 }, status: 'active' },
  { id: '3', name: 'Escola Rural', location: 'Camboja', type: 'project', coordinates: { x: 75, y: 40 }, status: 'active' },
  { id: '4', name: 'Centro Médico', location: 'Uganda', type: 'project', coordinates: { x: 60, y: 50 }, status: 'completed' },
  { id: '5', name: 'Ana Costa', location: 'Filipinas', type: 'missionary', coordinates: { x: 80, y: 35 }, status: 'preparing' },
];

export const InteractiveMap = () => {
  const getStatusColor = (status: string, type: string) => {
    if (type === 'missionary') {
      switch (status) {
        case 'active': return 'bg-accent border-accent-foreground';
        case 'preparing': return 'bg-impact border-impact-foreground';
        default: return 'bg-muted border-muted-foreground';
      }
    } else {
      switch (status) {
        case 'active': return 'bg-primary border-primary-foreground';
        case 'completed': return 'bg-accent border-accent-foreground';
        default: return 'bg-muted border-muted-foreground';
      }
    }
  };

  return (
    <Card className="relative h-96 bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-card overflow-hidden">
      {/* World Map Silhouette */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          <path
            d="M158 206c12-15 30-25 48-25 18 0 35 8 47 22l25 30c8 10 20 16 32 16s24-6 32-16l15-18c15-18 37-29 61-29s46 11 61 29l12 15c10 12 24 19 39 19s29-7 39-19l8-10c12-15 30-24 49-24s36 9 48 24l5 6c8 10 20 16 32 16s24-6 32-16l10-12c15-18 37-29 61-29s46 11 61 29l8 10c10 12 24 19 39 19s29-7 39-19l15-18c12-15 30-25 48-25 18 0 35 8 47 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary/20"
          />
        </svg>
      </div>

      {/* Map Pins */}
      {mockPins.map((pin) => (
        <div
          key={pin.id}
          className="absolute group cursor-pointer"
          style={{
            left: `${pin.coordinates.x}%`,
            top: `${pin.coordinates.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`w-4 h-4 rounded-full border-2 ${getStatusColor(pin.status, pin.type)} transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg animate-pulse`}>
            <div className="w-full h-full rounded-full bg-current opacity-80"></div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg min-w-48">
              <div className="flex items-center gap-2 mb-1">
                {pin.type === 'missionary' ? (
                  <Users className="w-4 h-4 text-accent" />
                ) : (
                  <MapPin className="w-4 h-4 text-primary" />
                )}
                <span className="font-medium text-sm">{pin.name}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">{pin.location}</div>
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(pin.status, pin.type).replace('bg-', 'text-').replace('border-', 'border-')}`}
              >
                {pin.status === 'active' ? 'Ativo' : 
                 pin.status === 'preparing' ? 'Preparando' : 
                 pin.status === 'completed' ? 'Concluído' : pin.status}
              </Badge>
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium mb-2">Legenda</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-accent border border-accent-foreground"></div>
            <span>Missionários Ativos</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-primary border border-primary-foreground"></div>
            <span>Projetos Ativos</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-impact border border-impact-foreground"></div>
            <span>Em Preparação</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="text-xs font-medium mb-2">Estatísticas</div>
        <div className="space-y-1 text-xs">
          <div>3 Missionários Ativos</div>
          <div>2 Projetos em Andamento</div>
          <div>12 Países Alcançados</div>
        </div>
      </div>
    </Card>
  );
};