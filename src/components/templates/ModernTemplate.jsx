/**
 * Modern Resume Template
 * Clean, minimal design with subtle blue accents
 * Best for: Tech, Business, Startups
 */

export default function ModernTemplate({ resume, accentColor = '#2563eb' }) {
  if (!resume) return null;

  return (
    <div 
      className="bg-white font-sans text-gray-800"
      style={{ 
        width: '8.5in',
        height: '11in',
        padding: '0.5in 0.6in',
        fontSize: '10pt',
        lineHeight: '1.3',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <header className="mb-5">
        <h1 
          className="text-3xl font-bold tracking-tight mb-1"
          style={{ color: accentColor }}
        >
          {resume.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
          {resume.contact?.email && (
            <span>{resume.contact.email}</span>
          )}
          {resume.contact?.phone && (
            <span>{resume.contact.phone}</span>
          )}
          {resume.contact?.location && (
            <span>{resume.contact.location}</span>
          )}
          {resume.contact?.linkedin && (
            <span>{resume.contact.linkedin}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {resume.summary && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700">{resume.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-sm text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                  </span>
                </div>
                {exp.bullets?.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-sm text-gray-700 flex">
                        <span className="mr-2" style={{ color: accentColor }}>•</span>
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

      {/* Education */}
      {resume.education?.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Education
          </h2>
          <div className="space-y-2">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 text-sm rounded"
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <section className="mb-5">
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Projects
          </h2>
          <div className="space-y-3">
            {resume.projects.map((project, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-700" style={{ fontWeight: 'normal' }}>{project.description}</p>
                )}
                {project.bullets?.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {project.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-sm text-gray-700 flex" style={{ fontWeight: 'normal' }}>
                        <span className="mr-2" style={{ color: accentColor }}>•</span>
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

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <section>
          <h2 
            className="text-xs font-bold uppercase tracking-widest mb-2 pb-1 border-b-2"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Certifications
          </h2>
          <ul className="space-y-1">
            {resume.certifications.map((cert, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="font-medium">{cert.name}</span>
                {cert.issuer && <span className="text-gray-500"> – {cert.issuer}</span>}
                {cert.date && <span className="text-gray-500"> ({cert.date})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
