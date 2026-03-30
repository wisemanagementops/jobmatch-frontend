import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { 
  FileText, Plus, MoreVertical, Star, Trash2, Edit, 
  Copy, Loader2, ChevronRight, Upload, Wand2, X, Download, Eye
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function Resumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [viewingResume, setViewingResume] = useState(null);
  const [viewUrl, setViewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await api.getResumes();
      setResumes(response.data || []);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await api.setPrimaryResume(id);
      toast.success('Primary resume updated');
      loadResumes();
    } catch (error) {
      toast.error('Failed to update primary resume');
    }
    setMenuOpen(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.deleteResume(id);
      toast.success('Resume deleted');
      loadResumes();
    } catch (error) {
      toast.error('Failed to delete resume');
    }
    setMenuOpen(null);
  };

  const handleDuplicate = async (resume) => {
    try {
      await api.createResume({
        name: `Copy of ${resume.name}`,
        contactInfo: resume.contact_info,
        summary: resume.summary,
        workExperience: resume.work_experience,
        education: resume.education,
        skills: resume.skills
      });
      toast.success('Resume duplicated!');
      loadResumes();
    } catch (error) {
      toast.error('Failed to duplicate');
    }
    setMenuOpen(null);
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('name', file.name.replace(/\.[^/.]+$/, ''));
      await api.uploadResume(formData);
      toast.success('Resume uploaded successfully!');
      setShowNewModal(false);
      loadResumes();
    } catch (error) {
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
  };

  // View resume - opens in viewer modal
  const handleView = async (resume) => {
    setViewingResume(resume);
    
    // For uploaded files, create a blob URL to view
    if (resume.original_file) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/resumes/${resume.id}/view`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setViewUrl(url);
        }
      } catch (error) {
        console.error('View error:', error);
      }
    }
  };

  const closeViewer = () => {
    if (viewUrl) {
      URL.revokeObjectURL(viewUrl);
      setViewUrl(null);
    }
    setViewingResume(null);
  };

  // Download original file
  const handleDownload = async (resume) => {
    try {
      const response = await api.downloadResume(resume.id);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      const ext = (resume.original_file_type || 'pdf').toLowerCase();
      link.setAttribute('download', `${resume.name}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  // Download AI-built resume as formatted DOCX
  const handleDownloadDocx = async (resume) => {
    try {
      toast.loading('Generating formatted resume...');
      const response = await api.downloadResumeDocx(resume.id);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.name}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('Resume downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate resume');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600">Manage your resume versions</p>
        </div>
        <button onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
          <Plus className="w-5 h-5" /> New Resume
        </button>
      </div>

      {/* New Resume Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button onClick={() => setShowNewModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Resume</h2>
            <p className="text-gray-600 mb-6">Choose how you want to add your resume</p>
            
            <div className="space-y-4">
              <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])} />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Upload Existing Resume</h3>
                    <p className="text-sm text-gray-500">Your file will be stored as-is (PDF, DOC, DOCX)</p>
                  </div>
                  {uploading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />}
                </div>
                {dragActive && <p className="text-center text-indigo-600 mt-3 font-medium">Drop your file here!</p>}
              </div>
              
              <Link to="/resume-builder" onClick={() => setShowNewModal(false)}
                className="flex items-center gap-4 border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:bg-purple-50 transition-all">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Build with AI</h3>
                  <p className="text-sm text-gray-500">Create a new resume with AI-powered suggestions</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      {viewingResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
              <h3 className="font-semibold text-gray-900">{viewingResume.name}</h3>
              <button onClick={closeViewer} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {/* For uploaded PDFs - show in iframe */}
              {viewingResume.original_file && viewUrl && viewingResume.original_file_type === 'PDF' && (
                <iframe 
                  src={viewUrl} 
                  className="w-full h-[70vh] bg-white rounded-lg shadow"
                  title="Resume Preview"
                />
              )}
              
              {/* For uploaded DOCX - show extracted text or download prompt */}
              {viewingResume.original_file && viewingResume.original_file_type !== 'PDF' && (
                <div className="bg-white rounded-lg shadow p-6">
                  {viewingResume.raw_text && viewingResume.raw_text !== '[File uploaded successfully]' && viewingResume.raw_text !== '[Could not extract text]' ? (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{viewingResume.raw_text}</pre>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">This is a Word document. Click below to download and view it.</p>
                      <button onClick={() => handleDownload(viewingResume)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 inline-flex items-center gap-2">
                        <Download className="w-5 h-5" /> Download Original
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* For AI-built resumes - show formatted preview */}
              {!viewingResume.original_file && (
                <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
                    <h1 className="text-2xl font-bold text-gray-900">{viewingResume.contact_info?.name || 'Your Name'}</h1>
                    <p className="text-gray-600 mt-1">
                      {[viewingResume.contact_info?.email, viewingResume.contact_info?.phone, viewingResume.contact_info?.location]
                        .filter(Boolean).join(' • ')}
                    </p>
                  </div>
                  
                  {/* Summary */}
                  {viewingResume.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">PROFESSIONAL SUMMARY</h2>
                      <p className="text-gray-700 text-sm leading-relaxed">{viewingResume.summary}</p>
                    </div>
                  )}
                  
                  {/* Experience */}
                  {viewingResume.work_experience?.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">WORK EXPERIENCE</h2>
                      {viewingResume.work_experience.map((exp, i) => (
                        <div key={i} className="mb-4">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                            <span className="text-sm text-gray-500 italic">{exp.startDate} - {exp.endDate || 'Present'}</span>
                          </div>
                          <p className="text-gray-700 font-medium">{exp.company}</p>
                          <ul className="mt-2 space-y-1">
                            {exp.bullets?.map((bullet, j) => (
                              <li key={j} className="text-sm text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0">{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Education */}
                  {viewingResume.education?.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>
                      {viewingResume.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                            <span className="text-sm text-gray-500 italic">{edu.graduation}</span>
                          </div>
                          <p className="text-gray-700">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Skills */}
                  {viewingResume.skills?.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3">SKILLS</h2>
                      <p className="text-sm text-gray-700">{viewingResume.skills.join(' • ')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end gap-2 flex-shrink-0">
              {viewingResume.original_file ? (
                <button onClick={() => handleDownload(viewingResume)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download Original
                </button>
              ) : (
                <button onClick={() => handleDownloadDocx(viewingResume)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download as Word
                </button>
              )}
              <button onClick={closeViewer} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Resume List */}
      {resumes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h2>
          <p className="text-gray-600 mb-6">Upload an existing resume or create one with our AI-powered builder</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              <Upload className="w-5 h-5" /> Upload Resume
            </button>
            <Link to="/resume-builder"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
              <Wand2 className="w-5 h-5" /> Build with AI
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${resume.original_file ? 'bg-blue-50' : 'bg-purple-50'}`}>
                  <FileText className={`w-6 h-6 ${resume.original_file ? 'text-blue-600' : 'text-purple-600'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{resume.name}</h3>
                    {resume.is_primary && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3 fill-current" /> Primary
                      </span>
                    )}
                    {resume.original_file && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {resume.original_file_type}
                      </span>
                    )}
                    {!resume.original_file && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        AI Built
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Updated {new Date(resume.updated_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleView(resume)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center gap-1">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  
                  {resume.original_file ? (
                    <button onClick={() => handleDownload(resume)}
                      className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center gap-1">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleDownloadDocx(resume)}
                        className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center gap-1">
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <Link to={`/resumes/${resume.id}`}
                        className="px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors flex items-center gap-1">
                        <Edit className="w-4 h-4" /> Edit
                      </Link>
                    </>
                  )}
                  
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === resume.id ? null : resume.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {menuOpen === resume.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          {!resume.is_primary && (
                            <button onClick={() => handleSetPrimary(resume.id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
                              <Star className="w-4 h-4" /> Set as Primary
                            </button>
                          )}
                          <button onClick={() => handleDuplicate(resume)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50">
                            <Copy className="w-4 h-4" /> Duplicate
                          </button>
                          <button onClick={() => handleDelete(resume.id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
