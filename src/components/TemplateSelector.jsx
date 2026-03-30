/**
 * Template Selector Component
 * Allows users to choose a template, customize colors, preview, and download
 */

import { useState, useRef, useEffect } from 'react';
import { templates, colorPresets } from './templates';
import { parseResumeText } from '../utils/parseResumeText';
import { generatePDF } from '../utils/generatePDF';
import { Download, Lock, Check, ChevronLeft, ChevronRight, Palette, Eye, X, FileText, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TemplateSelector({
  resumeText,
  userSubscription = 'free', // 'free' or 'pro'
  companyName = 'Company',
  onClose,
  onDownloadWord,
  onDownloadText
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [accentColor, setAccentColor] = useState(templates.modern.defaultColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  // Parse resume text into structured data
  const parsedResume = parseResumeText(resumeText);

  // Get current template config
  const currentTemplate = templates[selectedTemplate];
  const TemplateComponent = currentTemplate?.component;

  // Check if user can use this template
  const canUseTemplate = (templateId) => {
    const template = templates[templateId];
    return !template.isPro || userSubscription === 'pro';
  };

  // Handle template selection
  const handleSelectTemplate = (templateId) => {
    const template = templates[templateId];
    if (!canUseTemplate(templateId)) {
      toast.error('Upgrade to Pro to use this template');
      return;
    }
    setSelectedTemplate(templateId);
    if (template.supportsColor && template.defaultColor) {
      setAccentColor(template.defaultColor);
    }
  };

  // Handle PDF download
  const handleDownload = async () => {
    if (!canUseTemplate(selectedTemplate)) {
      toast.error('Upgrade to Pro to download with this template');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Starting PDF generation for template:', selectedTemplate);
      const result = await generatePDF('resume-preview', `resume-${companyName.replace(/\s+/g, '-')}`);
      console.log('PDF generation completed successfully');
      toast.success('Resume downloaded!');
    } catch (error) {
      console.error('PDF generation error:', error);
      console.error('Error details:', error.message, error.stack);
      toast.error(`PDF generation failed: ${error.message || 'Try the print option instead'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    const printContent = document.getElementById('resume-preview');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume - ${parsedResume?.name || 'Download'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 0; size: letter; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
        <div>
          <h3 className="font-semibold text-gray-900">Choose Template</h3>
          <p className="text-sm text-gray-500">Select a professional template for your resume</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Template Grid */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Object.values(templates).map((template) => {
            const isSelected = selectedTemplate === template.id;
            const isLocked = !canUseTemplate(template.id);

            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                    : isLocked
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Thumbnail */}
                <div className="text-3xl mb-2">{template.thumbnail}</div>
                
                {/* Name */}
                <div className="text-sm font-medium text-gray-900">{template.name}</div>
                
                {/* Best for */}
                <div className="text-xs text-gray-500 truncate">{template.bestFor}</div>

                {/* Pro Badge */}
                {template.isPro && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    PRO
                  </div>
                )}

                {/* Lock Icon */}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                )}

                {/* Selected Check */}
                {isSelected && !isLocked && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Picker (if template supports it) */}
      {currentTemplate?.supportsColor && (
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Accent Color:
            </span>
            <div className="flex gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    accentColor === color.value
                      ? 'border-gray-900 scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            {userSubscription !== 'pro' && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                🔒 More colors with Pro
              </span>
            )}
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </h4>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              🖨️ Print
            </button>
            {onDownloadText && (
              <button
                onClick={onDownloadText}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Download TXT
              </button>
            )}
            {onDownloadWord && (
              <button
                onClick={onDownloadWord}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium"
              >
                <FileDown className="w-4 h-4" />
                Download Word
              </button>
            )}
            <button
              onClick={handleDownload}
              disabled={isGenerating || !canUseTemplate(selectedTemplate)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resume Preview Container */}
        <div 
          className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 shadow-inner"
          style={{ maxHeight: '600px', overflowY: 'auto' }}
        >
          <div 
            id="resume-preview"
            ref={previewRef}
            className="transform origin-top"
            style={{ 
              transform: 'scale(0.75)', 
              transformOrigin: 'top center',
              marginBottom: '-25%' // Compensate for scale
            }}
          >
            {TemplateComponent && parsedResume && (
              <TemplateComponent 
                resume={parsedResume} 
                accentColor={currentTemplate.supportsColor ? accentColor : undefined}
              />
            )}
          </div>
        </div>

        {/* Template Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{currentTemplate?.thumbnail}</span>
            <div>
              <h5 className="font-semibold text-gray-900">{currentTemplate?.name} Template</h5>
              <p className="text-sm text-gray-600">{currentTemplate?.description}</p>
              <p className="text-xs text-gray-500 mt-1">Best for: {currentTemplate?.bestFor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA for Free Users */}
      {userSubscription !== 'pro' && (
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-800">🚀 Unlock All Templates</p>
              <p className="text-sm text-amber-700">Get Bold, Compact, Creative templates + color customization</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all">
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
