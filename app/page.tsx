"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      padding: 40,
      background: "#f2f2f2",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 20
    }}>
      
      <div
        onClick={() => router.push("/subir-pdf")}
        style={{
          background: "white",
          padding: 40,
          borderRadius: 12,
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        📄 Subir PDF
      </div>

      <div
        onClick={() => router.push("/expediente")}
        style={{
          background: "white",
          padding: 40,
          borderRadius: 12,
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        📁 Ver expediente
      </div>

      <div style={{
        background: "white",
        padding: 40,
        borderRadius: 12
      }}>
        Módulo 3
      </div>

      <div style={{
        background: "white",
        padding: 40,
        borderRadius: 12
      }}>
        Módulo 4
      </div>

    </div>
  );
}