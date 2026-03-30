/**
 * Creative Resume Template
 * Unique two-column layout with sidebar, icons, and visual elements
 * Best for: Design, Creative, UX, Marketing roles
 */

export default function CreativeTemplate({ resume, accentColor = '#ec4899' }) {
  if (!resume) return null;

  const darkBg = accentColor;
  const lightBg = `${accentColor}15`;

  return (
    <div 
      className="bg-white font-sans text-gray-800"
      style={{ 
        width: '8.5in', 
        minHeight: '11in', 
        fontSize: '9.5pt',
        lineHeight: '1.4',
        display: 'grid',
        gridTemplateColumns: '2.2in 1fr'
      }}
    >
      {/* Sidebar */}
      <aside 
        className="text-white p-5"
        style={{ backgroundColor: darkBg }}
      >
        {/* Profile Circle with Initial */}
        <div className="mb-6 flex justify-center">
          <div 
            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold"
          >
            {resume.name?.charAt(0) || 'Y'}
          </div>
        </div>

        {/* Contact */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Contact</h2>
          <div className="space-y-2 text-sm">
            {resume.contact?.email && (
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 mt-0.5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="break-all">{resume.contact.email}</span>
              </div>
            )}
            {resume.contact?.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{resume.contact.phone}</span>
              </div>
            )}
            {resume.contact?.location && (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{resume.contact.location}</span>
              </div>
            )}
            {resume.contact?.linkedin && (
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">LinkedIn</span>
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        {resume.skills?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Skills</h2>
            <div className="space-y-2">
              {resume.skills.slice(0, 10).map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span>{skill}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full">
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${85 - (idx * 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume.education?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Education</h2>
            <div className="space-y-3">
              {resume.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-sm">{edu.degree}</div>
                  {edu.field && <div className="text-xs opacity-80">{edu.field}</div>}
                  <div className="text-xs opacity-80">{edu.school}</div>
                  <div className="text-xs opacity-60">{edu.graduationDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {resume.certifications?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Certifications</h2>
            <ul className="space-y-1 text-xs">
              {resume.certifications.map((cert, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-1.5 opacity-60">◆</span>
                  <span>{cert.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="p-6">
        {/* Name Header */}
        <header className="mb-5">
          <h1 
            className="text-3xl font-bold mb-1"
            style={{ color: accentColor }}
          >
            {resume.name || 'Your Name'}
          </h1>
          {resume.summary && (
            <p className="text-gray-600 text-sm leading-relaxed">{resume.summary}</p>
          )}
        </header>

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <section className="mb-5">
            <h2 
              className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Experience
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <div 
                    className="absolute -left-3 top-1.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="pl-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                        <p 
                          className="text-sm font-medium"
                          style={{ color: accentColor }}
                        >
                          {exp.company}
                        </p>
                      </div>
                      <span 
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: lightBg, color: accentColor }}
                      >
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    {exp.bullets?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="text-sm text-gray-700 flex items-start">
                            <span 
                              className="mr-2 mt-1"
                              style={{ color: accentColor }}
                            >›</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects?.length > 0 && (
          <section>
            <h2 
              className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {resume.projects.map((project, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: lightBg }}
                >
                  <h3 
                    className="font-bold text-sm"
                    style={{ color: accentColor }}
                  >
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
