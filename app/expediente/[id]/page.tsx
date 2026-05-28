"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ExpedienteDetalle() {
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : (params?.id as string);

  const [expediente, setExpediente] = useState<any>(null);
  const [documento, setDocumento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    materia: "",
    estado: "",
  });

  // 🔵 LOAD EXPEDIENTE
  useEffect(() => {
    if (!id) return;
    cargarExpediente();
  }, [id]);

  const cargarExpediente = async () => {
    setLoading(true);

    const cleanId = id?.trim();

    const { data, error } = await supabase
      .from("expedientes")
      .select("*")
      .eq("numero", cleanId) // ⚠️ seguimos usando numero porque tu URL es numero
      .maybeSingle();

    if (error) {
      console.error("Error expediente:", error);
      setExpediente(null);
      setLoading(false);
      return;
    }

    setExpediente(data);
    setLoading(false);

    if (data?.id) {
      cargarDocumento(data.id); // ✔ ahora sí correcto
    }
  };

  // 🔵 DOCUMENTOS (CORRECTO)
  const cargarDocumento = async (expId: string) => {
    const { data, error } = await supabase
      .from("expediente_documentos")
      .select("*")
      .eq("expediente_id", expId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error documento:", error);
      return;
    }

    setDocumento(data?.[0] || null);
  };

  // 🔵 EDIT
  const openEdit = () => {
    setEditForm({
      materia: expediente?.materia || "",
      estado: expediente?.estado || "",
    });
    setIsEditing(true);
  };

  const saveEdit = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("expedientes")
      .update({
        materia: editForm.materia,
        estado: editForm.estado,
      })
      .eq("numero", id);

    if (error) {
      console.error(error);
      alert("Error actualizando expediente");
      setLoading(false);
      return;
    }

    await cargarExpediente();
    setIsEditing(false);
    setLoading(false);
  };

  // 🔵 LOADING STATE
  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h1>⏳ Cargando expediente...</h1>
      </div>
    );
  }

  // 🔵 NOT FOUND
  if (!expediente) {
    return (
      <div style={{ padding: 40 }}>
        <h1>❌ Expediente no encontrado</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, background: "#f5f5f5", minHeight: "100vh" }}>
      <h1>📁 Expediente {expediente.numero}</h1>

      <div style={{ marginTop: 20, padding: 20, background: "white", borderRadius: 10 }}>
        <p><b>Materia:</b> {expediente.materia}</p>
        <p><b>Estado:</b> {expediente.estado}</p>

        <button onClick={openEdit}>
          ✏️ Editar expediente
        </button>
      </div>

      <div style={{ marginTop: 30, padding: 20, background: "white", borderRadius: 10 }}>
        <h2>📄 Documento</h2>

        {documento ? (
          <>
            <p>{documento.nombre}</p>
            <iframe src={documento.url} width="100%" height="500px" />
          </>
        ) : (
          <p>No hay documento cargado</p>
        )}
      </div>
    </div>
  );
}