"use client";

import ParticleFieldBase from "@/components/simulador/ParticleField";

interface Props {
  interactive?: boolean;
  count?: number;
}

export default function ParticleField(_props: Props) {
  return <ParticleFieldBase emotion="neutro" type="floating" />;
}
