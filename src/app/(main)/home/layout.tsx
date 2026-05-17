export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', background: '#0a0a1a' }}>
      {children}
    </div>
  )
}
