 import { useEffect, useState } from "react";
import AppRouter from "./routes";
import { useSessionQuery } from "./hooks/useAuth";
import { useAppStore } from "./store/useAppStore";
import DragonLoader from "./components/DragonLoader";

const MIN_LOADER_MS = Number(import.meta.env.VITE_MIN_LOADER_MS ?? "5000");

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
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), MIN_LOADER_MS);
    return () => clearTimeout(t);
  }, []);

  const ready = isInitialized && minElapsed;

  return (
    <>
      <SessionProvider />
      {ready ? (
        <AppRouter />
      ) : (
        <DragonLoader />
      )}
    </>
  );
}

export default App;
