import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeneration } from '../context/GenerationContext';
import { Loader2, FileText, Mail, CheckCircle2, X, ChevronUp, ChevronDown } from 'lucide-react';

export default function FloatingGenerationIndicator() {
  const { generations, removeGeneration, clearCompleted } = useGeneration();
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  // Don't show if no generations
  if (generations.length === 0) return null;

  const inProgress = generations.filter(g => g.status === 'generating');
  const completed = generations.filter(g => g.status === 'completed');

  const handleGoToAnalysis = (analysisId) => {
    navigate(`/analysis/${analysisId}`);
    // Remove completed ones when user clicks
    clearCompleted();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed view - just show count */}
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
        >
          {inProgress.length > 0 && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {inProgress.length > 0 && (
            <span>{inProgress.length} generating</span>
          )}
          {completed.length > 0 && (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span>{completed.length} ready</span>
            </>
          )}
          <ChevronUp className="w-4 h-4" />
        </button>
      ) : (
        /* Expanded view - show list */
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <span className="font-medium text-gray-700 text-sm">Generation Progress</span>
            <button 
              onClick={() => setExpanded(false)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto">
            {generations.map((gen) => (
              <div 
                key={gen.id}
                className={`flex items-center gap-3 px-4 py-3 border-b last:border-b-0 ${
                  gen.status === 'completed' ? 'bg-green-50 cursor-pointer hover:bg-green-100' : ''
                }`}
                onClick={() => gen.status === 'completed' && handleGoToAnalysis(gen.analysisId)}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  gen.status === 'generating' ? 'bg-indigo-100' : 'bg-green-100'
                }`}>
                  {gen.status === 'generating' ? (
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {gen.type === 'resume' ? 'Tailored Resume' : 'Cover Letter'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {gen.jobTitle} at {gen.companyName}
                  </p>
                </div>

                {/* Status / Action */}
                {gen.status === 'generating' ? (
                  <span className="text-xs text-indigo-600 font-medium">Working...</span>
                ) : (
                  <span className="text-xs text-green-600 font-medium">Click to view →</span>
                )}

                {/* Remove button for completed */}
                {gen.status === 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGeneration(gen.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer hint */}
          {inProgress.length > 0 && (
            <div className="px-4 py-2 bg-amber-50 border-t">
              <p className="text-xs text-amber-700">
                ⏳ You can navigate freely. We'll notify you when done.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
