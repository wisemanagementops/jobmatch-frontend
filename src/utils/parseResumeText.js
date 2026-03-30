/**
 * Parse AI-generated resume text into structured data
 * Handles both structured (===SECTION:===) and unstructured formats
 */

export function parseResumeText(text) {
  if (!text) return null;

  const resume = {
    name: '',
    contact: {
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: []
  };

  // Check for structured format
  if (text.includes('===HEADER===') || text.includes('===SECTION:')) {
    return parseStructuredFormat(text, resume);
  }

  // Parse unstructured format
  return parseUnstructuredFormat(text, resume);
}

function parseStructuredFormat(text, resume) {
  const sections = text.split(/===([^=]+)===/g).filter(s => s.trim());

  for (let i = 0; i < sections.length; i += 2) {
    const sectionName = sections[i]?.trim().toUpperCase();
    const sectionContent = sections[i + 1]?.trim() || '';

    if (sectionName === 'HEADER') {
      parseHeader(sectionContent, resume);
    } else if (sectionName.includes('SUMMARY') || sectionName.includes('OBJECTIVE')) {
      resume.summary = sectionContent.trim();
    } else if (sectionName.includes('EXPERIENCE') || sectionName.includes('WORK')) {
      resume.experience = parseExperience(sectionContent);
    } else if (sectionName.includes('EDUCATION')) {
      resume.education = parseEducation(sectionContent);
    } else if (sectionName.includes('SKILL')) {
      resume.skills = parseSkills(sectionContent);
    } else if (sectionName.includes('PROJECT')) {
      resume.projects = parseProjects(sectionContent);
    } else if (sectionName.includes('CERTIFICATION')) {
      resume.certifications = parseCertifications(sectionContent);
    }
  }

  return resume;
}

function parseUnstructuredFormat(text, resume) {
  const lines = text.split('\n');
  let currentSection = 'header';
  let sectionContent = [];

  // Common section headers
  const sectionPatterns = {
    summary: /^(SUMMARY|PROFESSIONAL SUMMARY|OBJECTIVE|PROFILE)/i,
    experience: /^(EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT)/i,
    education: /^(EDUCATION|ACADEMIC|QUALIFICATIONS)/i,
    skills: /^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|EXPERTISE)/i,
    projects: /^(PROJECTS|PERSONAL PROJECTS|KEY PROJECTS|NOTABLE PROJECTS)/i,
    certifications: /^(CERTIFICATIONS|CERTIFICATES|LICENSES)/i
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a section header
    let foundSection = null;
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line)) {
        // Process previous section
        processSectionContent(currentSection, sectionContent, resume);
        currentSection = section;
        sectionContent = [];
        foundSection = section;
        break;
      }
    }

    if (!foundSection) {
      sectionContent.push(line);
    }
  }

  // Process last section
  processSectionContent(currentSection, sectionContent, resume);

  return resume;
}

function processSectionContent(section, content, resume) {
  const text = content.join('\n').trim();
  
  switch (section) {
    case 'header':
      parseHeader(text, resume);
      break;
    case 'summary':
      resume.summary = text;
      break;
    case 'experience':
      resume.experience = parseExperience(text);
      break;
    case 'education':
      resume.education = parseEducation(text);
      break;
    case 'skills':
      resume.skills = parseSkills(text);
      break;
    case 'projects':
      resume.projects = parseProjects(text);
      break;
    case 'certifications':
      resume.certifications = parseCertifications(text);
      break;
  }
}

function parseHeader(text, resume) {
  const lines = text.split('\n').filter(l => l.trim());
  
  if (lines.length === 0) return;

  // First non-empty line is usually the name
  resume.name = lines[0].trim();

  // Look for contact info in remaining lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Email pattern
    const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) resume.contact.email = emailMatch[0];

    // Phone pattern
    const phoneMatch = line.match(/[\(]?\d{3}[\)]?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) resume.contact.phone = phoneMatch[0];

    // LinkedIn
    if (line.toLowerCase().includes('linkedin')) {
      const linkedinMatch = line.match(/linkedin\.com\/in\/[\w-]+/i);
      if (linkedinMatch) resume.contact.linkedin = linkedinMatch[0];
    }

    // Location (city, state pattern)
    const locationMatch = line.match(/([A-Za-z\s]+,\s*[A-Z]{2}(\s+\d{5})?)/);
    if (locationMatch && !resume.contact.location) {
      resume.contact.location = locationMatch[1].trim();
    }

    // If line contains pipe separators, parse each part
    if (line.includes('|')) {
      const parts = line.split('|').map(p => p.trim());
      for (const part of parts) {
        if (part.includes('@')) resume.contact.email = part;
        else if (/\d{3}.*\d{3}.*\d{4}/.test(part)) resume.contact.phone = part;
        else if (/[A-Za-z]+,\s*[A-Z]{2}/.test(part)) resume.contact.location = part;
      }
    }
  }
}

