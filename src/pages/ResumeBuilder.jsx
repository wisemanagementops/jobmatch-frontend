import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { 
  Sparkles, ArrowLeft, Plus, Trash2, Loader2, Save, 
  RefreshCw, Wand2, X, ChevronDown, Check,
  User, Briefcase, GraduationCap, Award, FolderOpen, BookOpen, Trophy, Wrench
} from 'lucide-react';

// Industry-specific section configurations
const INDUSTRY_SECTIONS = {
  tech: {
    label: 'Technology / Engineering',
    sections: ['projects', 'certifications'],
    projectLabel: 'Technical Projects',
    projectPlaceholder: 'Built a React dashboard that visualized real-time data from IoT sensors...',
  },
  research: {
    label: 'Research / Academia',
    sections: ['publications', 'projects'],
    projectLabel: 'Research Projects',
    projectPlaceholder: 'Led a study on machine learning applications in climate modeling...',
  },
  healthcare: {
    label: 'Healthcare / Medical',
    sections: ['certifications', 'publications'],
    projectLabel: 'Clinical Projects',
    projectPlaceholder: 'Implemented a patient tracking system that reduced wait times by 30%...',
  },
  business: {
    label: 'Business / Finance',
    sections: ['certifications', 'achievements'],
    projectLabel: 'Key Projects',
    projectPlaceholder: 'Led quarterly budget planning process for $5M department...',
  },
  creative: {
    label: 'Creative / Design',
    sections: ['projects', 'portfolio'],
    projectLabel: 'Creative Projects',
    projectPlaceholder: 'Designed brand identity for a startup that increased recognition by 200%...',
  },
  trades: {
    label: 'Trades / Service',
    sections: ['certifications', 'achievements'],
    projectLabel: 'Notable Projects',
    projectPlaceholder: 'Completed commercial HVAC installation for 50,000 sq ft building...',
  },
  general: {
    label: 'Other / General',
    sections: ['achievements'],
    projectLabel: 'Key Achievements',
    projectPlaceholder: 'Describe your most notable achievement...',
  }
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [industry, setIndustry] = useState(null);
  const [showIndustrySelector, setShowIndustrySelector] = useState(true);
  
  // Form state
  const [contact, setContact] = useState({ name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' });
  const [targetRole, setTargetRole] = useState('');
  const [education, setEducation] = useState([{ id: Date.now(), school: '', degree: '', field: '', graduation: '', gpa: '', location: '' }]);
  const [experience, setExperience] = useState([{ id: Date.now(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', bullets: [], suggestions: null, loadingSuggestions: false }]);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  // Additional sections based on industry
  const [projects, setProjects] = useState([{ id: Date.now(), name: '', description: '', technologies: '', link: '' }]);
  const [publications, setPublications] = useState([{ id: Date.now(), title: '', journal: '', year: '', link: '' }]);
  const [certifications, setCertifications] = useState([{ id: Date.now(), name: '', issuer: '', year: '', expiry: '' }]);
  const [achievements, setAchievements] = useState([{ id: Date.now(), title: '', description: '' }]);

  // Detect relevant sections based on selected industry
  const getActiveSections = () => {
    if (!industry) return [];
    return INDUSTRY_SECTIONS[industry]?.sections || [];
  };

  // Education handlers
  const addEducation = () => setEducation([...education, { id: Date.now(), school: '', degree: '', field: '', graduation: '', gpa: '', location: '' }]);
  const removeEducation = (id) => education.length > 1 && setEducation(education.filter(e => e.id !== id));
  const updateEducation = (id, field, value) => setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));

  // Experience handlers
  const addExperience = () => setExperience([...experience, { id: Date.now(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', bullets: [], suggestions: null, loadingSuggestions: false }]);
  const removeExperience = (id) => experience.length > 1 && setExperience(experience.filter(e => e.id !== id));
  const updateExperience = (id, field, value) => setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));

  const generateSuggestions = async (expId) => {
    const exp = experience.find(e => e.id === expId);
    if (!exp.title || !exp.company) { toast.error('Please enter job title and company first'); return; }
    setExperience(experience.map(e => e.id === expId ? { ...e, loadingSuggestions: true } : e));
    try {
      const response = await api.request('/resumes/builder/experience-suggestions', {
        method: 'POST', body: JSON.stringify({ jobTitle: exp.title, company: exp.company, description: exp.description, industry, targetRole })
      });
      setExperience(experience.map(e => e.id === expId ? { ...e, suggestions: response.data, loadingSuggestions: false } : e));
      toast.success('AI suggestions generated!');
    } catch (error) {
      toast.error('Failed to generate suggestions');
      setExperience(experience.map(e => e.id === expId ? { ...e, loadingSuggestions: false } : e));
    }
  };

  // Check if a suggestion bullet is already added
  const isBulletAdded = (expId, bullet) => {
    const exp = experience.find(e => e.id === expId);
    return exp?.bullets?.includes(bullet) || false;
  };

  const addBulletFromSuggestion = (expId, bullet) => {
    // Check if already added
    if (isBulletAdded(expId, bullet)) {
      toast.error('Already added!');
      return;
    }
    setExperience(experience.map(e => e.id === expId ? { ...e, bullets: [...e.bullets, bullet] } : e));
    toast.success('Added!');
  };

  const removeBulletFromSuggestion = (expId, bullet) => {
    setExperience(experience.map(e => e.id === expId ? { ...e, bullets: e.bullets.filter(b => b !== bullet) } : e));
    toast.success('Removed!');
  };

  const removeBullet = (expId, bulletIndex) => {
    setExperience(experience.map(e => e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== bulletIndex) } : e));
  };

  // Skills handlers
  const addSkill = () => { if (skillInput.trim() && !skills.includes(skillInput.trim())) { setSkills([...skills, skillInput.trim()]); setSkillInput(''); } };
  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  // Projects handlers
  const addProject = () => setProjects([...projects, { id: Date.now(), name: '', description: '', technologies: '', link: '' }]);
  const removeProject = (id) => projects.length > 1 && setProjects(projects.filter(p => p.id !== id));
  const updateProject = (id, field, value) => setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));

  // Publications handlers
  const addPublication = () => setPublications([...publications, { id: Date.now(), title: '', journal: '', year: '', link: '' }]);
  const removePublication = (id) => publications.length > 1 && setPublications(publications.filter(p => p.id !== id));
  const updatePublication = (id, field, value) => setPublications(publications.map(p => p.id === id ? { ...p, [field]: value } : p));

  // Certifications handlers
  const addCertification = () => setCertifications([...certifications, { id: Date.now(), name: '', issuer: '', year: '', expiry: '' }]);
  const removeCertification = (id) => certifications.length > 1 && setCertifications(certifications.filter(c => c.id !== id));
  const updateCertification = (id, field, value) => setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));

  // Achievements handlers
  const addAchievement = () => setAchievements([...achievements, { id: Date.now(), title: '', description: '' }]);
  const removeAchievement = (id) => achievements.length > 1 && setAchievements(achievements.filter(a => a.id !== id));
  const updateAchievement = (id, field, value) => setAchievements(achievements.map(a => a.id === id ? { ...a, [field]: value } : a));

  // Summary handler
  const generateSummary = async (style = 'professional') => {
    setLoadingSummary(true);
    try {
      const response = await api.request('/resumes/builder/summary', {
        method: 'POST', body: JSON.stringify({ 
          resumeData: { name: contact.name, experience: experience.map(e => ({ title: e.title, company: e.company, bullets: e.bullets })), education, skills, projects, certifications }, 
          style, industry, targetRole 
        })
      });
      setSummary(response.data.summary);
      toast.success('Summary generated!');
    } catch (error) { toast.error('Failed to generate summary'); }
    finally { setLoadingSummary(false); }
  };

  // Save handler with improved error handling
  const saveResume = async () => {
    if (!contact.name || !contact.email) { toast.error('Please fill in name and email'); return; }
    if (experience.every(e => !e.title)) { toast.error('Please add at least one work experience'); return; }
    setSaving(true);
    try {
      const resumeData = {
        name: `${contact.name}'s Resume`,
        isPrimary: true,
        contactInfo: {
          name: contact.name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          location: contact.location || '',
          linkedin: contact.linkedin || '',
          portfolio: contact.portfolio || ''
        },
        summary: summary || '',
        industry: industry || 'general',
        targetRole: targetRole || '',
        workExperience: experience
          .filter(e => e.title) // Only include entries with a title
          .map(e => ({
            title: e.title || '',
            company: e.company || '',
            location: e.location || '',
            startDate: e.startDate || '',
            endDate: e.current ? 'Present' : (e.endDate || ''),
            bullets: e.bullets || []
          })),
        education: education
          .filter(e => e.school) // Only include entries with a school
          .map(e => ({
            school: e.school || '',
            degree: e.degree || '',
            field: e.field || '',
            graduation: e.graduation || '',
            gpa: e.gpa || '',
            location: e.location || ''
          })),
        skills: skills || [],
        projects: getActiveSections().includes('projects') 
          ? projects.filter(p => p.name).map(p => ({
              name: p.name || '',
              description: p.description || '',
              technologies: p.technologies || '',
              link: p.link || ''
            }))
          : [],
        publications: getActiveSections().includes('publications')
          ? publications.filter(p => p.title).map(p => ({
              title: p.title || '',
              journal: p.journal || '',
              year: p.year || '',
              link: p.link || ''
            }))
          : [],
        certifications: getActiveSections().includes('certifications')
          ? certifications.filter(c => c.name).map(c => ({
              name: c.name || '',
              issuer: c.issuer || '',
              year: c.year || '',
              expiry: c.expiry || ''
            }))
          : [],
        achievements: getActiveSections().includes('achievements')
          ? achievements.filter(a => a.title).map(a => ({
              title: a.title || '',
              description: a.description || ''
            }))
          : []
      };
      
      console.log('Saving resume data:', resumeData);
      await api.createResume(resumeData);
      toast.success('Resume saved!');
      navigate('/resumes');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save resume');
    }
    finally { setSaving(false); }
  };

  // Industry selector
  if (showIndustrySelector) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Resume Builder</h1>
            <p className="text-gray-600">First, tell us about your industry so we can customize your resume</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">What role are you targeting?</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Software Engineer, Marketing Manager, Research Scientist..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(INDUSTRY_SECTIONS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setIndustry(key)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  industry === key 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <span className={`font-medium ${industry === key ? 'text-purple-700' : 'text-gray-900'}`}>
                  {config.label}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Includes: {config.sections.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={() => industry && setShowIndustrySelector(false)}
            disabled={!industry}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Resume Builder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/resumes')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Resume Builder</h1>
              <p className="text-sm text-gray-500">{INDUSTRY_SECTIONS[industry]?.label} • {targetRole || 'General'}</p>
            </div>
          </div>
          <button onClick={saveResume} disabled={saving} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Resume
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        
        {/* CONTACT */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" /> Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="(555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="City, State" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input type="url" value={contact.linkedin} onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="linkedin.com/in/johndoe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio/Website</label>
              <input type="url" value={contact.portfolio} onChange={(e) => setContact({ ...contact, portfolio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="yourwebsite.com" />
            </div>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" /> Education
            </h2>
            <button onClick={addEducation} className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="p-4 bg-gray-50 rounded-lg relative">
                {education.length > 1 && (
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="School/University" />
                  <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Degree (e.g., B.S., M.S.)" />
                  <input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Field of Study" />
                  <input type="text" value={edu.location || ''} onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Location (e.g., Arlington, TX)" />
                  <input type="text" value={edu.graduation} onChange={(e) => updateEducation(edu.id, 'graduation', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Graduation Year" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" /> Work Experience
            </h2>
            <button onClick={addExperience} className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Position
            </button>
          </div>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="p-4 bg-gray-50 rounded-lg relative">
                {experience.length > 1 && (
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Job Title *" />
                  <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Company *" />
                  <input type="text" value={exp.location || ''} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Location (e.g., Portland, OR)" />
                  <input type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Start Date (e.g., Jan 2020)" />
                  <div className="flex items-center gap-2">
                    <input type="text" value={exp.current ? 'Present' : exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100" placeholder="End Date" />
                    <label className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                      <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="rounded text-purple-600" />
                      Current
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-purple-700 mb-1">Describe what you did (AI will generate bullet points)</label>
                  <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder={INDUSTRY_SECTIONS[industry]?.projectPlaceholder || "Describe your responsibilities and achievements..."} />
                </div>
                <button onClick={() => generateSuggestions(exp.id)} disabled={exp.loadingSuggestions || !exp.title || !exp.company}
                  className="w-full mb-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {exp.loadingSuggestions ? (<><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>) : (<><Wand2 className="w-4 h-4" /> Generate AI Suggestions</>)}
                </button>
                
                {/* Suggestions - with visual feedback for added items */}
                {exp.suggestions && (
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Suggestions</h4>
                    <p className="text-xs text-purple-600 mb-3">Click to add/remove bullet points to your resume</p>
                    {exp.suggestions.responsibilities?.map((resp, i) => {
                      const isAdded = isBulletAdded(exp.id, resp);
                      return (
                        <div 
                          key={i} 
                          className={`flex items-start gap-2 p-3 rounded border mb-2 cursor-pointer transition-all ${
                            isAdded 
                              ? 'bg-green-100 border-green-300 hover:bg-green-50' 
                              : 'bg-white border-purple-100 hover:bg-purple-50'
                          }`}
                          onClick={() => isAdded ? removeBulletFromSuggestion(exp.id, resp) : addBulletFromSuggestion(exp.id, resp)}
                        >
                          {isAdded && <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />}
                          <span className={`flex-1 text-sm ${isAdded ? 'text-green-800' : 'text-gray-700'}`}>{resp}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            isAdded 
                              ? 'text-green-700 bg-green-200' 
                              : 'text-purple-600 bg-purple-100'
                          }`}>
                            {isAdded ? '✓ Added' : '+ Add'}
                          </span>
                        </div>
                      );
                    })}
                    {exp.suggestions.skills?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <p className="text-sm font-medium text-purple-800 mb-2">Suggested Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.suggestions.skills.map((skill, i) => (
                            <button key={i} onClick={() => { if (!skills.includes(skill)) { setSkills([...skills, skill]); toast.success(`Added "${skill}"`); } }}
                              className={`px-2 py-1 text-xs rounded-full transition-all ${skills.includes(skill) ? 'bg-green-100 text-green-700' : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-100'}`}>
                              {skills.includes(skill) ? '✓ ' : '+ '}{skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Current bullets */}
                {exp.bullets.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Bullet Points ({exp.bullets.length}):</p>
                    {exp.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-gray-200">
                        <span className="text-gray-400">•</span>
                        <span className="flex-1 text-sm text-gray-700">{bullet}</span>
                        <button onClick={() => removeBullet(exp.id, i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PROJECTS - Conditional */}
        {getActiveSections().includes('projects') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-600" /> {INDUSTRY_SECTIONS[industry]?.projectLabel || 'Projects'}
              </h2>
              <button onClick={addProject} className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 bg-gray-50 rounded-lg relative">
                  {projects.length > 1 && (
                    <button onClick={() => removeProject(proj.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Project Name" />
                    <input type="text" value={proj.technologies} onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Technologies Used" />
                    <div className="md:col-span-2">
                      <textarea value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Brief description of the project..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLICATIONS - Conditional */}
        {getActiveSections().includes('publications') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" /> Publications
              </h2>
              <button onClick={addPublication} className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {publications.map((pub) => (
                <div key={pub.id} className="p-4 bg-gray-50 rounded-lg relative">
                  {publications.length > 1 && (
                    <button onClick={() => removePublication(pub.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input type="text" value={pub.title} onChange={(e) => updatePublication(pub.id, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Publication Title" />
                    </div>
                    <input type="text" value={pub.journal} onChange={(e) => updatePublication(pub.id, 'journal', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Journal/Conference" />
                    <input type="text" value={pub.year} onChange={(e) => updatePublication(pub.id, 'year', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Year" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS - Conditional */}
        {getActiveSections().includes('certifications') && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600" /> Certifications & Licenses
              </h2>
              <button onClick={addCertification} className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-4 bg-gray-50 rounded-lg relative">
                  {certifications.length > 1 && (
                    <button onClick={() => removeCertification(cert.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Certification Name" />
                    <input type="text" value={cert.issuer} onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Issuing Organization" />
                    <input type="text" value={cert.year} onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Year Obtained" />
                    <input type="text" value={cert.expiry} onChange={(e) => updateCertification(cert.id, 'expiry', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Expiration (if any)" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-purple-600" /> Skills</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Type a skill and press Enter" />
            <button onClick={addSkill} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            ))}
            {skills.length === 0 && <p className="text-gray-500 text-sm">Add skills or use AI suggestions from work experience.</p>}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" /> Professional Summary</h2>
          </div>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
            placeholder="Write a compelling professional summary or let AI generate one..." />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => generateSummary('professional')} disabled={loadingSummary} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1">
              {loadingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : '👔'} Professional
            </button>
            <button onClick={() => generateSummary('detailed')} disabled={loadingSummary} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">📝 Detailed</button>
            <button onClick={() => generateSummary('concise')} disabled={loadingSummary} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">✂️ Concise</button>
            <button onClick={() => generateSummary('impactful')} disabled={loadingSummary} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">⭐ Impactful</button>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-center pt-4">
          <button onClick={saveResume} disabled={saving} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center gap-2 text-lg">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save My Resume
          </button>
        </div>
      </div>
    </div>
  );
}
