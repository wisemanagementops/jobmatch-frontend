/**
 * Compact Resume Template
 * Dense layout that fits more content, two-column sections
 * Best for: Senior roles, candidates with extensive experience
 */

export default function CompactTemplate({ resume, accentColor = '#0f766e' }) {
  if (!resume) return null;

  return (
    <div 
      className="bg-white font-sans text-gray-800"
      style={{ 
        width: '8.5in', 
        minHeight: '11in', 
        padding: '0.5in',
        fontSize: '9pt',
        lineHeight: '1.35'
      }}
    >
      {/* Compact Header */}
      <header className="mb-4 pb-3 border-b-2" style={{ borderColor: accentColor }}>
        <div className="flex justify-between items-end">
          <h1 
            className="text-2xl font-bold"
            style={{ color: accentColor }}
          >
            {resume.name || 'Your Name'}
          </h1>
          <div className="text-right text-xs text-gray-600">
            {resume.contact?.email && <div>{resume.contact.email}</div>}
            {resume.contact?.phone && <div>{resume.contact.phone}</div>}
            {resume.contact?.location && <div>{resume.contact.location}</div>}
          </div>
        </div>
      </header>

      {/* Summary - Full Width */}
      {resume.summary && (
        <section className="mb-3">
          <h2 
            className="text-xs font-bold uppercase mb-1"
            style={{ color: accentColor }}
          >
            Summary
          </h2>
          <p className="text-gray-700">{resume.summary}</p>
        </section>
      )}

      {/* Skills - Two Column Grid */}
      {resume.skills?.length > 0 && (
        <section className="mb-3">
          <h2 
            className="text-xs font-bold uppercase mb-1"
            style={{ color: accentColor }}
          >
            Technical Skills
          </h2>
          <div className="grid grid-cols-4 gap-x-4 gap-y-0.5">
            {resume.skills.map((skill, idx) => (
              <span key={idx} className="text-gray-700 flex items-center">
                <span 
                  className="w-1 h-1 rounded-full mr-1.5"
                  style={{ backgroundColor: accentColor }}
                />
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <section className="mb-3">
          <h2 
            className="text-xs font-bold uppercase mb-2"
            style={{ color: accentColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-3">
            {resume.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-700">{exp.company}</span>
                    {exp.location && (
                      <>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-600 text-xs">{exp.location}</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.bullets?.length > 0 && (
                  <ul className="mt-1 grid grid-cols-1 gap-0.5">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-gray-700 flex items-start">
                        <span className="mr-1.5 text-gray-400">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two Column: Education & Certifications */}
      <div className="grid grid-cols-2 gap-6">
        {/* Education */}
        {resume.education?.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase mb-2"
              style={{ color: accentColor }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {resume.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                    </h3>
                    <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {resume.certifications?.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase mb-2"
              style={{ color: accentColor }}
            >
              Certifications
            </h2>
            <ul className="space-y-0.5">
              {resume.certifications.map((cert, idx) => (
                <li key={idx} className="text-gray-700 flex items-start">
                  <span 
                    className="w-1 h-1 rounded-full mr-1.5 mt-1.5"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span>
                    {cert.name}
                    {cert.date && <span className="text-gray-500 text-xs"> ({cert.date})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <section className="mt-3">
          <h2 
            className="text-xs font-bold uppercase mb-2"
            style={{ color: accentColor }}
          >
            Key Projects
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {resume.projects.map((project, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-sm text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-700 text-xs">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
