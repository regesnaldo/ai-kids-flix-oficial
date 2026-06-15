"use client"

import { useEffect } from "react"

export default function Cadastro() {
  useEffect(() => {
    // Redireciona para /login com aba de cadastro aberta
    window.location.href = "/login"
  }, [])

  return (
    <main style={{ 
      backgroundColor: "#0a0e27", 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      <p style={{ color: "#00d4ff" }}>Redirecionando para cadastro...</p>
    </main>
  )
}