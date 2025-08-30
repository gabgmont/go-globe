import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LogIn, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LoginModal } from "./LoginModal";
import { ChurchSignupModal } from "./ChurchSignupModal";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [churchSignupModalOpen, setChurchSignupModalOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="bg-background/10 p-2 rounded-lg backdrop-blur-sm">
              <img 
                src="/lovable-uploads/689fa863-e036-4108-8688-3600761b4c59.png" 
                alt="World Mission Link Logo" 
                className="w-8 h-8 object-contain bg-transparent" 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">World Mission Link</h1>
              <p className="text-primary-foreground/80 text-sm">Conectando corações ao redor do mundo</p>
            </div>
          </Link>
          
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.display_name || ''} />
                      <AvatarFallback className="text-xs">
                        {profile?.display_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">
                      {profile?.display_name || user.email}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="w-4 h-4 mr-2" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={() => setChurchSignupModalOpen(true)} 
                  variant="outline"
                  size="sm"
                >
                  <span className="hidden sm:inline">Cadastrar minha igreja</span>
                  <span className="sm:hidden">Igreja</span>
                </Button>
                <Button 
                  onClick={() => setLoginModalOpen(true)} 
                  variant="secondary"
                  size="sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Entrar</span>
                </Button>
              </div>
            )}
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
      
      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen} 
      />
      
      <ChurchSignupModal 
        open={churchSignupModalOpen} 
        onOpenChange={setChurchSignupModalOpen} 
      />
    </header>
  );
};