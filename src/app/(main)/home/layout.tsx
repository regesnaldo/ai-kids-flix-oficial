export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        zIndex: 99999,
        background: '#000000',
        backdropFilter: 'none',
        opacity: 1,
      }} />
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        overflowY: 'auto',
      }}>
        {children}
      </div>
    </>
  )
}
