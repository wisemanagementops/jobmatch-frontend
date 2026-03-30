/**
 * Career Selector Component
 * Allows users to select their career/industry for optimized resume templates
 */

import { useState, useMemo } from 'react';
import { careerCategories, careerGroups } from '../data/careerCategories';
import { Search, ChevronRight, Check, Info } from 'lucide-react';

export default function CareerSelector({ 
  selectedCareer, 
  onSelectCareer,
  showAsModal = false,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [hoveredCareer, setHoveredCareer] = useState(null);

  // Filter careers based on search
  const filteredCareers = useMemo(() => {
    if (!searchQuery.trim()) return null;
    
    const query = searchQuery.toLowerCase();
    const results = [];
    
    Object.values(careerCategories).forEach(career => {
      const matchesName = career.name.toLowerCase().includes(query);
      const matchesAlias = career.aliases.some(a => a.toLowerCase().includes(query));
      
      if (matchesName || matchesAlias) {
        results.push(career);
      }
    });
    
    return results;
  }, [searchQuery]);

  // Toggle group expansion
  const toggleGroup = (group) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  // Handle career selection
  const handleSelect = (careerId) => {
    onSelectCareer(careerId);
    if (showAsModal && onClose) {
      onClose();
    }
  };

  return (
    <div className={`bg-white rounded-xl ${showAsModal ? 'max-w-2xl mx-auto' : ''}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Select Your Career Field
        </h2>
        <p className="text-gray-600 text-sm">
          We'll customize your resume template with the right sections, formatting, and keywords for your industry.
        </p>
        
        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search careers (e.g., Software Engineer, Nurse, Project Manager)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
        {/* Search Results */}
        {filteredCareers ? (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              {filteredCareers.length} result{filteredCareers.length !== 1 ? 's' : ''} found
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCareers.map(career => (
                <CareerCard
                  key={career.id}
                  career={career}
                  isSelected={selectedCareer === career.id}
                  onSelect={() => handleSelect(career.id)}
                  onHover={() => setHoveredCareer(career.id)}
                  onLeave={() => setHoveredCareer(null)}
                />
              ))}
              {filteredCareers.length === 0 && (
                <p className="text-gray-500 col-span-2 text-center py-8">
                  No careers match your search. Try different keywords.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Grouped Career List */
          <div className="space-y-4">
            {Object.entries(careerGroups).map(([groupName, careerIds]) => (
              <div key={groupName} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-900">{groupName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{careerIds.length} options</span>
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedGroup === groupName ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {/* Group Content */}
                {expandedGroup === groupName && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {careerIds.map(careerId => {
                      const career = careerCategories[careerId];
                      if (!career) return null;
                      return (
                        <CareerCard
                          key={career.id}
                          career={career}
                          isSelected={selectedCareer === career.id}
                          onSelect={() => handleSelect(career.id)}
                          onHover={() => setHoveredCareer(career.id)}
                          onLeave={() => setHoveredCareer(null)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Career Details Panel */}
      {hoveredCareer && careerCategories[hoveredCareer] && (
        <div className="p-4 bg-indigo-50 border-t border-indigo-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-indigo-900">
                {careerCategories[hoveredCareer].name} Resume Tips
              </h4>
              <ul className="mt-1 text-sm text-indigo-700 space-y-1">
                {careerCategories[hoveredCareer].tips?.slice(0, 3).map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected Career Footer */}
      {selectedCareer && (
        <div className="p-4 bg-green-50 border-t border-green-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">
              Selected: {careerCategories[selectedCareer]?.name}
            </span>
          </div>
          {showAsModal && onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Career Card Component
function CareerCard({ career, isSelected, onSelect, onHover, onLeave }) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {/* Icon */}
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: `${career.color}15` }}
      >
        {career.icon}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 flex items-center gap-2">
          {career.name}
          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {career.aliases.slice(0, 3).join(', ')}
        </div>
      </div>
    </button>
  );
}

// Compact Career Selector (for inline use)
export function CareerSelectorCompact({ selectedCareer, onSelectCareer }) {
  const [isOpen, setIsOpen] = useState(false);
  const career = selectedCareer ? careerCategories[selectedCareer] : null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 w-full border-2 border-gray-200 rounded-lg hover:border-gray-300"
      >
        {career ? (
          <>
            <span className="text-xl">{career.icon}</span>
            <span className="font-medium text-gray-900">{career.name}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </>
        ) : (
          <>
            <span className="text-gray-500">Select your career field...</span>
            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
          </>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[400px] overflow-y-auto">
          <CareerSelector
            selectedCareer={selectedCareer}
            onSelectCareer={(id) => {
              onSelectCareer(id);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
