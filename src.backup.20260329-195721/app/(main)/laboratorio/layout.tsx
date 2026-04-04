import type { ReactNode } from "react";
import SignatureWatermark from "@/components/laboratorio/SignatureWatermark";

export default function LaboratorioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}<SignatureWatermark />
    </>
  );
}