function parseExperience(text) {
  const experiences = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check if this is a new job entry (usually has company name, title, or dates)
    const datePattern = /\d{4}\s*[-–]\s*(Present|\d{4})|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i;
    const hasDate = datePattern.test(trimmed);
    
    // Bullet point
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      if (current) {
        current.bullets.push(trimmed.replace(/^[•\-\*]\s*/, ''));
      }
    } else if (hasDate || (trimmed && !trimmed.startsWith(' ') && current === null) || 
               (trimmed.includes('|') && !trimmed.startsWith('•'))) {
      // New job entry
      if (current) {
        experiences.push(current);
      }
      
      current = {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        bullets: []
      };

      // Try to parse the job info
      // Common formats:
      // "Job Title | Company | Location | Date"
      // "Job Title at Company (Date)"
      // "Company - Job Title"
      
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          current.title = parts[0];
          current.company = parts[1];
          if (parts[2]) {
            if (datePattern.test(parts[2])) {
              parseDateRange(parts[2], current);
            } else {
              current.location = parts[2];
            }
          }
          if (parts[3]) parseDateRange(parts[3], current);
        }
      } else if (trimmed.toLowerCase().includes(' at ')) {
        const atParts = trimmed.split(/ at /i);
        current.title = atParts[0].trim();
        const rest = atParts[1] || '';
        const dateMatch = rest.match(datePattern);
        if (dateMatch) {
          current.company = rest.replace(dateMatch[0], '').replace(/[()]/g, '').trim();
          parseDateRange(dateMatch[0], current);
        } else {
          current.company = rest;
        }
      } else {
        // Just use the line as title/company combo
        const dateMatch = trimmed.match(datePattern);
        if (dateMatch) {
          current.title = trimmed.replace(dateMatch[0], '').replace(/[|,]/g, '').trim();
          parseDateRange(dateMatch[0], current);
        } else {
          current.title = trimmed;
        }
      }
    } else if (current && trimmed) {
      // Could be a continuation or company name
      if (!current.company && !trimmed.startsWith('•')) {
        current.company = trimmed;
      }
    }
  }

  if (current) {
    experiences.push(current);
  }

  return experiences;
}

function parseDateRange(text, obj) {
  const parts = text.split(/[-–]/);
  if (parts.length >= 1) {
    obj.startDate = parts[0].trim();
  }
  if (parts.length >= 2) {
    obj.endDate = parts[1].trim();
  }
}

function parseEducation(text) {
  const education = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip bullet points for now
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      if (current) {
        if (!current.details) current.details = [];
        current.details.push(trimmed.replace(/^[•\-]\s*/, ''));
      }
      continue;
    }

    // Check for degree keywords
    const degreePatterns = /Bachelor|Master|Ph\.?D|MBA|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Associate|Doctorate/i;
    const hasDate = /\d{4}/.test(trimmed);
    
    if (degreePatterns.test(trimmed) || hasDate || trimmed.includes('University') || trimmed.includes('College') || trimmed.includes('Institute')) {
      if (current) {
        education.push(current);
      }
      
      current = {
        school: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: '',
        details: []
      };

      // Parse education line
      // Common formats:
      // "Degree in Field - School | Date"
      // "School | Degree | Date"
      // "Degree, School, Date"
      
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|').map(p => p.trim());
        for (const part of parts) {
          if (/\d{4}/.test(part) && !current.graduationDate) {
            current.graduationDate = part;
          } else if (degreePatterns.test(part)) {
            current.degree = part;
          } else if (part.includes('University') || part.includes('College') || part.includes('Institute')) {
            current.school = part;
          } else if (!current.field) {
            current.field = part;
          }
        }
      } else {
        // Try to extract parts
        const dateMatch = trimmed.match(/\d{4}(\s*[-–]\s*\d{4})?/);
        if (dateMatch) {
          current.graduationDate = dateMatch[0];
        }
        
        const degreeMatch = trimmed.match(degreePatterns);
        if (degreeMatch) {
          // Find the degree phrase
          const degreeStart = trimmed.indexOf(degreeMatch[0]);
          const beforeDegree = trimmed.substring(0, degreeStart).trim();
          const afterDegree = trimmed.substring(degreeStart).trim();
          
          if (beforeDegree && (beforeDegree.includes('University') || beforeDegree.includes('College'))) {
            current.school = beforeDegree;
          }
          
          // Extract degree and field
          const inMatch = afterDegree.match(/in\s+([^,|]+)/i);
          if (inMatch) {
            current.field = inMatch[1].trim();
            current.degree = afterDegree.substring(0, afterDegree.indexOf(' in ')).trim();
          } else {
            current.degree = afterDegree.replace(/\d{4}.*/, '').trim();
          }
        }
        
        // Look for school
        if (!current.school) {
          const schoolMatch = trimmed.match(/([\w\s]+(?:University|College|Institute)[^,|]*)/i);
          if (schoolMatch) {
            current.school = schoolMatch[1].trim();
          }
        }
      }

      // GPA
      const gpaMatch = trimmed.match(/GPA[:\s]*(\d+\.?\d*)/i);
      if (gpaMatch) {
        current.gpa = gpaMatch[1];
      }
    }
  }

  if (current) {
    education.push(current);
  }

  return education;
}

