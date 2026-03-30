/**
 * Universal ATS-Friendly Resume Template
 * Adapts section order, labels, and formatting based on career type
 * 
 * This single template handles all career types by reading configuration
 * from careerCategories and rendering appropriate sections
 */

import { careerCategories } from '../../data/careerCategories.js';

export default function UniversalATSTemplate({ 
  resume, 
  careerId = 'recent_graduate',
  accentColor = '#2563eb'
}) {
  if (!resume) return null;
  
  const career = careerCategories[careerId] || careerCategories.recent_graduate;
  const config = career.sections || {};
  const sectionOrder = config.order || ['contact', 'education', 'experience', 'skills'];

  return (
    <div 
      className="bg-white font-sans text-gray-900"
      style={{ 
        width: '8.5in', 
        minHeight: '11in', 
        padding: '0.5in 0.6in',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.4'
      }}
    >
      {/* Render sections in configured order */}
      {sectionOrder.map(sectionId => {
        switch (sectionId) {
          case 'contact':
            return <ContactSection key={sectionId} resume={resume} config={config.contact} career={career} accentColor={accentColor} />;
          case 'summary':
            return <SummarySection key={sectionId} resume={resume} config={config.summary} accentColor={accentColor} />;
          case 'highlights':
            return <HighlightsSection key={sectionId} resume={resume} config={config.highlights} accentColor={accentColor} />;
          case 'education':
            return <EducationSection key={sectionId} resume={resume} config={config.education} accentColor={accentColor} />;
          case 'skills':
            return <SkillsSection key={sectionId} resume={resume} config={config.skills} career={career} accentColor={accentColor} />;
          case 'experience':
          case 'professional_experience':
          case 'work_experience':
            return <ExperienceSection key={sectionId} resume={resume} config={config.experience || config[sectionId]} accentColor={accentColor} career={career} />;
          case 'projects':
            return <ProjectsSection key={sectionId} resume={resume} config={config.projects} accentColor={accentColor} />;
          case 'certifications':
            return <CertificationsSection key={sectionId} resume={resume} config={config.certifications} accentColor={accentColor} />;
          case 'licensure':
            return <LicensureSection key={sectionId} resume={resume} config={config.licensure} accentColor={accentColor} />;
          case 'clinical_experience':
            return <ClinicalExperienceSection key={sectionId} resume={resume} config={config.clinical_experience} accentColor={accentColor} />;
          case 'research':
            return <ResearchSection key={sectionId} resume={resume} config={config.research} accentColor={accentColor} />;
          case 'publications':
            return <PublicationsSection key={sectionId} resume={resume} config={config.publications} accentColor={accentColor} />;
          case 'teaching':
            return <TeachingSection key={sectionId} resume={resume} config={config.teaching} accentColor={accentColor} />;
          case 'activities':
            return <ActivitiesSection key={sectionId} resume={resume} config={config.activities} accentColor={accentColor} />;
          case 'awards':
            return <AwardsSection key={sectionId} resume={resume} config={config.awards} accentColor={accentColor} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// ============================================
// CONTACT SECTION
// ============================================
function ContactSection({ resume, config = {}, career, accentColor }) {
  const name = resume.name || 'Your Name';
  const contact = resume.contact || {};
  
  // Build contact line items
  const contactItems = [];
  if (contact.location) contactItems.push(contact.location);
  if (contact.phone) contactItems.push(contact.phone);
  if (contact.email) contactItems.push(contact.email);
  if (contact.linkedin) contactItems.push(contact.linkedin);
  if (config.includeGithub && contact.github) contactItems.push(contact.github);
  if (config.includePortfolio && contact.portfolio) contactItems.push(contact.portfolio);

  // Format name with credentials for healthcare/legal
  let displayName = name;
  if (config.includeCredentials && resume.credentials) {
    displayName = `${name}, ${resume.credentials}`;
  }

  return (
    <header className="mb-4 text-center">
      <h1 
        className="text-2xl font-bold mb-1"
        style={{ color: accentColor }}
      >
        {displayName}
      </h1>
      <div className="text-sm text-gray-700">
        {contactItems.join(' | ')}
      </div>
      {config.includeCitizenship && resume.citizenship && (
        <div className="text-sm text-gray-600 mt-1">
          {resume.citizenship}
        </div>
      )}
    </header>
  );
}

// ============================================
// SUMMARY SECTION
// ============================================
function SummarySection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.summary) return null;
  
  const sectionName = config.name || 'PROFESSIONAL SUMMARY';
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      <p className="text-sm text-gray-800">{resume.summary}</p>
    </section>
  );
}

// ============================================
// HIGHLIGHTS SECTION (Executive)
// ============================================
function HighlightsSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.highlights?.length) return null;
  
  return (
    <section className="mb-4">
      <SectionHeader title={config.name || 'KEY ACHIEVEMENTS'} color={accentColor} />
      <ul className="space-y-1">
        {resume.highlights.map((highlight, idx) => (
          <li key={idx} className="text-sm text-gray-800 flex items-start">
            <span className="mr-2">•</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================================
// EDUCATION SECTION
// ============================================
function EducationSection({ resume, config = {}, accentColor }) {
  if (!resume.education?.length) return null;
  
  const sectionName = config.name || 'EDUCATION';
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      <div className="space-y-3">
        {resume.education.map((edu, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold">{edu.school}</span>
                {edu.college && <span className="text-gray-600">, {edu.college}</span>}
              </div>
              <span className="text-sm text-gray-600">{edu.location}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {edu.degree}
                {edu.field && `, ${edu.field}`}
                {edu.track && ` (${edu.track})`}
              </span>
              <span className="text-sm text-gray-600">
                {edu.graduationDate || (edu.expected ? `Expected ${edu.expected}` : '')}
              </span>
            </div>
            
            {/* GPA and Dean's List */}
            {(edu.gpa || edu.honors) && (
              <div className="text-sm text-gray-700">
                {edu.gpa && `Cumulative GPA: ${edu.gpa}`}
                {edu.gpa && edu.honors && ' | '}
                {edu.honors && edu.honors}
              </div>
            )}
            
            {/* Honor Societies */}
            {edu.honorSocieties && (
              <div className="text-sm text-gray-700">
                Honors: {edu.honorSocieties}
              </div>
            )}
            
            {/* Relevant Coursework */}
            {config.includeCoursework && edu.coursework && (
              <div className="text-sm text-gray-700">
                Relevant Coursework: {edu.coursework}
              </div>
            )}
            
            {/* Dissertation (for PhD) */}
            {config.includeDissertation && edu.dissertation && (
              <div className="text-sm text-gray-700">
                Dissertation: {edu.dissertation}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// SKILLS SECTION
// ============================================
function SkillsSection({ resume, config = {}, career, accentColor }) {
  if (!resume.skills) return null;
  
  const sectionName = config.name || 'TECHNICAL SKILLS';
  const skillCategories = config.categories || ['Skills'];
  
  // Handle both array and categorized skills
  const isCategories = typeof resume.skills === 'object' && !Array.isArray(resume.skills);
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      
      {isCategories ? (
        // Categorized skills (Languages, Frameworks, etc.)
        <div className="space-y-1">
          {Object.entries(resume.skills).map(([category, skills]) => (
            <div key={category} className="text-sm">
              <span className="font-semibold">{category}:</span>{' '}
              <span className="text-gray-700">
                {Array.isArray(skills) ? skills.join(', ') : skills}
              </span>
            </div>
          ))}
        </div>
      ) : config.showAsPills ? (
        // Pills/tags style
        <div className="flex flex-wrap gap-1.5">
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
      ) : (
        // Simple list
        <p className="text-sm text-gray-700">
          {resume.skills.join(', ')}
        </p>
      )}
    </section>
  );
}

// ============================================
// EXPERIENCE SECTION
// ============================================
function ExperienceSection({ resume, config = {}, career, accentColor }) {
  if (!resume.experience?.length) return null;
  
  const sectionName = config.name || 'PROFESSIONAL EXPERIENCE';
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      <div className="space-y-4">
        {resume.experience.map((exp, idx) => (
          <div key={idx}>
            {/* Company and Title Line */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold">{exp.company}</span>
                {exp.title && <span>, <em>{exp.title}</em></span>}
                {exp.location && <span className="text-gray-600"> | {exp.location}</span>}
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {exp.startDate} – {exp.endDate || 'Present'}
              </span>
            </div>
            
            {/* Hours per week for Federal */}
            {config.includeHoursPerWeek && exp.hoursPerWeek && (
              <div className="text-sm text-gray-600">
                Hours per week: {exp.hoursPerWeek}
                {exp.employmentType && `, ${exp.employmentType}`}
              </div>
            )}
            
            {/* Tech Stack for Software */}
            {config.showTechStack && exp.techStack && (
              <div className="text-sm text-gray-600 italic">
                Tech Stack: {exp.techStack}
              </div>
            )}
            
            {/* Bullets */}
            {exp.bullets?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-sm text-gray-800 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// PROJECTS SECTION
// ============================================
function ProjectsSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.projects?.length) return null;
  
  const sectionName = config.name || 'PROJECTS';
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      <div className="space-y-3">
        {resume.projects.map((project, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold">{project.name}</span>
                {project.role && <span>, <em>{project.role}</em></span>}
                {project.location && <span className="text-gray-600"> | {project.location}</span>}
              </div>
              {project.date && (
                <span className="text-sm text-gray-600">{project.date}</span>
              )}
            </div>
            
            {/* Technologies */}
            {config.includeTechnologies && project.technologies && (
              <div className="text-sm text-gray-600 italic">
                Technologies: {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
              </div>
            )}
            
            {/* Bullets */}
            {project.bullets?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {project.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-sm text-gray-800 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {/* Description */}
            {project.description && !project.bullets && (
              <p className="text-sm text-gray-700 mt-1">{project.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// CERTIFICATIONS SECTION
// ============================================
function CertificationsSection({ resume, config = {}, accentColor }) {
  if (!resume.certifications?.length) return null;
  
  const sectionName = config.name || 'CERTIFICATIONS';
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      <div className="text-sm text-gray-800">
        {resume.certifications.map((cert, idx) => (
          <div key={idx}>
            <span className="font-semibold">{cert.name || cert}</span>
            {cert.issuer && <span> – {cert.issuer}</span>}
            {cert.date && <span className="text-gray-600"> ({cert.date})</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// LICENSURE SECTION (Healthcare)
// ============================================
function LicensureSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.licensure?.length) return null;
  
  const sectionName = config.name || 'LICENSURE & CERTIFICATION';
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      <div className="text-sm text-gray-800 space-y-0.5">
        {resume.licensure.map((license, idx) => (
          <div key={idx}>
            {license.name || license}
            {config.includeNumbers && license.number && (
              <span className="text-gray-600"> (#{license.number})</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// CLINICAL EXPERIENCE SECTION (Nursing)
// ============================================
function ClinicalExperienceSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.clinicalExperience?.length) return null;
  
  const sectionName = config.name || 'CLINICAL EXPERIENCE';
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      <div className="space-y-3">
        {resume.clinicalExperience.map((exp, idx) => (
          <div key={idx}>
            <div className="font-bold">
              {exp.specialty}
              {config.includeHours && exp.hours && (
                <span className="font-normal text-gray-600"> ({exp.hours} hours)</span>
              )}
            </div>
            <div className="text-sm">
              {exp.facility}, {exp.location}
              <span className="text-gray-600 float-right">{exp.date}</span>
            </div>
            {config.includePreceptor && exp.preceptor && (
              <div className="text-sm text-gray-600">
                Clinical Preceptor: {exp.preceptor}
              </div>
            )}
            {exp.bullets?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-sm text-gray-800 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// RESEARCH SECTION (Academic/PhD)
// ============================================
function ResearchSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.research?.length) return null;
  
  const sectionName = config.name || 'RESEARCH EXPERIENCE';
  
  return (
    <section className="mb-4">
      <SectionHeader title={sectionName} color={accentColor} />
      <div className="space-y-3">
        {resume.research.map((exp, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold">{exp.title || exp.role}</span>
                {exp.institution && <span className="text-gray-600"> | {exp.institution}</span>}
              </div>
              <span className="text-sm text-gray-600">{exp.date}</span>
            </div>
            {exp.advisor && (
              <div className="text-sm text-gray-600">Advisor: {exp.advisor}</div>
            )}
            {exp.bullets?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-sm text-gray-800 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// PUBLICATIONS SECTION (Academic/PhD)
// ============================================
function PublicationsSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.publications?.length) return null;
  
  return (
    <section className="mb-4">
      <SectionHeader title={config.name || 'PUBLICATIONS'} color={accentColor} />
      <div className="text-sm text-gray-800 space-y-1">
        {resume.publications.map((pub, idx) => (
          <div key={idx}>{pub}</div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// TEACHING SECTION (Academic)
// ============================================
function TeachingSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.teaching?.length) return null;
  
  return (
    <section className="mb-4">
      <SectionHeader title={config.name || 'TEACHING EXPERIENCE'} color={accentColor} />
      <div className="space-y-3">
        {resume.teaching.map((exp, idx) => (
          <div key={idx}>
            <div className="flex justify-between">
              <span className="font-bold">{exp.title}</span>
              <span className="text-sm text-gray-600">{exp.date}</span>
            </div>
            <div className="text-sm text-gray-600">{exp.institution}</div>
            {exp.bullets?.length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-sm text-gray-800 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// ACTIVITIES SECTION (Students)
// ============================================
function ActivitiesSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.activities?.length) return null;
  
  return (
    <section className="mb-4">
      <SectionHeader title={config.name || 'LEADERSHIP & ACTIVITIES'} color={accentColor} />
      <div className="space-y-2">
        {resume.activities.map((activity, idx) => (
          <div key={idx}>
            <div className="flex justify-between">
              <div>
                <span className="font-semibold">{activity.organization}</span>
                {activity.role && <span>, {activity.role}</span>}
              </div>
              <span className="text-sm text-gray-600">{activity.date}</span>
            </div>
            {activity.description && (
              <p className="text-sm text-gray-700">{activity.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// AWARDS SECTION
// ============================================
function AwardsSection({ resume, config = {}, accentColor }) {
  if (!config.show || !resume.awards?.length) return null;
  
  return (
    <section className="mb-4">
      <SectionHeader title={config.name || 'AWARDS & HONORS'} color={accentColor} />
      <div className="text-sm text-gray-800 space-y-0.5">
        {resume.awards.map((award, idx) => (
          <div key={idx}>
            <span className="font-semibold">{award.name || award}</span>
            {award.organization && <span>, {award.organization}</span>}
            {award.date && <span className="text-gray-600"> ({award.date})</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// SECTION HEADER COMPONENT
// ============================================
function SectionHeader({ title, color }) {
  return (
    <h2 
      className="text-sm font-bold uppercase tracking-wide mb-2 pb-1 border-b-2"
      style={{ color, borderColor: color }}
    >
      {title}
    </h2>
  );
}
