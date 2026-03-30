/**
 * ATS-Safe Resume Template
 * Single column, no graphics, simple formatting for maximum ATS compatibility
 * Best for: Applying through job portals, large companies with ATS systems
 */

export default function ATSTemplate({ resume }) {
  if (!resume) return null;

  return (
    <div 
      className="bg-white text-black"
      style={{ 
        width: '8.5in', 
        minHeight: '11in', 
        padding: '0.75in',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.4'
      }}
    >
      {/* Simple Header */}
      <header className="mb-4">
        <h1 className="text-xl font-bold text-center mb-1">
          {resume.name || 'Your Name'}
        </h1>
        <div className="text-center text-sm">
          {[
            resume.contact?.location,
            resume.contact?.phone,
            resume.contact?.email,
            resume.contact?.linkedin
          ].filter(Boolean).join(' | ')}
        </div>
      </header>

      {/* Horizontal Line */}
      <hr className="border-black mb-4" />

      {/* Summary */}
      {resume.summary && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-2">PROFESSIONAL SUMMARY</h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {/* Skills - Simple list format for ATS */}
      {resume.skills?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-2">SKILLS</h2>
          <p>{resume.skills.join(', ')}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-2">PROFESSIONAL EXPERIENCE</h2>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-bold">{exp.title}</div>
              <div>
                {exp.company}
                {exp.location && `, ${exp.location}`}
                {' | '}
                {exp.startDate} - {exp.endDate || 'Present'}
              </div>
              {exp.bullets?.length > 0 && (
                <ul className="mt-1 ml-4 list-disc">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-2">EDUCATION</h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-bold">
                {edu.degree}{edu.field && ` in ${edu.field}`}
              </div>
              <div>
                {edu.school}
                {edu.graduationDate && ` | ${edu.graduationDate}`}
                {edu.gpa && ` | GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-2">CERTIFICATIONS</h2>
          <ul className="ml-4 list-disc">
            {resume.certifications.map((cert, idx) => (
              <li key={idx}>
                {cert.name}
                {cert.issuer && ` - ${cert.issuer}`}
                {cert.date && ` (${cert.date})`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase mb-2">PROJECTS</h2>
          {resume.projects.map((project, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-bold">{project.name}</div>
              {project.description && <div style={{ fontWeight: 'normal' }}>{project.description}</div>}
              {project.bullets?.length > 0 && (
                <ul className="mt-1 ml-4">
                  {project.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} style={{ fontWeight: 'normal' }}>{bullet}</li>
                  ))}
                </ul>
              )}
              {project.technologies?.length > 0 && (
                <div className="text-sm" style={{ fontWeight: 'normal' }}>Technologies: {project.technologies.join(', ')}</div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
