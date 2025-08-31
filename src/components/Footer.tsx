import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold mb-4">Sobre Nós</h3>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              Conectamos corações generosos com missionários dedicados, 
              transformando vidas ao redor do mundo através do amor e solidariedade.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-primary" />
              <span>Fazendo a diferença desde 2020</span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Como Apoiar</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Nossos Projetos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Missionários</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Transparência</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Relatórios</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@missoes.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Newsletter e Redes Sociais */}
          <div>
            <h3 className="text-lg font-bold mb-4">Mantenha-se Conectado</h3>
            <p className="text-sm text-secondary-foreground/80 mb-4">
              Receba atualizações sobre nossos projetos e impacto.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="outline" size="sm" className="border-secondary-foreground/20 text-secondary-foreground hover:bg-primary hover:text-primary-foreground">
                Assinar Newsletter
              </Button>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="p-2 border-secondary-foreground/20 hover:bg-primary hover:text-primary-foreground">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 border-secondary-foreground/20 hover:bg-primary hover:text-primary-foreground">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="p-2 border-secondary-foreground/20 hover:bg-primary hover:text-primary-foreground">
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória e copyright */}
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/70">
            <div>
              © 2024 Missões Globais. Todos os direitos reservados.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};