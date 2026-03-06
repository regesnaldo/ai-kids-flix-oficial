import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeModeProvider } from "./contexts/ThemeModeContext";
import Home from "./pages/Home";
import NetflixHome from "./pages/NetflixHome";
import ModuleDetail from "./pages/ModuleDetail";
import AdminUpload from "./pages/AdminUpload";
import Planos from "./pages/Planos";
import PlayerTest from "./pages/PlayerTest";
import HistoryPage from "./pages/HistoryPage";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/netflix"} component={NetflixHome} />
      <Route path={"/modulo/:id"} component={ModuleDetail} />
      <Route path={"/admin"} component={AdminUpload} />
      <Route path={"/planos"} component={Planos} />
      <Route path={"/player-test"} component={PlayerTest} />
      <Route path={"/historico"} component={HistoryPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <ThemeModeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeModeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
