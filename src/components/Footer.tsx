import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre Nós */}
          <div>
            <h3 className="text-lg font-bold text-secondary-foreground mb-4">Sobre Nós</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Somos uma organização dedicada a apoiar missões e missionários ao redor do mundo, 
              conectando corações generosos com projetos que transformam vidas.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Youtube className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold text-secondary-foreground mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Início
                </a>
              </li>
              <li>
                <a href="/projetos" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Projetos
                </a>
              </li>
              <li>
                <a href="/missionarios" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Missionários
                </a>
              </li>
              <li>
                <a href="/missoes" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Oportunidades
                </a>
              </li>
              <li>
                <a href="/apoio" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Como Apoiar
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-bold text-secondary-foreground mb-4">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">+55 (11) 1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">contato@missoes.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  Rua das Missões, 123<br />
                  São Paulo, SP - Brasil
                </span>
              </div>
            </div>
          </div>

          {/* Transparência */}
          <div>
            <h3 className="text-lg font-bold text-secondary-foreground mb-4">Transparência</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/prestacao-contas" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Prestação de Contas
                </a>
              </li>
              <li>
                <a href="/relatorios" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Relatórios Anuais
                </a>
              </li>
              <li>
                <a href="/politica-privacidade" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/termos-uso" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="/codigo-etica" className="text-muted-foreground hover:text-secondary-foreground transition-smooth">
                  Código de Ética
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha de separação e copyright */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>
              © 2024 Missões Globais. Todos os direitos reservados.
            </p>
            <p className="mt-2 md:mt-0">
              CNPJ: 12.345.678/0001-90 | Organização sem fins lucrativos
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};