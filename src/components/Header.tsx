import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LoginModal } from "./LoginModal";
import { ChurchSignupModal } from "./ChurchSignupModal";
import { Navigation } from "./Navigation";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header = ({ activeTab, onTabChange }: HeaderProps) => {
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
          {/* Navigation on the left - only show if props are provided */}
          {activeTab && onTabChange && (
            <div className="flex-1">
              <Navigation activeTab={activeTab} onTabChange={onTabChange} />
            </div>
          )}
          {!activeTab && <div className="flex-1" />}
          
          {/* Centered Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity cursor-pointer">
            <img 
              src="/lovable-uploads/689fa863-e036-4108-8688-3600761b4c59.png" 
              alt="World Mission Link Logo" 
              className="w-12 h-12 object-contain" 
            />
          </Link>
          
          {/* User actions on the right */}
          <div className="flex items-center gap-3 flex-1 justify-end">
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
                  <span className="hidden sm:inline">Cadastrar minha instituição</span>
                  <span className="sm:hidden">Instituição</span>
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