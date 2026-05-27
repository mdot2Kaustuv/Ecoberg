import { LandingPage } from "./pages/LandingPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ExplorerPage } from "./pages/ExplorerPage.jsx";
import { ComparePage } from "./pages/ComparePage.jsx";
import { PerCapitaPage } from "./pages/PerCapitaPage.jsx";
import { SourcesPage } from "./pages/SourcesPage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { Shell } from "./components/Shell.jsx";
import { useRoute } from "./hooks/useRoute.js";

function App() {
  const [route, navigate] = useRoute();

  if (route === "home") {
    return <LandingPage navigate={navigate} />;
  }

  return (
    <Shell route={route} navigate={navigate}>
      {route === "dashboard" && <DashboardPage navigate={navigate} />}
      {route === "explorer" && <ExplorerPage />}
      {route === "compare" && <ComparePage />}
      {route === "perCapita" && <PerCapitaPage />}
      {route === "sources" && <SourcesPage />}
      {route === "about" && <AboutPage />}
      {route === "admin" && <AdminPage />}
    </Shell>
  );
}

export default App;
