import React from 'react';
import { ProtectedCategory } from '../../types/cv.types';
import { PROTECTED_CATEGORY_LABELS } from '../../constants/gdprConsent';

interface Props {
  protectedCategory?: ProtectedCategory;
  show: boolean;
}

function getCategoryLabel(type?: string, other?: string): string {
  if (type === 'altra') {
    return other || 'Altra categoria protetta';
  }
  if (!type) {
    return 'Categoria protetta';
  }
  return (PROTECTED_CATEGORY_LABELS as any)[type] || 'Categoria protetta';
}

export const ProtectedCategorySection: React.FC<Props> = ({ protectedCategory, show }) => {
  if (!show || !protectedCategory?.belongsToProtectedCategory) {
    return null;
  }

  return (
    <section className="cv-section protected-category">
      <h3 className="section-title">Categorie Protette</h3>
      <div className="section-content">
        <p className="mb-2">
          Appartenenza a categorie protette ai sensi della Legge 68/99:
        </p>
        <ul className="space-y-1">
          <li>
            <strong>Categoria:</strong>{' '}
            {getCategoryLabel(protectedCategory.categoryType, protectedCategory.categoryTypeOther)}
          </li>
          {protectedCategory.disabilityPercentage && (
            <li>
              <strong>Percentuale invalidità:</strong> {protectedCategory.disabilityPercentage}%
            </li>
          )}
          {protectedCategory.details && (
            <li>
              <strong>Note:</strong> {protectedCategory.details}
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};
