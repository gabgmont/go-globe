import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Target, Users, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ProjectContributionModal } from "./ProjectContributionModal";

interface ProjectCardProps {
  id: string;
  title: string;
  location: string;
  description: string;
  category: string;
  progress: number;
  goal: number;
  supporters: number;
  image?: string;
  urgent?: boolean;
  missionaryId?: string;
  objectiveType?: string;
  showContributionModal?: boolean; // Novo prop para controlar se deve mostrar modal ou redirecionar
}

export const ProjectCard = ({
  id,
  title,
  location,
  description,
  category,
  progress,
  goal,
  supporters,
  image,
  urgent = false,
  missionaryId = "1",
  objectiveType,
  showContributionModal = false
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const progressPercentage = (progress / goal) * 100;
  const isMaterialDonation = objectiveType === 'material';

  const handleProjectClick = () => {
    navigate(`/missionary/${missionaryId}?tab=projects`);
  };

  const handleContributeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (showContributionModal) {
      // Se estamos na página de detalhes do missionário, abre a modal
      console.log('Abrindo modal de contribuição...');
      // window.open('https://buy.stripe.com/test_8x23cx4VbfQ3dgCeXi5J601', "_blank", "noopener,noreferrer")
      setIsContributionModalOpen(true);
    } else {
      // Se estamos na homepage, redireciona para a página do missionário na aba de projetos
      console.log('Redirecionando para página do missionário...');
      navigate(`/missionary/${missionaryId}?tab=projects`);
    }
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-card bg-gradient-to-br from-card to-card/95">{/* Removed cursor-pointer and onClick from Card */}
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg h-48 bg-gradient-to-br from-primary/10 to-accent/10">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <Target className="w-16 h-16 text-primary/40" />
            </div>
          )}
          {urgent && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground shadow-md">
              Urgente
            </Badge>
          )}
          <Badge className="absolute top-3 left-3 bg-background/90 text-foreground shadow-md">
            {category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pb-2">
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
          <span className="text-sm text-muted-foreground">{location}</span>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {description}
        </p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent to-accent-glow h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{supporters} apoiadores</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-accent">
                {isMaterialDonation ? progress?.toLocaleString() : `R$ ${progress?.toLocaleString()}`}
              </div>
              <div className="text-xs text-muted-foreground">
                de {isMaterialDonation ? goal.toLocaleString() : `R$ ${goal.toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2">
        <div className="flex gap-2 w-full">
          <Button 
            variant="support" 
            className="flex-1"
            onClick={handleContributeClick}
          >
            <Heart className="w-4 h-4" />
            Contribuir
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleProjectClick();
            }}
          >
            Ver mais
          </Button>
        </div>
      </CardFooter>

      {showContributionModal && (
        <ProjectContributionModal
          isOpen={isContributionModalOpen}
          onClose={() => setIsContributionModalOpen(false)}
          projectId={id}
          projectName={title}
        />
      )}
    </Card>
  );
};