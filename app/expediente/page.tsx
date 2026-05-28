"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Expediente() {
  const router = useRouter();

  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarExpedientes = async () => {
    const { data, error } = await supabase
      .from("expedientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setExpedientes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    cargarExpedientes();

    const interval = setInterval(() => {
      cargarExpedientes();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h1>⏳ Cargando expedientes...</h1>
      </div>
    );
  }

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
            <h3>📁 {exp.numero}</h3>
            <p><b>Materia:</b> {exp.materia}</p>
            <p><b>Estado:</b> {exp.estado}</p>
          </div>
        ))}
      </div>
    </div>
  );
}