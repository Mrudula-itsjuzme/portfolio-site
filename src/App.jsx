import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";
import CredibilityDock from "./components/CredibilityDock";

export default function App() {
  return (
    <ErrorBoundary>
      <Home />
      <CredibilityDock />
    </ErrorBoundary>
  );
}
