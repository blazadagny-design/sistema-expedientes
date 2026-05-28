"use client";
import { useRouter } from "next/navigation";

const expedientes = [
  {
    id: "001-2026",
    materia: "Civil",
    estado: "Admisión de demanda",
    juzgado: "2° Juzgado Civil de Puno",
    fecha: "2026-01-10",
    demandante: "Juan Pérez",
    demandado: "María Quispe",
    etapa: "Postulatoria",
  },
  {
    id: "002-2026",
    materia: "Penal",
    estado: "Investigación preliminar",
    juzgado: "Fiscalía Provincial Penal",
    fecha: "2026-02-03",
    demandante: "Ministerio Público",
    demandado: "Carlos Mamani",
    etapa: "Investigación",
  },
];

export default function Expediente() {
  const router = useRouter();

  return (
    <div style={{ padding: 40 }}>
      <h1>📁 Expedientes</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {expedientes.map((exp) => (
          <div
            key={exp.id}
            onClick={() => router.push(`/expediente/${exp.id}`)}
            style={{
              padding: 20,
              background: "white",
              borderRadius: 10,
              cursor: "pointer",
              border: "1px solid #ddd",
            }}
          >
            <h3>📁 {exp.id}</h3>
            <p><b>Materia:</b> {exp.materia}</p>
            <p><b>Estado:</b> {exp.estado}</p>
            <p><b>Etapa:</b> {exp.etapa}</p>
            <p><b>Juzgado:</b> {exp.juzgado}</p>
            <p><b>Fecha:</b> {exp.fecha}</p>
          </div>
        ))}
      </div>
    </div>
  );
}