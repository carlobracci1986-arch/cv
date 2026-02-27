import React, { useMemo } from 'react';
import { Download, RefreshCw, FileText, Edit3 } from 'lucide-react';

interface Props {
  content: string;
  onChange: (content: string) => void;
  onDownloadPDF: () => void;
  onRegenerate: () => void;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const CoverLetterPreview: React.FC<Props> = ({
  content,
  onChange,
  onDownloadPDF,
  onRegenerate,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const wordCount = useMemo(() => countWords(content), [content]);
  const charCount = content.length;

  const toggleEdit = () => setIsEditing((v) => !v);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">
            Lettera di Presentazione
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Word count */}
          <span className="hidden sm:inline text-xs text-gray-400">
            {wordCount} parole &middot; {charCount} caratteri
          </span>
          {/* Edit toggle */}
          <button
            onClick={toggleEdit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              isEditing
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Anteprima' : 'Modifica'}
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Rigenera
          </button>
          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Scarica PDF
          </button>
        </div>
      </div>

      {/* Letter content */}
      <div className="p-6">
        {isEditing ? (
          /* Edit mode: textarea */
          <div>
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              rows={24}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 font-mono leading-relaxed focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              placeholder="Il contenuto della lettera apparirà qui..."
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Modalità modifica attiva</span>
              <span>{wordCount} parole &middot; {charCount} caratteri</span>
            </div>
          </div>
        ) : (
          /* Preview mode: styled letter */
          <div className="max-w-2xl mx-auto">
            {content ? (
              <div
                className="rounded-xl border border-gray-200 bg-white shadow-inner px-8 py-10"
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  minHeight: '400px',
                }}
              >
                <div className="text-sm text-gray-800 leading-8 whitespace-pre-wrap break-words">
                  {content}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                <FileText className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm">La lettera generata apparirà qui</p>
              </div>
            )}
            {content && (
              <div className="flex justify-end mt-3 text-xs text-gray-400">
                {wordCount} parole &middot; {charCount} caratteri
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
