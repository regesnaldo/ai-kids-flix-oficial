import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Home Page - Redireciona para Netflix Home
 * A rota raiz (/) agora aponta para a homepage Netflix premium
 */
export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirecionar para a homepage Netflix
    setLocation("/netflix");
  }, [setLocation]);

  return null;
}
