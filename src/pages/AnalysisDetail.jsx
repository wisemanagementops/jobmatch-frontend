import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useGeneration } from '../context/GenerationContext';
import { useAuth } from '../context/AuthContext';
import TemplateSelector from '../components/TemplateSelector';
import {
  ArrowLeft, Loader2, Check, X, FileText,
  Mail, Copy, ExternalLink, Sparkles, Download,
  CheckCircle2, RefreshCw, Zap, Layout
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Packer } from 'docx';
import { saveAs } from 'file-saver';

export default function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addGeneration, updateGeneration } = useGeneration();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Resume data for generation
  const [resumeData, setResumeData] = useState(null);
  const [resumeText, setResumeText] = useState('');
  
  // Skill selection state
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  
  // Quick Win selection state
  const [selectedQuickWins, setSelectedQuickWins] = useState(new Set());
  
  // Generation state
  const [generatingResume, setGeneratingResume] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  
  // Template selector view mode
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);

  // Get user subscription status
  const userSubscription = user?.subscription_status === 'pro' ? 'pro' : 'free';

  useEffect(() => {
    loadAnalysis();
    loadResume();
  }, [id]);

  const loadAnalysis = async () => {
    try {
      const response = await api.getAnalysis(id);
      setAnalysis(response.data);
    } catch (error) {
      toast.error('Failed to load analysis');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async () => {
    try {
      const response = await api.getResumes();
      const resumes = response.data || [];
      const primaryResume = resumes.find(r => r.is_primary) || resumes[0];
      if (primaryResume) {
        const fullResume = await api.getResume(primaryResume.id);
        setResumeData(fullResume.data);
        // Also get raw text
        const text = buildResumeText(fullResume.data);
        setResumeText(text);
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
    }
  };

  // ============== Derived Data ==============
  const { allQuickWins, summary } = useMemo(() => {
    if (!analysis) return { allQuickWins: [], summary: '' };
    
    const result = analysis.analysis_result || analysis.result || {};
    const match = result.match || result;
    
    // Build quick wins array
    const quickWins = [];
    const qw = match.quick_wins || result.quick_wins || [];
    const criticalKeywords = match.ats_optimization?.critical_missing_keywords || [];
    
    // Add quick wins
    qw.slice(0, 5).forEach((item, idx) => {
      const text = typeof item === 'object' ? (item.action || item.text || JSON.stringify(item)) : item;
      quickWins.push({
        id: `qw-${idx}`,
        text: text,
        type: 'quick_win'
      });
    });
    
    // Add critical keywords as a quick win if there are few quick wins
    if (criticalKeywords.length > 0 && qw.length < 3) {
      quickWins.push({
        id: 'qw-keywords',
        text: `Add keywords: ${criticalKeywords.slice(0, 4).join(', ')}`,
        type: 'keywords'
      });
    }
    
    // Get summary
    const summaryText = match.summary || result.summary || '';
    
    return { allQuickWins: quickWins, summary: summaryText };
  }, [analysis]);

  // ============== Selection Handlers ==============
  const toggleSkill = (skill) => {
    const newSelected = new Set(selectedSkills);
    if (newSelected.has(skill)) {
      newSelected.delete(skill);
    } else {
      newSelected.add(skill);
    }
    setSelectedSkills(newSelected);
  };

  const toggleQuickWin = useCallback((qwId) => {
    setSelectedQuickWins(prev => {
      const newSet = new Set(prev);
      if (newSet.has(qwId)) {
        newSet.delete(qwId);
      } else {
        newSet.add(qwId);
      }
      return newSet;
    });
  }, []);

  const selectAllSkills = () => {
    const allSkills = analysis?.missing_skills || [];
    setSelectedSkills(new Set(allSkills));
  };

  const deselectAllSkills = () => {
    setSelectedSkills(new Set());
  };

  const buildResumeText = (resume) => {
    if (!resume) return '';
    
    // If raw_text exists, use it
    if (resume.raw_text) return resume.raw_text;
    if (resume.content) return resume.content;
    
    let text = '';
    
    // Contact info
    if (resume.contact_info) {
      const c = resume.contact_info;
      if (c.name) text += `${c.name}\n`;
      if (c.email) text += `${c.email}\n`;
      if (c.phone) text += `${c.phone}\n`;
      if (c.location) text += `${c.location}\n`;
      text += '\n';
    }
    
    // Summary
    if (resume.summary) {
      text += `SUMMARY\n${resume.summary}\n\n`;
    }
    
    // Work experience
    if (resume.work_experience?.length > 0) {
      text += 'WORK EXPERIENCE\n';
      for (const job of resume.work_experience) {
        text += `${job.title || ''} at ${job.company || ''}`;
        // Handle both camelCase (AI-built) and snake_case (uploaded) field names
        const startDate = job.startDate || job.start_date;
        const endDate = job.endDate || job.end_date || 'Present';
        if (startDate) text += ` (${startDate} - ${endDate})`;
        if (job.location) text += ` | ${job.location}`;
        text += '\n';
        if (job.bullets?.length > 0) {
          for (const bullet of job.bullets) {
            text += `• ${bullet}\n`;
          }
        }
        text += '\n';
      }
    }
    
    // Education
    if (resume.education?.length > 0) {
      text += 'EDUCATION\n';
      for (const edu of resume.education) {
        text += `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''} - ${edu.school || ''}`;
        if (edu.graduation) text += ` (${edu.graduation})`;
        text += '\n';
      }
      text += '\n';
    }
    
    // Skills
    if (resume.skills?.length > 0) {
      text += `SKILLS\n${resume.skills.join(', ')}\n\n`;
    }
    
    return text;
  };

  // ============== Generation Functions ==============

  const generateTailoredResume = async () => {
    if (!resumeData && !resumeText) {
      toast.error('Please create a resume first');
      navigate('/resumes');
      return;
    }

    const text = resumeText || buildResumeText(resumeData);
    const selectedQuickWinTexts = allQuickWins
      .filter(qw => selectedQuickWins.has(qw.id))
      .map(qw => qw.text);
    
    // Add to global generation tracker
    const genId = Date.now();
    addGeneration({
      id: genId,
      type: 'resume',
      jobTitle: analysis.job_title,
      companyName: analysis.company_name,
      analysisId: id,
      status: 'generating'
    });

    setGeneratingResume(true);
    
    try {
      await api.tailorResume(
        id,
        analysis.job_description,
        text,
        {
          selectedSkills: Array.from(selectedSkills),
          quickWins: selectedQuickWinTexts
        }
      );
      
      // Reload from database
      const reloadedAnalysis = await api.getAnalysis(id);
      setAnalysis(reloadedAnalysis.data);
      
      // Update generation status to completed
      updateGeneration(genId, { status: 'completed' });
      
      setActiveTab('tailored');
    } catch (error) {
      toast.error(error.message || 'Failed to generate tailored resume');
      updateGeneration(genId, { status: 'failed' });
    } finally {
      setGeneratingResume(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!resumeData && !resumeText) {
      toast.error('Please create a resume first');
      navigate('/resumes');
      return;
    }

    const text = resumeText || buildResumeText(resumeData);
    
    // Add to global generation tracker
    const genId = Date.now() + 1; // +1 to avoid collision with resume
    addGeneration({
      id: genId,
      type: 'cover',
      jobTitle: analysis.job_title,
      companyName: analysis.company_name,
      analysisId: id,
      status: 'generating'
    });

    setGeneratingCover(true);
    
    try {
      await api.generateCoverLetter(
        id,
        analysis.job_description,
        text,
        analysis.company_name,
        'professional'
      );
      
      // Reload from database
      const reloadedAnalysis = await api.getAnalysis(id);
      setAnalysis(reloadedAnalysis.data);
      
      // Update generation status to completed
      updateGeneration(genId, { status: 'completed' });
      
      setActiveTab('cover');
    } catch (error) {
      toast.error(error.message || 'Failed to generate cover letter');
      updateGeneration(genId, { status: 'failed' });
    } finally {
      setGeneratingCover(false);
    }
  };

  // ============== Copy & Download Functions ==============
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadAsText = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    downloadBlob(blob, filename + '.txt');
  };

  const downloadAsDocx = async (content, filename) => {
    try {
      const sectionBorder = {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' }
      };
      const children = [];
      const lines = content.split('\n');
      let i = 0;

      // Try to detect name (first non-empty line)
      while (i < lines.length && !lines[i].trim()) i++;
      if (i < lines.length) {
        const name = lines[i].trim();
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: name, bold: true, size: 32, font: 'Calibri' })]
        }));
        i++;
      }

      // Try to detect contact line (next non-empty line with email/phone/pipe)
      while (i < lines.length && !lines[i].trim()) i++;
      if (i < lines.length && (lines[i].includes('@') || lines[i].includes('|') || lines[i].includes('•'))) {
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: lines[i].trim(), size: 20, color: '555555', font: 'Calibri' })]
        }));
        i++;
      }

      // Process remaining lines
      for (; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Section headers (ALL CAPS, short lines, or common section names)
        if (
          (trimmed === trimmed.toUpperCase() && trimmed.length < 40 && !trimmed.startsWith('•') && !trimmed.startsWith('-')) ||
          /^(PROFESSIONAL SUMMARY|SUMMARY|EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|TECHNICAL SKILLS|OBJECTIVE)/i.test(trimmed)
        ) {
          children.push(new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            border: sectionBorder,
            children: [new TextRun({ text: trimmed, bold: true, size: 24, font: 'Calibri' })]
          }));
        }
        // Bullet points
        else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
          children.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [new TextRun({ text: trimmed.replace(/^[•\-\*]\s*/, ''), size: 21, font: 'Calibri' })]
          }));
        }
        // Regular text
        else {
          children.push(new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: trimmed, size: 21, font: 'Calibri' })]
          }));
        }
      }

      const doc = new Document({
        sections: [{
          properties: {
            page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } }
          },
          children
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename + '.docx');
      toast.success('Downloaded as Word!');
    } catch (error) {
      console.error('DOCX generation error:', error);
      // Fallback to RTF
      const rtf = createRtf(content);
      const blob = new Blob([rtf], { type: 'application/rtf' });
      downloadBlob(blob, filename + '.rtf');
    }
  };

  const downloadAsPdf = (content, filename, type = 'resume') => {
    const htmlContent = type === 'resume' ? formatResumeAsHtml(content) : formatCoverLetterAsHtml(content);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              font-size: 11pt; 
              line-height: 1.5; 
              max-width: 7.5in; 
              margin: 0.75in auto; 
              color: #333;
            }
            .resume-header { text-align: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #333; }
            .resume-name { font-size: 20pt; font-weight: bold; margin-bottom: 4px; }
            .resume-contact { font-size: 10pt; color: #555; }
            .resume-section { margin-bottom: 14px; }
            .section-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #999; padding-bottom: 2px; margin-bottom: 8px; color: #222; }
            .experience-item { margin-bottom: 10px; }
            .item-header { display: flex; justify-content: space-between; flex-wrap: wrap; }
            .item-title { font-weight: 600; }
            .item-subtitle { font-style: italic; color: #555; }
            .item-date { color: #666; font-size: 10pt; }
            .item-bullets { margin: 4px 0 0 18px; padding: 0; }
            .item-bullets li { margin-bottom: 3px; }
            p { margin: 0 0 12px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>setTimeout(() => { window.print(); window.close(); }, 300);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  // ============== Render ==============
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!analysis) return null;

  const result = analysis.analysis_result || analysis.result || {};
  const match = result.match || result;
  const missingSkills = analysis.missing_skills || match.missing_skills || [];
  const matchingSkills = analysis.matching_skills || match.matching_skills || [];
  const atsScore = analysis.ats_score || match.ats_optimization?.estimated_ats_score || Math.round(analysis.match_score * 0.8);

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/history')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{analysis.job_title}</h1>
          <p className="text-gray-600">{analysis.company_name}</p>
        </div>
        {analysis.job_url && (
          <a
            href={analysis.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
          >
            View Job <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Score cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className={`p-5 rounded-xl ${analysis.match_score >= 70 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <p className="text-sm text-gray-600 mb-1">Match Score</p>
          <p className={`text-3xl font-bold ${analysis.match_score >= 70 ? 'text-green-700' : 'text-amber-700'}`}>
            {analysis.match_score}%
          </p>
        </div>
        <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200">
          <p className="text-sm text-gray-600 mb-1">ATS Score</p>
          <p className="text-3xl font-bold text-indigo-700">{atsScore}%</p>
        </div>
      </div>

      {/* Improved score banner */}
      {analysis.tailored_resume_score && analysis.tailored_resume_score > analysis.match_score && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Score Improved!</p>
              <p className="text-sm text-green-700">
                Your tailored resume scored {analysis.tailored_resume_score}% 
                (+{analysis.tailored_resume_score - analysis.match_score}% improvement)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'overview', label: 'Overview', icon: '📊', color: 'indigo' },
            { id: 'tailored', label: 'Tailored Resume', icon: '📄', color: 'green' },
            { id: 'cover', label: 'Cover Letter', icon: '✉️', color: 'purple' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const hasContent = (tab.id === 'tailored' && analysis.tailored_resume_text) || 
                              (tab.id === 'cover' && analysis.cover_letter);
            
            // Color classes based on tab
            const colorClasses = {
              indigo: isActive 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-indigo-600 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50',
              green: isActive 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white text-green-600 border-green-300 hover:border-green-500 hover:bg-green-50',
              purple: isActive 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-white text-purple-600 border-purple-300 hover:border-purple-500 hover:bg-purple-50'
            };
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm border-2 transition-all shadow-sm ${colorClasses[tab.color]}`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
                {/* Show green checkmark if content exists */}
                {hasContent && (
                  <span className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    isActive ? 'bg-white/30 text-white' : 'bg-green-100 text-green-600'
                  }`}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Wins Section */}
          {allQuickWins.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Quick Wins
                <span className="text-xs text-gray-400 font-normal">(click to select/deselect)</span>
              </h3>
              <ul className="space-y-2">
                {allQuickWins.map((qw) => {
                  const isSelected = selectedQuickWins.has(qw.id);
                  return (
                    <li
                      key={qw.id}
                      onClick={() => toggleQuickWin(qw.id)}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200'
                          : 'border-gray-200 bg-gray-50 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-amber-500 flex-shrink-0">⚡</span>
                      <span className="text-sm text-gray-700 flex-1">{qw.text}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                    </li>
                  );
                })}
              </ul>
              {selectedQuickWins.size > 0 && (
                <p className="mt-3 text-sm text-amber-600 font-medium">
                  {selectedQuickWins.size} quick win{selectedQuickWins.size !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          {/* Summary Section */}
          {summary && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📝</span> Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Matching Skills */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Matching Skills ({matchingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchingSkills.map((skill, i) => {
                  const skillName = typeof skill === 'object' ? (skill.skill || skill.name || String(skill)) : String(skill);
                  return (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {skillName}
                    </span>
                  );
                })}
                {matchingSkills.length === 0 && (
                  <p className="text-gray-500 text-sm">No matching skills identified</p>
                )}
              </div>
            </div>

            {/* Missing Skills - SELECTABLE */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" />
                  Missing Skills ({missingSkills.length})
                </h3>
                {missingSkills.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllSkills}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Select all
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={deselectAllSkills}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      Deselect all
                    </button>
                  </div>
                )}
              </div>
              
              {missingSkills.length > 0 && (
                <p className="text-xs text-gray-500 mb-3">
                  Click to select skills you actually have to add them to your tailored resume
                </p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, i) => {
                  const skillName = typeof skill === 'object' ? (skill.skill || skill.name || String(skill)) : String(skill);
                  const isSelected = selectedSkills.has(skillName);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleSkill(skillName)}
                      className={`px-3 py-1 rounded-full text-sm border-2 transition-all ${
                        isSelected
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-400'
                          : 'bg-red-50 text-red-700 border-transparent hover:border-red-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                      {skillName}
                    </button>
                  );
                })}
                {missingSkills.length === 0 && (
                  <p className="text-gray-500 text-sm">No missing skills - great match!</p>
                )}
              </div>
              
              {selectedSkills.size > 0 && (
                <p className="mt-3 text-sm text-indigo-600 font-medium">
                  {selectedSkills.size} skill{selectedSkills.size !== 1 ? 's' : ''} selected to add
                </p>
              )}
            </div>
          </div>

          {/* Generate Buttons */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Generate Customized Documents
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Create a tailored resume and cover letter optimized for this job.
              {(selectedSkills.size > 0 || selectedQuickWins.size > 0) && (
                <span className="text-indigo-600 font-medium">
                  {' '}Your selections ({selectedSkills.size} skills, {selectedQuickWins.size} quick wins) will be incorporated.
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={generateTailoredResume}
                disabled={generatingResume}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingResume ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Resume...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Tailored Resume
                  </>
                )}
              </button>
              <button
                onClick={generateCoverLetter}
                disabled={generatingCover}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingCover ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Cover Letter...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Documents Section - shows if resume or cover letter exists */}
          {(analysis.tailored_resume_text || analysis.cover_letter) && (
            <div className="bg-white rounded-xl border-2 border-green-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Your Generated Documents
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {analysis.tailored_resume_text && (
                  <button
                    onClick={() => setActiveTab('tailored')}
                    className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Tailored Resume</p>
                      <p className="text-sm text-green-600">Click to view →</p>
                    </div>
                    {analysis.tailored_resume_score && (
                      <span className="text-sm font-bold text-green-700">{analysis.tailored_resume_score}%</span>
                    )}
                  </button>
                )}
                {analysis.cover_letter && (
                  <button
                    onClick={() => setActiveTab('cover')}
                    className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-purple-800">Cover Letter</p>
                      <p className="text-sm text-purple-600">Click to view →</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tailored' && (
        <div>
          {analysis.tailored_resume_text ? (
            <>
              {/* View Toggle - Professional Templates Only */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Professional Templates</h3>
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                </div>
                
                {analysis.tailored_resume_score && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Score: {analysis.tailored_resume_score}%</span>
                  </div>
                )}
              </div>

              {/* Template Selector View */}
              <TemplateSelector
                resumeText={analysis.tailored_resume_text}
                userSubscription={userSubscription}
                companyName={analysis.company_name}
                onDownloadWord={() => downloadAsDocx(analysis.tailored_resume_text, `resume-${analysis.company_name}`)}
                onDownloadText={() => downloadAsText(analysis.tailored_resume_text, `resume-${analysis.company_name}`)}
              />
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No tailored resume generated yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Generate a resume customized for this job position. 
                  Select any missing skills you actually have and quick wins to include them.
                </p>
                <button
                  onClick={generateTailoredResume}
                  disabled={generatingResume}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {generatingResume ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generate Tailored Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'cover' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {analysis.cover_letter ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Cover Letter</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(analysis.cover_letter)}
                    className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
              </div>
              
              {/* Download Options */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 mr-2">Download as:</span>
                <button
                  onClick={() => downloadAsText(analysis.cover_letter, `cover-letter-${analysis.company_name}`)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg"
                >
                  📄 TXT
                </button>
                <button
                  onClick={() => downloadAsDocx(analysis.cover_letter, `cover-letter-${analysis.company_name}`)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg"
                >
                  📝 DOCX
                </button>
                <button
                  onClick={() => downloadAsPdf(analysis.cover_letter, `cover-letter-${analysis.company_name}`, 'cover')}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg"
                >
                  📥 PDF
                </button>
                <button
                  onClick={generateCoverLetter}
                  disabled={generatingCover}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg ml-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${generatingCover ? 'animate-spin' : ''}`} /> 
                  Regenerate
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 text-sm whitespace-pre-wrap max-h-[600px] overflow-y-auto leading-relaxed">
                {analysis.cover_letter}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No cover letter generated yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Generate a professional cover letter tailored for this position at {analysis.company_name}.
              </p>
              <button
                onClick={generateCoverLetter}
                disabled={generatingCover}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {generatingCover ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============== Utility Functions ==============
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createRtf(content) {
  // Create RTF format
  let rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fswiss Arial;}}
{\\colortbl;\\red0\\green0\\blue0;\\red51\\green51\\blue51;}
\\f0\\fs22\\cf1`;

  // Clean and convert content to RTF
  const cleanText = content
    .replace(/===HEADER===/g, '')
    .replace(/===SECTION:[^=]+===/g, '\n\n')
    .trim();
  
  // Escape special RTF characters and convert
  const rtfText = cleanText
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\n/g, '\\par\n');
  
  rtf += rtfText;
  rtf += '}';
  
  return rtf;
}

function formatResumeAsHtml(text) {
  if (!text) return '';
  
  let html = '<div class="resume-document">';
  
  // Check for structured format
  if (text.includes('===HEADER===') || text.includes('===SECTION:')) {
    const sections = text.split(/===([^=]+)===/g).filter(s => s.trim());
    
    for (let i = 0; i < sections.length; i += 2) {
      const sectionName = sections[i]?.trim();
      const sectionContent = sections[i + 1]?.trim() || '';
      
      if (sectionName === 'HEADER') {
        const lines = sectionContent.split('\n').filter(l => l.trim());
        if (lines.length > 0) {
          html += `<div class="resume-header">`;
          html += `<div class="resume-name">${escapeHtml(lines[0])}</div>`;
          if (lines.length > 1) {
            html += `<div class="resume-contact">${escapeHtml(lines.slice(1).join(' | '))}</div>`;
          }
          html += `</div>`;
        }
      } else if (sectionName.startsWith('SECTION:')) {
        const title = sectionName.replace('SECTION:', '').trim();
        html += `<div class="resume-section">`;
        html += `<div class="section-title">${escapeHtml(title)}</div>`;
        html += formatSectionContent(sectionContent);
        html += `</div>`;
      }
    }
  } else {
    // Parse unstructured text
    html += parseUnstructuredText(text);
  }
  
  html += '</div>';
  return html;
}

function formatSectionContent(content) {
  const lines = content.split('\n').filter(l => l.trim());
  let html = '';
  let inBulletList = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      if (!inBulletList) {
        html += '<ul class="item-bullets">';
        inBulletList = true;
      }
      html += `<li>${escapeHtml(trimmed.replace(/^[•\-]\s*/, ''))}</li>`;
    } else {
      if (inBulletList) {
        html += '</ul>';
        inBulletList = false;
      }
      if (line.includes('|') || line.match(/\d{4}/)) {
        html += `<div class="item-header"><span class="item-title">${escapeHtml(trimmed)}</span></div>`;
      } else if (trimmed) {
        html += `<p>${escapeHtml(trimmed)}</p>`;
      }
    }
  }
  
  if (inBulletList) html += '</ul>';
  return html;
}

function parseUnstructuredText(text) {
  let html = '';
  const lines = text.split('\n');
  let inBulletList = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inBulletList) {
        html += '</ul>';
        inBulletList = false;
      }
      continue;
    }
    
    if (/^(EDUCATION|EXPERIENCE|SKILLS|PROJECTS|SUMMARY|OBJECTIVE|CERTIFICATIONS)/i.test(trimmed) ||
        (trimmed === trimmed.toUpperCase() && trimmed.length < 30 && !trimmed.includes('•'))) {
      if (inBulletList) {
        html += '</ul>';
        inBulletList = false;
      }
      html += `<div class="resume-section"><div class="section-title">${escapeHtml(trimmed)}</div>`;
    } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      if (!inBulletList) {
        html += '<ul class="item-bullets">';
        inBulletList = true;
      }
      html += `<li>${escapeHtml(trimmed.replace(/^[•\-\*]\s*/, ''))}</li>`;
    } else {
      if (inBulletList) {
        html += '</ul>';
        inBulletList = false;
      }
      html += `<p>${escapeHtml(trimmed)}</p>`;
    }
  }
  
  if (inBulletList) html += '</ul>';
  return html;
}

function formatCoverLetterAsHtml(text) {
  if (!text) return '';
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  return paragraphs.map(p => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
}
