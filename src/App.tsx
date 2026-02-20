import { useEffect } from "react";
import AppRouter from "./routes";
import { useSessionQuery } from "./hooks/useAuth";
import { useAppStore } from "./store/useAppStore";

function SessionProvider() {
  const setUser = useAppStore((s) => s.setUser);
  const setInitialized = useAppStore((s) => s.setInitialized);
  const { data, isError } = useSessionQuery();

  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  useEffect(() => {
    if (data || isError) setInitialized(true);
  }, [data, isError, setInitialized]);

  return null;
}

function App() {
  const isInitialized = useAppStore((s) => s.isInitialized);

  return (
    <>
      <SessionProvider />
      {isInitialized ? (
        <AppRouter />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-surface-base">
          <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
        </div>
      )}
    </>
  );
}

export default App;
