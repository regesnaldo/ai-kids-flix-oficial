'use client'

import dynamic from 'next/dynamic'

const NexusCosmos = dynamic(
  () => import('@/components/universo/NexusCosmos'),
  { ssr: false }
)

export default function NexusPage() {
  return <NexusCosmos />
}
