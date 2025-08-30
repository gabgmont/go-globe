import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, LogIn } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-background/10 p-2 rounded-lg backdrop-blur-sm">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">World Mission Link</h1>
              <p className="text-primary-foreground/80 text-sm">Conectando corações ao redor do mundo</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md ml-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar missionários, projetos..."
                className="pl-10 bg-background/10 border-background/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-background/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Entrar</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar missionários, projetos..."
              className="pl-10 bg-background/10 border-background/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
          </div>
        </div>
      </div>
    </header>
  );
};