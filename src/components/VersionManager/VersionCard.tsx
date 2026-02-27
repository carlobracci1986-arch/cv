import React from 'react';
import { CVVersion } from '../../types/cv.types';
import {
  Calendar,
  Copy,
  Trash2,
  Upload,
  Sparkles,
  FileText,
  Briefcase,
} from 'lucide-react';

interface Props {
  version: CVVersion;
  isCurrent: boolean;
  onLoad: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const TEMPLATE_LABELS: Record<string, string> = {
  classic: 'Classico',
  modern: 'Moderno',
  minimalist: 'Minimalista',
  creative: 'Creativo',
  technical: 'Tecnico',
};

const TEMPLATE_COLORS: Record<string, string> = {
  classic: 'bg-amber-100 text-amber-700',
  modern: 'bg-blue-100 text-blue-700',
  minimalist: 'bg-gray-100 text-gray-700',
  creative: 'bg-purple-100 text-purple-700',
  technical: 'bg-cyan-100 text-cyan-700',
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export const VersionCard: React.FC<Props> = ({
  version,
  isCurrent,
  onLoad,
  onDelete,
  onDuplicate,
}) => {
  const templateLabel = TEMPLATE_LABELS[version.settings.template] ?? version.settings.template;
  const templateColor =
    TEMPLATE_COLORS[version.settings.template] ?? 'bg-gray-100 text-gray-700';
  const jobExcerpt = version.jobDescription
    ? version.jobDescription.slice(0, 100) + (version.jobDescription.length > 100 ? '…' : '')
    : null;

  return (
    <article
      className={`bg-white rounded-xl border-2 p-4 flex flex-col gap-3 transition-all hover:shadow-md ${
        isCurrent
          ? 'border-blue-500 shadow-blue-100 shadow-sm'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Current badge */}
      {isCurrent && (
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            Versione corrente
          </span>
        </div>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-gray-900 leading-snug break-words min-w-0 flex-1">
          {version.name}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Duplicate */}
          <button
            onClick={onDuplicate}
            title="Duplica versione"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          {/* Delete */}
          <button
            onClick={onDelete}
            title="Elimina versione"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${templateColor}`}>
          {templateLabel}
        </span>
        {version.isOptimized && (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            <Sparkles className="w-3 h-3" />
            Ottimizzata AI
          </span>
        )}
        {version.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Aggiornata: {formatDate(version.updatedAt)}</span>
        <span className="text-gray-300 mx-1">|</span>
        <span>Creata: {formatDate(version.createdAt)}</span>
      </div>

      {/* Notes */}
      {version.notes && (
        <div className="flex items-start gap-1.5 text-xs text-gray-500">
          <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{version.notes}</span>
        </div>
      )}

      {/* Job description excerpt */}
      {jobExcerpt && (
        <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Offerta di lavoro
            </span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{jobExcerpt}</p>
        </div>
      )}

      {/* Load button */}
      <button
        onClick={onLoad}
        disabled={isCurrent}
        className={`w-full mt-auto flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
          isCurrent
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        <Upload className="w-4 h-4" />
        {isCurrent ? 'Già caricata' : 'Carica'}
      </button>
    </article>
  );
};

export default VersionCard;
