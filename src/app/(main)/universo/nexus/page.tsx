import dynamic from 'next/dynamic'

const NexusClientPage = dynamic(
  () => import('./NexusClientPage'),
  { ssr: false }
)

export default function NexusServerPage() {
  return <NexusClientPage />
}
