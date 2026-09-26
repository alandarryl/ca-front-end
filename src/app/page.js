"use client";

import { useState, useEffect } from "react";
import { 
  fetchAvailableModels, 
  previewAuditPdf,
  generateAudit, 
  downloadAuditPdf 
} from "@/lib/api";
import { 
  Eye,
  Search, 
  Download, 
  Loader2, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Newspaper, 
  ShieldAlert, 
  Lightbulb, 
  DollarSign,
  Cpu
} from "lucide-react";

export default function Home() {
  // --- États du formulaire ---
  const [companyName, setCompanyName] = useState("");
  const [provider, setProvider] = useState("ollama");
  const [modelName, setModelName] = useState("qwen2.5:1.5b");
  const [objectif, setObjectif] = useState("entretien");

  // --- États des données & UI ---
  const [availableModels, setAvailableModels] = useState({ ollama: [], gemini: [] });
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  const [previewingPdf, setPreviewingPdf] = useState(false);

const handlePreviewPdf = async () => {
  if (!auditResult || !companyName) return;
  setPreviewingPdf(true);
  try {
    await previewAuditPdf({
      company_name: companyName,
      provider,
      model_name: modelName,
      objectif,
    });
  } catch (err) {
    alert("Erreur lors de la prévisualisation du fichier PDF.");
  } finally {
    setPreviewingPdf(false);
  }
};
  // Charger la liste des modèles au montage
  useEffect(() => {
    async function loadModels() {
      try {
        const data = await fetchAvailableModels();
        setAvailableModels(data.providers || { ollama: [], gemini: [] });
        
        // Sélectionner un modèle par défaut disponible
        if (data.providers?.ollama?.length > 0) {
          setModelName(data.providers.ollama[0]);
        } else if (data.providers?.gemini?.length > 0) {
          setProvider("gemini");
          setModelName(data.providers.gemini[0]);
        }
      } catch (err) {
        console.error("Erreur chargement modèles:", err);
      } finally {
        setLoadingModels(false);
      }
    }
    loadModels();
  }, []);

  // Mettre à jour le modèle sélectionné quand le provider change
  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    const modelsList = availableModels[newProvider] || [];
    if (modelsList.length > 0) {
      setModelName(modelsList[0]);
    } else {
      setModelName("");
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoadingAudit(true);
    setError(null);
    setAuditResult(null);

    try {
      const data = await generateAudit({
        company_name: companyName,
        provider,
        model_name: modelName,
        objectif,
      });
      setAuditResult(data);
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
    } finally {
      setLoadingAudit(false);
    }
  };

  // Téléchargement du PDF
  const handleDownloadPdf = async () => {
    if (!auditResult || !companyName) return;
    setDownloadingPdf(true);
    try {
      await downloadAuditPdf({
        company_name: companyName,
        provider,
        model_name: modelName,
        objectif,
      });
    } catch (err) {
      alert("Erreur lors de la génération du fichier PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Helper pour afficher le contenu (texte, tableau ou dictionnaire)
  const renderSectionContent = (content) => {
    if (!content || content === "information non trouvée") {
      return <p className="text-gray-400 italic">Information non trouvée</p>;
    }

    if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
          {content.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }

    if (typeof content === "object") {
      return (
        <div className="space-y-2">
          {Object.entries(content).map(([key, val], idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
              <span className="font-semibold capitalize text-gray-900 dark:text-gray-100">{key.replace(/_/g, " ")} : </span>
              <span className="text-gray-700 dark:text-gray-300">{typeof val === "object" ? JSON.stringify(val) : String(val)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{String(content)}</p>;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* EN-TÊTE */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
            CompanyAudit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Générez des fiches d'analyse complètes et structurées pour vos entretiens, candidatures et études de marché.
          </p>
        </header>

        {/* FORMULAIRE DE CONFIGURATION */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
          
          {/* Nom de l'entreprise */}
          <div>
            <label className="block text-sm font-semibold mb-2">Entreprise à analyser</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Doctolib, Capgemini, Decathlon..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <Building2 className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Grille des paramètres */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Provider */}
            <div>
              <label className="block text-sm font-semibold mb-2">Fournisseur (Provider)</label>
              <select
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="ollama">Ollama (Local - Gratuit)</option>
                <option value="gemini">Google Gemini (Cloud)</option>
              </select>
            </div>

            {/* Modèle LLM */}
            <div>
              <label className="block text-sm font-semibold mb-2">Modèle LLM</label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                disabled={loadingModels || (availableModels[provider] || []).length === 0}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
              >
                {(availableModels[provider] || []).length > 0 ? (
                  availableModels[provider].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))
                ) : (
                  <option value="">Aucun modèle disponible</option>
                )}
              </select>
            </div>

            {/* Objectif */}
            <div>
              <label className="block text-sm font-semibold mb-2">Objectif de l'audit</label>
              <select
                value={objectif}
                onChange={(e) => setObjectif(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="entretien">Entretien d'embauche</option>
                <option value="candidature">Lettre de motivation / Candidature</option>
                <option value="collaboration">Partenariat / B2B</option>
                <option value="etude_marche">Étude de marché</option>
                <option value="general">Vue générale</option>
              </select>
            </div>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loadingAudit || !companyName.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {loadingAudit ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Lancer l'analyse
              </>
            )}
          </button>
        </form>

        {/* AFFICHAGE DES ERREURS */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300">
            <p className="font-semibold">Erreur lors de la génération :</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* RÉSULTAT DE L'AUDIT */}
        {auditResult && (
          <div className="space-y-6">
            
            {/* Barre de contrôle du rapport */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold">Rapport : {companyName}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Généré via <span className="font-medium text-blue-600 dark:text-blue-400">{provider.toUpperCase()} ({modelName})</span> • Objectif : <span className="capitalize">{objectif}</span>
                </p>
              </div>

              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 transition disabled:opacity-50 shadow"
              >
                {downloadingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Télécharger PDF
              </button>
            </div>

            {/* Grille des 8 sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Identité */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  <Building2 className="w-5 h-5" />
                  <h3>1. Identité</h3>
                </div>
                {renderSectionContent(auditResult.identite)}
              </div>

              {/* Activité */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  <Briefcase className="w-5 h-5" />
                  <h3>2. Activité & Offres</h3>
                </div>
                {renderSectionContent(auditResult.activite)}
              </div>

              {/* Finances */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  <DollarSign className="w-5 h-5" />
                  <h3>3. Données Financières</h3>
                </div>
                {renderSectionContent(auditResult.finances)}
              </div>

              {/* Marché & Concurrence */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  <TrendingUp className="w-5 h-5" />
                  <h3>4. Marché & Concurrence</h3>
                </div>
                {renderSectionContent(auditResult.marche)}
              </div>

              {/* Culture */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  <Users className="w-5 h-5" />
                  <h3>5. Culture d'Entreprise</h3>
                </div>
                {renderSectionContent(auditResult.culture)}
              </div>

              {/* Actualités */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  <Newspaper className="w-5 h-5" />
                  <h3>6. Actualités Récentes</h3>
                </div>
                {renderSectionContent(auditResult.actualites)}
              </div>

              {/* SWOT */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
                  <ShieldAlert className="w-5 h-5" />
                  <h3>7. Analyse SWOT</h3>
                </div>
                {renderSectionContent(auditResult.swot)}
              </div>

              {/* Conseils */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-500 font-bold text-lg">
                  <Lightbulb className="w-5 h-5" />
                  <h3>8. Recommandations Pratiques</h3>
                </div>
                {renderSectionContent(auditResult.conseils)}
              </div>

            </div>
          </div>
        )}

      </div>
      {/* Barre de contrôle du rapport */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
  <div>
    <h2 className="text-2xl font-bold">Rapport : {companyName}</h2>
    <p className="text-sm text-gray-500 mt-0.5">
      Généré via <span className="font-medium text-blue-600 dark:text-blue-400">{provider.toUpperCase()} ({modelName})</span> • Objectif : <span className="capitalize">{objectif}</span>
    </p>
  </div>

  <div className="flex items-center gap-3 w-full sm:w-auto">
    {/* Bouton Prévisualiser */}
    <button
      onClick={handlePreviewPdf}
      disabled={previewingPdf}
      className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
    >
      {previewingPdf ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
      Aperçu
    </button>

    {/* Bouton Télécharger */}
    <button
      onClick={handleDownloadPdf}
      disabled={downloadingPdf}
      className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow"
    >
      {downloadingPdf ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      Télécharger PDF
    </button>
  </div>
</div>
    </main>
  );
}