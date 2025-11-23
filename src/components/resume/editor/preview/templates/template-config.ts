export type TemplateId = 'default' | 'modern' | 'classic' | 'minimalist';

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  preview: string; // SVG icon or preview image path
}

export const TEMPLATE_METADATA: Record<TemplateId, TemplateMetadata> = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'Clean single-column layout with section borders',
  preview: '/templates/default-preview.png',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with accent colors',
    preview: '/templates/modern-preview.png',
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional two-column with sidebar',
    preview: '/templates/classic-preview.png',
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Ultra-clean with subtle borders',
    preview: '/templates/minimalist-preview.png',
  },
};

export const TEMPLATE_ORDER: TemplateId[] = ['default', 'modern', 'classic', 'minimalist'];
