import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Sparkles } from 'lucide-react';

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      const response = await api.getResume(id);
      setResume(response.data);
    } catch (error) {
      toast.error('Failed to load resume');
      navigate('/resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateResume(id, {
        name: resume.name,
        contactInfo: resume.contact_info,
        summary: resume.summary,
        workExperience: resume.work_experience,
        education: resume.education,
        skills: resume.skills,
      });
      toast.success('Resume saved');
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setResume(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/resumes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <input
              type="text"
              value={resume.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="text-xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <div className="space-y-6">
        {/* Contact Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={resume.contact_info?.name || ''}
                onChange={(e) => updateField('contact_info', { ...resume.contact_info, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={resume.contact_info?.email || ''}
                onChange={(e) => updateField('contact_info', { ...resume.contact_info, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={resume.contact_info?.phone || ''}
                onChange={(e) => updateField('contact_info', { ...resume.contact_info, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={resume.contact_info?.location || ''}
                onChange={(e) => updateField('contact_info', { ...resume.contact_info, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Professional Summary</h2>
            <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
              <Sparkles className="w-4 h-4" /> AI Enhance
            </button>
          </div>
          <textarea
            value={resume.summary || ''}
            onChange={(e) => updateField('summary', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Write a compelling professional summary..."
          />
        </section>

        {/* Work Experience */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
            <button
              onClick={() => {
                const newExp = { company: '', title: '', start: '', end: '', bullets: [] };
                updateField('work_experience', [...(resume.work_experience || []), newExp]);
              }}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="w-4 h-4" /> Add Position
            </button>
          </div>
          
          {(resume.work_experience || []).map((exp, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-3">
                <div className="grid sm:grid-cols-2 gap-3 flex-1">
                  <input
                    type="text"
                    value={exp.title || ''}
                    onChange={(e) => {
                      const updated = [...resume.work_experience];
                      updated[index] = { ...exp, title: e.target.value };
                      updateField('work_experience', updated);
                    }}
                    placeholder="Job Title"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => {
                      const updated = [...resume.work_experience];
                      updated[index] = { ...exp, company: e.target.value };
                      updateField('work_experience', updated);
                    }}
                    placeholder="Company"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = resume.work_experience.filter((_, i) => i !== index);
                    updateField('work_experience', updated);
                  }}
                  className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={(exp.bullets || []).join('\n')}
                onChange={(e) => {
                  const updated = [...resume.work_experience];
                  updated[index] = { ...exp, bullets: e.target.value.split('\n').filter(b => b.trim()) };
                  updateField('work_experience', updated);
                }}
                rows={3}
                placeholder="• Achievement or responsibility (one per line)"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
              />
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Education</h2>
            <button
              onClick={() => {
                const newEdu = { school: '', degree: '', field: '', graduation: '', gpa: '' };
                updateField('education', [...(resume.education || []), newEdu]);
              }}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>

          {(!resume.education || resume.education.length === 0) && (
            <p className="text-sm text-gray-500 italic">No education entries. Click "Add Education" to add one.</p>
          )}

          {(resume.education || []).map((edu, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-3">
                <div className="grid sm:grid-cols-2 gap-3 flex-1">
                  <input
                    type="text"
                    value={edu.school || ''}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[index] = { ...edu, school: e.target.value };
                      updateField('education', updated);
                    }}
                    placeholder="School / University"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[index] = { ...edu, degree: e.target.value };
                      updateField('education', updated);
                    }}
                    placeholder="Degree (e.g., B.S., M.S.)"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={edu.field || ''}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[index] = { ...edu, field: e.target.value };
                      updateField('education', updated);
                    }}
                    placeholder="Field of Study"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={edu.location || ''}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[index] = { ...edu, location: e.target.value };
                      updateField('education', updated);
                    }}
                    placeholder="Location (e.g., Arlington, TX)"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={edu.graduation || ''}
                    onChange={(e) => {
                      const updated = [...resume.education];
                      updated[index] = { ...edu, graduation: e.target.value };
                      updateField('education', updated);
                    }}
                    placeholder="Graduation Year"
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = resume.education.filter((_, i) => i !== index);
                    updateField('education', updated);
                  }}
                  className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
          <input
            type="text"
            value={(resume.skills || []).join(', ')}
            onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            placeholder="JavaScript, Python, Project Management, Communication..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-sm text-gray-500 mt-2">Separate skills with commas</p>
        </section>
      </div>
    </div>
  );
}
