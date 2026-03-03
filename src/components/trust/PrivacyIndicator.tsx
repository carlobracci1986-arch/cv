import React from 'react';
import { Lock } from 'lucide-react';

/**
 * Mini indicatore di privacy da mostrare nei form dell'editor
 */
export const PrivacyIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <Lock className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-green-900">I tuoi dati sono al sicuro</p>
        <p className="text-[11px] text-green-700 leading-relaxed">
          Tutto viene salvato solo sul tuo dispositivo. Non condividiamo mai i tuoi dati.
        </p>
      </div>
    </div>
  );
};
