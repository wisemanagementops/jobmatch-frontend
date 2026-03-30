/**
 * Classic Resume Template
 * Traditional, formal design with serif fonts
 * Best for: Finance, Legal, Academia, Traditional industries
 */

export default function ClassicTemplate({ resume }) {
  if (!resume) return null;

  return (
    <div 
      className="bg-white text-gray-900"
      style={{ 
        width: '8.5in',
        height: '11in',
        padding: '0.5in 0.6in',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10pt',
        lineHeight: '1.3',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <header className="text-center mb-6 pb-4 border-b-2 border-gray-900">
        <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
          {resume.name || 'Your Name'}
        </h1>
        <div className="text-sm space-x-3">
          {resume.contact?.location && (
            <span>{resume.contact.location}</span>
          )}
          {resume.contact?.phone && (
            <>
              <span className="text-gray-400">|</span>
              <span>{resume.contact.phone}</span>
            </>
          )}
          {resume.contact?.email && (
            <>
              <span className="text-gray-400">|</span>
              <span>{resume.contact.email}</span>
            </>
          )}
        </div>
        {resume.contact?.linkedin && (
          <div className="text-sm mt-1 text-gray-600">
            {resume.contact.linkedin}
          </div>
        )}
      </header>

      {/* Summary */}
      {resume.summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-800 text-justify">{resume.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.title}</h3>
                  <span className="text-sm italic">
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                  </span>
                </div>
                <p className="text-sm italic text-gray-700 mb-1">
                  {exp.company}{exp.location ? `, ${exp.location}` : ''}
                </p>
                {exp.bullets?.length > 0 && (
                  <ul className="mt-1 space-y-0.5 ml-4">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-sm text-gray-800 list-disc">
                        {bullet}
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
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <span className="text-sm italic">{edu.graduationDate}</span>
                </div>
                <p className="text-sm italic text-gray-700">{edu.school}</p>
                {edu.gpa && (
                  <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400 pb-1">
            Skills & Competencies
          </h2>
          <p className="text-sm text-gray-800">
            {resume.skills.join(' • ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400 pb-1">
            Notable Projects
          </h2>
          <div className="space-y-3">
            {resume.projects.map((project, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-sm">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-700 ml-4" style={{ fontWeight: 'normal' }}>{project.description}</p>
                )}
                {project.bullets?.length > 0 && (
                  <ul className="ml-8 mt-1 space-y-0.5">
                    {project.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-sm text-gray-700 list-disc" style={{ fontWeight: 'normal' }}>{bullet}</li>
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
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-400 pb-1">
            Certifications & Licenses
          </h2>
          <ul className="space-y-1 ml-4">
            {resume.certifications.map((cert, idx) => (
              <li key={idx} className="text-sm text-gray-800 list-disc">
                {cert.name}
                {cert.issuer && <span className="italic"> – {cert.issuer}</span>}
                {cert.date && <span className="text-gray-600"> ({cert.date})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
