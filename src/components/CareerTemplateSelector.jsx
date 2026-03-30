/**
 * Career-Based Template Selector Component
 * 
 * Combines career selection with template preview and download
 * This is the main UI component for the templates feature
 */

import { useState, useRef, useMemo } from 'react';
import { careerCategories, colorPresets } from '../data/careerCategories';
import CareerSelector from './CareerSelector';
import UniversalATSTemplate from './career-templates/UniversalATSTemplate';
import { parseResumeText } from '../utils/parseResumeText';
import { generatePDF } from '../utils/generatePDF';
import { 
  Download, Check, ChevronLeft, Palette, Eye, X, 
  Briefcase, FileText, Sparkles, Info, Printer
} from 'lucide-react';
import toast from 'react-hot-toast';

// Color presets
const accentColors = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Green', value: '#059669' },
  { name: 'Slate', value: '#475569' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Orange', value: '#ea580c' }
];

export default function CareerTemplateSelector({ 
  resumeText, 
  userSubscription = 'free',
  companyName = 'Company',
  jobTitle = '',
  onClose 
}) {
  // State
  const [step, setStep] = useState('career'); // 'career' | 'preview'
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef(null);

  // Parse resume text into structured data
  const parsedResume = useMemo(() => {
    return parseResumeText(resumeText);
  }, [resumeText]);

  // Get current career config
  const currentCareer = selectedCareer ? careerCategories[selectedCareer] : null;

  // Auto-detect career from job title (simple implementation)
  const suggestedCareer = useMemo(() => {
    if (!jobTitle) return null;
    const title = jobTitle.toLowerCase();
    
    if (title.includes('software') || title.includes('developer') || title.includes('engineer') && title.includes('software')) {
      return 'software_engineering';
    }
    if (title.includes('data scientist') || title.includes('data analyst') || title.includes('machine learning')) {
      return 'data_science';
    }
    if (title.includes('nurse') || title.includes('nursing') || title.includes('rn')) {
      return 'nursing';
    }
    if (title.includes('electrical engineer')) {
      return 'electrical_engineering';
    }
    if (title.includes('mechanical engineer')) {
      return 'mechanical_engineering';
    }
    if (title.includes('project manager') || title.includes('scrum')) {
      return 'project_management';
    }
    if (title.includes('marketing')) {
      return 'marketing';
    }
    if (title.includes('sales')) {
      return 'sales';
    }
    return null;
  }, [jobTitle]);

  // Handle career selection
  const handleSelectCareer = (careerId) => {
    setSelectedCareer(careerId);
    const career = careerCategories[careerId];
    if (career?.color) {
      setAccentColor(career.color);
    }
  };

  // Handle PDF download
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generatePDF('resume-preview', `resume-${companyName.replace(/\s+/g, '-')}`);
      toast.success('Resume downloaded!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Try the print option.');
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
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center gap-3">
          {step === 'preview' && (
            <button 
              onClick={() => setStep('career')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {step === 'career' ? 'Choose Your Career Field' : 'Preview & Download'}
            </h3>
            <p className="text-sm text-indigo-100">
              {step === 'career' 
                ? 'We\'ll optimize your resume for your industry' 
                : `Optimized for ${currentCareer?.name || 'your career'}`
              }
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Step 1: Career Selection */}
      {step === 'career' && (
        <div>
          {/* Suggested Career */}
          {suggestedCareer && careerCategories[suggestedCareer] && (
            <div className="px-6 py-4 bg-green-50 border-b border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-800">
                    Recommended: {careerCategories[suggestedCareer].name}
                  </p>
                  <p className="text-sm text-green-600">
                    Based on the job title "{jobTitle}"
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleSelectCareer(suggestedCareer);
                    setStep('preview');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Use This
                </button>
              </div>
            </div>
          )}

          {/* Career Selector */}
          <div className="p-6">
            <CareerSelector
              selectedCareer={selectedCareer}
              onSelectCareer={handleSelectCareer}
            />
          </div>

          {/* Continue Button */}
          {selectedCareer && (
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setStep('preview')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
              >
                Continue to Preview
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Preview & Download */}
      {step === 'preview' && currentCareer && (
        <div>
          {/* Career Info Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentCareer.icon}</span>
              <div>
                <span className="font-medium text-gray-900">{currentCareer.name}</span>
                <span className="text-gray-500 text-sm ml-2">Template</span>
              </div>
            </div>
            
            {/* Color Picker */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Palette className="w-4 h-4" />
                Accent:
              </span>
              <div className="flex gap-1">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      accentColor === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tips for this career */}
          {currentCareer.tips?.length > 0 && (
            <div className="px-6 py-3 bg-indigo-50 border-b">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
                <div className="text-sm text-indigo-700">
                  <span className="font-medium">Tips for {currentCareer.name}:</span>
                  <span className="ml-1">{currentCareer.tips[0]}</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview Area */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium disabled:opacity-50"
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
                  transform: 'scale(0.7)', 
                  transformOrigin: 'top center',
                  marginBottom: '-30%'
                }}
              >
                {parsedResume && (
                  <UniversalATSTemplate 
                    resume={parsedResume} 
                    careerId={selectedCareer}
                    accentColor={accentColor}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section Order Info */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Sections optimized for {currentCareer.name}:
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentCareer.sections?.order?.map(s => 
                    s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  ).join(' → ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { CareerTemplateSelector };
