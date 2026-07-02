import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DashboardProvider>
          <Dashboard />
        </DashboardProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;