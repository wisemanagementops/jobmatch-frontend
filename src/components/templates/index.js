/**
 * Templates Index
 * Configuration and exports for all resume templates
 */

import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import ATSTemplate from './ATSTemplate';
import BoldTemplate from './BoldTemplate';
import CompactTemplate from './CompactTemplate';
import CreativeTemplate from './CreativeTemplate';
import UniversalATSTemplate from './UniversalATSTemplate';

// Template configurations
export const templates = {
  modern: {
    id: 'modern',
    name: 'Modern',
    thumbnail: '📄',
    description: 'Clean and contemporary design with subtle accents',
    bestFor: 'Tech & Creative',
    component: ModernTemplate,
    supportsColor: true,
    defaultColor: '#2563eb',
    isPro: false
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    thumbnail: '📋',
    description: 'Traditional format preferred by conservative industries',
    bestFor: 'Finance & Legal',
    component: ClassicTemplate,
    supportsColor: false,
    isPro: false
  },
  ats: {
    id: 'ats',
    name: 'ATS',
    thumbnail: '🤖',
    description: 'Optimized for applicant tracking systems',
    bestFor: 'High-volume applying',
    component: ATSTemplate,
    supportsColor: false,
    isPro: false
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    thumbnail: '⚡',
    description: 'Eye-catching design that stands out',
    bestFor: 'Creative roles',
    component: BoldTemplate,
    supportsColor: true,
    defaultColor: '#dc2626',
    isPro: true
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    thumbnail: '📑',
    description: 'Maximum content in minimal space',
    bestFor: 'Experienced pros',
    component: CompactTemplate,
    supportsColor: true,
    defaultColor: '#059669',
    isPro: true
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    thumbnail: '🎨',
    description: 'Artistic layout with visual flair',
    bestFor: 'Design & Marketing',
    component: CreativeTemplate,
    supportsColor: true,
    defaultColor: '#7c3aed',
    isPro: true
  }
};

// Color preset configurations
export const colorPresets = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Green', value: '#059669' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Teal', value: '#0891b2' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Indigo', value: '#4f46e5' }
];

// Named exports for direct imports
export { default as ModernTemplate } from './ModernTemplate';
export { default as ClassicTemplate } from './ClassicTemplate';
export { default as ATSTemplate } from './ATSTemplate';
export { default as BoldTemplate } from './BoldTemplate';
export { default as CompactTemplate } from './CompactTemplate';
export { default as CreativeTemplate } from './CreativeTemplate';
export { default as UniversalATSTemplate } from './UniversalATSTemplate';
