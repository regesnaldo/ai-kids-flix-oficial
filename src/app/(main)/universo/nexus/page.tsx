'use client'

import dynamic from 'next/dynamic'
import { useRegisterPresence } from '@/hooks/usePresence'

const NexusCosmos = dynamic(
  () => import('@/components/universo/NexusCosmos'),
  { ssr: false }
)

export default function NexusPage() {
  useRegisterPresence("nexus");
  return <NexusCosmos />
}
