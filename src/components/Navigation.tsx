import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, FolderOpen, Users, MapPin, Heart } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'projetos', label: 'Projetos', icon: FolderOpen },
    { id: 'missionarios', label: 'Missionários', icon: Users }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="flex w-fit  backdrop-blur-sm">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:outline outline-black-500 data-[state=active]:text-primary-foreground transition-all duration-300 text-primary-foreground/80 hover:text-primary-foreground"
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden lg:inline">{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};