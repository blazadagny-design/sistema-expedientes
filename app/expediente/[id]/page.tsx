"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ExpedienteDetalle() {
  const params = useParams();
  const id = params?.id as string;

  const [documento, setDocumento] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const data: any = {
    "001-2026": { materia: "Civil", estado: "En trámite" },
    "002-2026": { materia: "Penal", estado: "Investigación" },
    "003-2026": { materia: "Laboral", estado: "Apelación" },
  };

  const exp = data[id];

  // 🔵 CARGAR PDF AL ENTRAR
  useEffect(() => {
    if (id) cargarDocumento();
  }, [id]);

  const cargarDocumento = async () => {
    const { data, error } = await supabase
      .from("expediente_documentos")
      .select("*")
      .eq("expediente_id", id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      setDocumento(data[0]);
    }
  };

  // 🔵 SUBIR PDF
  const subirPDF = async (file: File) => {
    setLoading(true);

    const filePath = `${id}/${Date.now()}-${file.name}`;

    // 1. Subir a Storage
    const { error: uploadError } = await supabase.storage
      .from("expedientes")
      .upload(filePath, file);

    if (uploadError) {
      alert("Error subiendo PDF");
      setLoading(false);
      return;
    }

    // 2. Obtener URL pública
    const { data: publicUrl } = supabase.storage
      .from("expedientes")
      .getPublicUrl(filePath);

    // 3. Guardar en base de datos
    const { data: insertData, error: dbError } = await supabase
      .from("expediente_documentos")
      .insert({
        expediente_id: id,
        nombre: file.name,
        url: publicUrl.publicUrl,
      })
      .select()
      .single();

    if (dbError) {
      alert("Error guardando en BD");
      setLoading(false);
      return;
    }

    setDocumento(insertData);
    setLoading(false);
  };

  if (!exp) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Expediente no encontrado</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>📁 Expediente {id}</h1>

      {/* DATOS */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          background: "white",
          borderRadius: 10,
        }}
      >
        <p>
          <b>Materia:</b> {exp.materia}
        </p>
        <p>
          <b>Estado:</b> {exp.estado}
        </p>
      </div>

      {/* SUBIDA PDF */}
      <div style={{ marginTop: 30 }}>
        <h2>📄 Documento del expediente</h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) subirPDF(file);
          }}
        />

        {loading && <p>⏳ Subiendo archivo...</p>}
      </div>

      {/* VISUALIZAR PDF */}
      {documento && (
        <div style={{ marginTop: 30 }}>
          <h3>📎 Documento cargado:</h3>
          <p>{documento.nombre}</p>

          <iframe
            src={documento.url}
            width="100%"
            height="600px"
            style={{ marginTop: 10, border: "1px solid #ddd" }}
          />
        </div>
      )}
    </div>
  );
}