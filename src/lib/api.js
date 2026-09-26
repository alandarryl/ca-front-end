const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchAvailableModels() {
  const res = await fetch(`${API_BASE_URL}/api/models`);
  if (!res.ok) throw new Error("Impossible de récupérer les modèles");
  return res.json();
}

export async function generateAudit(data) {
  const res = await fetch(`${API_BASE_URL}/api/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Erreur lors de la génération de l'audit");
  }
  return res.json();
}

export async function downloadAuditPdf(data) {
  const res = await fetch(`${API_BASE_URL}/api/audit/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors du téléchargement du PDF");
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit_${data.company_name.toLowerCase().replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function previewAuditPdf(data) {
  const res = await fetch(`${API_BASE_URL}/api/audit/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) throw new Error("Erreur lors de la génération du PDF");

  const blob = await res.blob();
  // Crée un objet Blob de type application/pdf
  const pdfBlob = new Blob([blob], { type: "application/pdf" });
  const url = window.URL.createObjectURL(pdfBlob);

  // Ouvre le PDF dans un nouvel onglet
  window.open(url, "_blank");
}