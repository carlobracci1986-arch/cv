import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  Download,
  Upload,
  Trash2,
  Cpu,
  Check,
  FileJson,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { DeleteConfirmation } from './DeleteConfirmation';

interface ActivityEntry {
  id: string;
  action: string;
  timestamp: Date;
  type: 'save' | 'ai' | 'export' | 'import' | 'delete';
}

interface Props {
  onClearAllData: () => void;
}

function getActivityLog(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem('cv_activity_log');
    if (!raw) return [];
    const parsed: Array<{ id: string; action: string; timestamp: string; type: ActivityEntry['type'] }> =
      JSON.parse(raw);
    return parsed
      .map((e) => ({ ...e, timestamp: new Date(e.timestamp) }))
      .slice(-5)
      .reverse();
  } catch {
    return [];
  }
}

function formatTs(date: Date): string {
  return date.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const TYPE_COLORS: Record<ActivityEntry['type'], string> = {
  save: 'bg-green-100 text-green-700',
  ai: 'bg-purple-100 text-purple-700',
  export: 'bg-blue-100 text-blue-700',
  import: 'bg-yellow-100 text-yellow-700',
  delete: 'bg-red-100 text-red-700',
};

const TYPE_LABELS: Record<ActivityEntry['type'], string> = {
  save: 'Salvataggio',
  ai: 'AI',
  export: 'Export',
  import: 'Import',
  delete: 'Eliminazione',
};

export const PrivacySettings: React.FC<Props> = ({ onClearAllData }) => {
  const [aiConsent, setAiConsent] = useState<boolean>(() => {
    return localStorage.getItem('ai_consent_saved') === 'true';
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activityLog = getActivityLog();

  const handleExport = () => {
    try {
      const keys = Object.keys(localStorage);
      const data: Record<string, unknown> = {};
      keys.forEach((k) => {
        try {
          const val = localStorage.getItem(k);
          data[k] = val ? JSON.parse(val) : val;
        } catch {
          data[k] = localStorage.getItem(k);
        }
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv-builder-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Record<string, unknown>;
        Object.entries(data).forEach(([k, v]) => {
          localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
        });
        setImportStatus('success');
        setTimeout(() => setImportStatus('idle'), 3000);
      } catch {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    e.target.value = '';
  };

  const handleAiConsentToggle = () => {
    const next = !aiConsent;
    setAiConsent(next);
    localStorage.setItem('ai_consent_saved', String(next));
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onClearAllData();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h2 className="text-xl font-bold text-gray-900">Impostazioni Privacy</h2>

      {/* Data storage info */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <Database className="w-4 h-4 text-blue-600" />
          <span>Dove sono i tuoi dati</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Tutti i tuoi dati (CV, versioni, preferenze) sono salvati esclusivamente nel{' '}
          <strong>localStorage</strong> del tuo browser. Nessun dato viene inviato a
          server di terze parti senza il tuo consenso esplicito.
        </p>
        <div className="bg-blue-50 rounded-lg px-4 py-3">
          <p className="text-xs text-blue-700">
            Spazio utilizzato: circa{' '}
            {(
              Object.keys(localStorage).reduce(
                (acc, k) => acc + (localStorage.getItem(k)?.length ?? 0),
                0
              ) / 1024
            ).toFixed(1)}{' '}
            KB
          </p>
        </div>
      </section>

      {/* Backup & Restore */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <FileJson className="w-4 h-4 text-green-600" />
          <span>Backup e Ripristino</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4 text-green-600" />
            Esporta Backup (JSON)
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            Importa da Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {importStatus === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-4 py-2.5">
            <Check className="w-4 h-4" />
            Importazione completata con successo.
          </div>
        )}
        {importStatus === 'error' && (
          <div className="text-sm text-red-700 bg-red-50 rounded-lg px-4 py-2.5">
            Errore durante l'importazione. Assicurati che il file sia valido.
          </div>
        )}
      </section>

      {/* AI Consent toggle */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <Cpu className="w-4 h-4 text-purple-600" />
          <span>Consenso AI</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600 flex-1">
            Ricorda la mia scelta per le richieste AI (non mostrare il dialogo ogni volta)
          </p>
          <button
            role="switch"
            aria-checked={aiConsent}
            onClick={handleAiConsentToggle}
            className={`relative inline-flex items-center h-6 w-11 rounded-full flex-shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              aiConsent ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform ${
                aiConsent ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Activity log */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>Registro Attività</span>
          <span className="text-xs font-normal text-gray-400">(ultimi 5 eventi)</span>
        </div>
        {activityLog.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Nessuna attività registrata.</p>
        ) : (
          <ul className="space-y-2">
            {activityLog.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 text-sm text-gray-700"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      TYPE_COLORS[entry.type]
                    }`}
                  >
                    {TYPE_LABELS[entry.type]}
                  </span>
                  <span className="truncate">{entry.action}</span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {formatTs(entry.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Links */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Documenti Legali</p>
        <div className="flex flex-col gap-2">
          <Link
            to="/privacy-policy"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Termini di Servizio
          </Link>
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-red-50 rounded-xl border border-red-200 p-5 space-y-4">
        <p className="text-sm font-bold text-red-800 uppercase tracking-wide">
          Zona Pericolo
        </p>
        <p className="text-sm text-red-700">
          Questa operazione eliminerà permanentemente tutti i tuoi dati salvati nel
          browser, inclusi CV, versioni e preferenze.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          Cancella Tutti i Dati
        </button>
      </section>

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default PrivacySettings;
