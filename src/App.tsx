import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import MissionaryProfile from "./pages/MissionaryProfile";
import Profile from "./pages/Profile";
import ChurchProfile from "./pages/ChurchProfile";
import MissionaryApplication from "./pages/MissionaryApplication";
import NewMission from "./pages/NewMission";
import MissionEdit from "./pages/MissionEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/missionary/:id" element={<MissionaryProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/church-profile" element={<ChurchProfile />} />
            <Route path="/missionary-application" element={<MissionaryApplication />} />
            <Route path="/new-mission" element={<NewMission />} />
            <Route path="/mission/:id" element={<MissionEdit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
