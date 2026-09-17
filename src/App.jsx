import LabPage from "./components/lab/LabPage";
import LabCursor from "./components/lab/LabCursor";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <LabPage />
      <LabCursor />
    </ErrorBoundary>
  );
}
