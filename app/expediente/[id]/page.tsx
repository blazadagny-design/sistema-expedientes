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
  const [loading, setLoading] = useState(false);

  // EDIT MODAL STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    materia: "",
    estado: "",
  });

  // LOAD DATA
  useEffect(() => {
    if (id) {
      cargarExpediente();
      cargarDocumento();
    }
  }, [id]);

  const cargarExpediente = async () => {
    const { data, error } = await supabase
      .from("expedientes")
      .select("*")
      .eq("numero", id?.trim());

    if (error) {
      console.error("Error expediente:", error);
      setExpediente(null);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No se encontró expediente");
      setExpediente(null);
      return;
    }

    setExpediente(data[0]);
  };

  const cargarDocumento = async () => {
    const { data, error } = await supabase
      .from("expediente_documentos")
      .select("*")
      .eq("expediente_id", id?.trim())
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error documento:", error);
      return;
    }

    if (data && data.length > 0) {
      setDocumento(data[0]);
    }
  };

  // OPEN EDIT MODAL
  const openEdit = () => {
    setEditForm({
      materia: expediente?.materia || "",
      estado: expediente?.estado || "",
    });
    setIsEditing(true);
  };

  // SAVE EDIT
  const saveEdit = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("expedientes")
      .update({
        materia: editForm.materia,
        estado: editForm.estado,
      })
      .eq("numero", id?.trim());

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

  if (!id) {
    return (
      <div style={{ padding: 40 }}>
        <h1>❌ ID inválido</h1>
      </div>
    );
  }

  if (!expediente) {
    return (
      <div style={{ padding: 40 }}>
        <h1>⏳ Cargando expediente...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, background: "#f5f5f5", minHeight: "100vh" }}>
      <h1>📁 Expediente {expediente.numero}</h1>

      {/* INFO */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          background: "white",
          borderRadius: 10,
        }}
      >
        <p><b>Materia:</b> {expediente.materia}</p>
        <p><b>Estado:</b> {expediente.estado}</p>

        <button
          onClick={openEdit}
          style={{
            marginTop: 10,
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          ✏️ Editar expediente
        </button>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
              width: 400,
            }}
          >
            <h2>Editar expediente</h2>

            <input
              placeholder="Materia"
              value={editForm.materia}
              onChange={(e) =>
                setEditForm({ ...editForm, materia: e.target.value })
              }
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />

            <input
              placeholder="Estado"
              value={editForm.estado}
              onChange={(e) =>
                setEditForm({ ...editForm, estado: e.target.value })
              }
              style={{ width: "100%", padding: 10, marginBottom: 10 }}
            />

            <button
              onClick={saveEdit}
              style={{
                background: "green",
                color: "white",
                padding: 10,
                border: "none",
                borderRadius: 8,
                width: "100%",
                marginBottom: 10,
              }}
            >
              💾 Guardar
            </button>

            <button
              onClick={() => setIsEditing(false)}
              style={{
                background: "gray",
                color: "white",
                padding: 10,
                border: "none",
                borderRadius: 8,
                width: "100%",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENTO */}
      <div style={{ marginTop: 30, padding: 20, background: "white", borderRadius: 10 }}>
        <h2>📄 Documento</h2>

        {documento ? (
          <>
            <p>{documento.nombre}</p>

            <iframe
              src={documento.url}
              width="100%"
              height="500px"
              style={{ marginTop: 10 }}
            />
          </>
        ) : (
          <p>No hay documento cargado</p>
        )}
      </div>
    </div>
  );
}