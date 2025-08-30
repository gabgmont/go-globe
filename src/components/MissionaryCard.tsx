import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MissionaryCardProps {
  id: string;
  name: string;
  location: string;
  mission: string;
  startDate: string;
  supporters: number;
  monthlySupport: number;
  avatar: string;
  specialization: string;
  status: 'active' | 'preparing' | 'returning';
}

export const MissionaryCard = ({
  id,
  name,
  location,
  mission,
  startDate,
  supporters,
  monthlySupport,
  avatar,
  specialization,
  status
}: MissionaryCardProps) => {
  const navigate = useNavigate();
  
  const statusConfig = {
    active: { label: 'Ativo', color: 'bg-accent text-accent-foreground' },
    preparing: { label: 'Preparando', color: 'bg-impact text-impact-foreground' },
    returning: { label: 'Retornando', color: 'bg-muted text-muted-foreground' }
  };

  const handleCardClick = () => {
    navigate(`/missionary/${id}`);
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-card bg-gradient-to-br from-card to-card/95 cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="text-center pb-2">
        <div className="relative mx-auto">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300 mx-auto">
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <Badge className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs ${statusConfig[status].color}`}>
            {statusConfig[status].label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="text-center px-4 pb-2">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <Badge variant="outline" className="mb-3 text-xs">
          {specialization}
        </Badge>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Desde {startDate}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
          {mission}
        </p>
        
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{supporters} apoiadores</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-accent">R$ {monthlySupport.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">mensais</div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2">
        <div className="flex gap-2 w-full">
          <Button variant="support" className="flex-1">
            Apoiar Mensalmente
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};