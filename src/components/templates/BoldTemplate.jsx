/**
 * Bold Resume Template
 * Strong header with colored background, modern and eye-catching
 * Best for: Marketing, Sales, Creative Business roles
 */

export default function BoldTemplate({ resume, accentColor = '#7c3aed' }) {
  if (!resume) return null;

  // Lighter shade for backgrounds
  const lightBg = `${accentColor}10`;

  return (
    <div 
      className="bg-white font-sans text-gray-800"
      style={{ 
        width: '8.5in', 
        minHeight: '11in', 
        fontSize: '10pt',
        lineHeight: '1.4'
      }}
    >
      {/* Bold Header */}
      <header 
        className="px-8 py-6 text-white"
        style={{ backgroundColor: accentColor }}
      >
        <h1 className="text-3xl font-black uppercase tracking-wide mb-2">
          {resume.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-90">
          {resume.contact?.email && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {resume.contact.email}
            </span>
          )}
          {resume.contact?.phone && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {resume.contact.phone}
            </span>
          )}
          {resume.contact?.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {resume.contact.location}
            </span>
          )}
          {resume.contact?.linkedin && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
              {resume.contact.linkedin}
            </span>
          )}
        </div>
      </header>

      <div className="px-8 py-6">
        {/* Summary */}
        {resume.summary && (
          <section className="mb-5">
            <h2 
              className="text-lg font-black uppercase tracking-wide mb-2"
              style={{ color: accentColor }}
            >
              About Me
            </h2>
            <p className="text-sm text-gray-700">{resume.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <section className="mb-5">
            <h2 
              className="text-lg font-black uppercase tracking-wide mb-3"
              style={{ color: accentColor }}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-4 border-l-4" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between items-start flex-wrap">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <span 
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: lightBg, color: accentColor }}
                    >
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                  </p>
                  {exp.bullets?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-sm text-gray-700 flex items-start">
                          <span 
                            className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0"
                            style={{ backgroundColor: accentColor }}
                          />
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

        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {resume.education?.length > 0 && (
            <section>
              <h2 
                className="text-lg font-black uppercase tracking-wide mb-3"
                style={{ color: accentColor }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {resume.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-sm text-gray-900">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {resume.skills?.length > 0 && (
            <section>
              <h2 
                className="text-lg font-black uppercase tracking-wide mb-3"
                style={{ color: accentColor }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 text-xs font-medium rounded"
                    style={{ backgroundColor: lightBg, color: accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects */}
        {resume.projects?.length > 0 && (
          <section className="mt-5">
            <h2 
              className="text-lg font-black uppercase tracking-wide mb-3"
              style={{ color: accentColor }}
            >
              Projects
            </h2>
            <div className="space-y-2">
              {resume.projects.map((project, idx) => (
                <div key={idx} className="pl-4 border-l-4" style={{ borderColor: accentColor }}>
                  <h3 className="font-bold text-sm">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-700">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {resume.certifications?.length > 0 && (
          <section className="mt-5">
            <h2 
              className="text-lg font-black uppercase tracking-wide mb-3"
              style={{ color: accentColor }}
            >
              Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.certifications.map((cert, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 text-sm font-medium rounded-full border-2"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  {cert.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