function parseSkills(text) {
  const skills = [];
  
  // Split by common delimiters
  const lines = text.split('\n').filter(l => l.trim());
  
  for (const line of lines) {
    let trimmed = line.trim();
    
    // Remove bullet points
    trimmed = trimmed.replace(/^[•\-\*]\s*/, '');
    
    // Remove category labels like "Programming:" or "Languages:"
    trimmed = trimmed.replace(/^[A-Za-z\s]+:\s*/, '');
    
    // Split by common separators
    const parts = trimmed.split(/[,;|•]/);
    
    for (const part of parts) {
      const skill = part.trim();
      if (skill && skill.length > 1 && skill.length < 50) {
        skills.push(skill);
      }
    }
  }

  return [...new Set(skills)]; // Remove duplicates
}

function parseProjects(text) {
  const projects = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  let current = null;
  let lookingForDescription = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Bullet point - add to current project's bullets array
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      if (current) {
        if (!current.bullets) current.bullets = [];
        current.bullets.push(trimmed.replace(/^[•\-\*]\s*/, ''));
        lookingForDescription = false; // After bullets, no longer looking for description
      }
    } else if (trimmed) {
      // Heuristic: If line is ALL CAPS or ends with year/date or starts with strong keywords, it's likely a project title
      const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length > 5;
      const hasYear = /\b(19|20)\d{2}\b/.test(trimmed);
      const hasProjectKeywords = /^(Project|Application|System|Tool|Platform|Website|App|Solution):/i.test(trimmed);
      const hasDatePattern = /(Fall|Spring|Summer|Winter)\s+\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i.test(trimmed);
      
      // Check if this looks like a project title (bold text in original)
      const looksLikeTitle = isAllCaps || hasYear || hasProjectKeywords || hasDatePattern || 
                             (current === null) || // First line is always a title
                             (!lookingForDescription && current && current.bullets.length > 0); // After bullets finished
      
      if (looksLikeTitle) {
        // New project - save previous and create new
        if (current) {
          projects.push(current);
        }
        current = {
          name: trimmed.replace(/[|].*/, '').trim(),
          description: '',
          bullets: [],
          technologies: []
        };
        lookingForDescription = true; // Next non-bullet line might be description
        
        // Extract technologies if mentioned
        const techMatch = trimmed.match(/(?:Technologies?|Tech|Stack|Built with)[:\s]*([^|]+)/i);
        if (techMatch) {
          current.technologies = techMatch[1].split(/[,;]/).map(t => t.trim());
        }
      } else if (current && lookingForDescription && !current.description) {
        // This is likely a description line (normal text after title, before bullets)
        current.description = trimmed;
        lookingForDescription = false;
      } else if (current && !current.description) {
        // Could still be part of description if we haven't seen bullets yet
        current.description = current.description ? `${current.description} ${trimmed}` : trimmed;
      }
    }
  }

  if (current) {
    projects.push(current);
  }

  return projects;
}

function parseCertifications(text) {
  const certifications = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  for (const line of lines) {
    let trimmed = line.trim();
    trimmed = trimmed.replace(/^[•\-\*]\s*/, '');
    
    if (trimmed) {
      const cert = {
        name: trimmed,
        issuer: '',
        date: ''
      };
      
      // Try to extract issuer and date
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|').map(p => p.trim());
        cert.name = parts[0];
        if (parts[1]) cert.issuer = parts[1];
        if (parts[2]) cert.date = parts[2];
      } else if (trimmed.includes(' - ')) {
        const parts = trimmed.split(' - ').map(p => p.trim());
        cert.name = parts[0];
        if (parts[1]) {
          if (/\d{4}/.test(parts[1])) {
            cert.date = parts[1];
          } else {
            cert.issuer = parts[1];
          }
        }
      }
      
      certifications.push(cert);
    }
  }

  return certifications;
}

export default parseResumeText;
