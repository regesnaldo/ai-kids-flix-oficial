import type { ReactNode } from "react";

import AudioController from "@/components/laboratorio/AudioController";
import AudioWelcome from "@/components/laboratorio/AudioWelcome";
import SignatureWatermark from "@/components/laboratorio/SignatureWatermark";

export default function LaboratorioLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <AudioController />
      <AudioWelcome />
      <SignatureWatermark />
    </>
  );
}
