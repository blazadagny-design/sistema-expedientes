"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ExpedientePage() {
  const [file, setFile] = useState<File | null>(null);

  const subirPDF = async () => {
    if (!file) return;

    const filePath = `expedientes/${Date.now()}-${file.name}`;

    const { data, error: uploadError } = await supabase.storage
      .from("expedientes")
      .upload(filePath, file);

    if (uploadError) {
      console.error("SUPABASE UPLOAD ERROR:", uploadError);
      alert("Error subiendo PDF: " + uploadError.message);
      return;
    }

    alert("PDF subido correctamente");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>📄 Subir PDF</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={subirPDF}>
        Subir PDF
      </button>
    </div>
  );
}