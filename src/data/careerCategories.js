/**
 * Career Categories and Template Configuration
 * 
 * This file defines all supported career types with their specific:
 * - Section order and names
 * - Required/optional fields
 * - Formatting preferences
 * - Keywords and skills commonly needed
 */

export const careerCategories = {
  // ============================================
  // TECHNOLOGY & SOFTWARE
  // ============================================
  software_engineering: {
    id: 'software_engineering',
    name: 'Software Engineering',
    aliases: ['Software Developer', 'Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
    icon: '💻',
    color: '#2563eb',
    description: 'For software developers, engineers, and programmers',
    
    // Section configuration
    sections: {
      order: ['contact', 'skills', 'experience', 'projects', 'education', 'certifications'],
      contact: {
        includeGithub: true,
        includePortfolio: true,
        includeLinkedIn: true
      },
      skills: {
        name: 'TECHNICAL SKILLS',
        categories: ['Languages', 'Frameworks & Libraries', 'Databases', 'Cloud & DevOps', 'Tools'],
        showAsPills: true
      },
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        showTechStack: true, // "Tech Stack: React, Node.js, AWS"
        bulletStyle: 'achievement' // Focus on achievements with metrics
      },
      projects: {
        name: 'PROJECTS',
        show: true,
        includeTechnologies: true
      },
      education: {
        name: 'EDUCATION',
        includeCoursework: true,
        includeHonors: true
      }
    },
    
    // Common skills for this career
    suggestedSkills: [
      'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'Go', 'Rust',
      'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot',
      'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
      'Git', 'CI/CD', 'Agile', 'Scrum'
    ],
    
    tips: [
      'Include GitHub and portfolio links in contact section',
      'List tech stack used for each role',
      'Quantify impact (e.g., "reduced load time by 40%")',
      'Include relevant side projects'
    ]
  },

  data_science: {
    id: 'data_science',
    name: 'Data Science & Analytics',
    aliases: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Data Engineer', 'Business Analyst'],
    icon: '📊',
    color: '#7c3aed',
    description: 'For data scientists, analysts, and ML engineers',
    
    sections: {
      order: ['contact', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
      contact: {
        includeGithub: true,
        includeKaggle: true,
        includeLinkedIn: true
      },
      summary: {
        name: 'PROFESSIONAL SUMMARY',
        show: true
      },
      skills: {
        name: 'TECHNICAL SKILLS',
        categories: ['Languages & Tools', 'Machine Learning', 'Data Visualization', 'Databases', 'Cloud Platforms'],
        showAsPills: true
      },
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        showTechStack: true,
        bulletStyle: 'achievement'
      },
      projects: {
        name: 'DATA PROJECTS',
        show: true,
        includeDatasets: true,
        includeMetrics: true
      }
    },
    
    suggestedSkills: [
      'Python', 'R', 'SQL', 'Scala',
      'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras',
      'Pandas', 'NumPy', 'Spark', 'Hadoop',
      'Tableau', 'Power BI', 'Matplotlib', 'Seaborn',
      'AWS', 'GCP', 'Azure ML', 'Databricks'
    ],
    
    tips: [
      'Include links to Kaggle or GitHub repositories',
      'Highlight specific ML models and their performance',
      'Quantify business impact of analyses',
      'Mention datasets sizes you\'ve worked with'
    ]
  },

  // ============================================
  // ENGINEERING
  // ============================================
  electrical_engineering: {
    id: 'electrical_engineering',
    name: 'Electrical Engineering',
    aliases: ['EE', 'Electronics Engineer', 'Hardware Engineer', 'Embedded Systems'],
    icon: '⚡',
    color: '#eab308',
    description: 'For electrical and electronics engineers',
    
    sections: {
      order: ['contact', 'education', 'skills', 'experience', 'projects', 'certifications'],
      contact: {
        includeLinkedIn: true
      },
      education: {
        name: 'EDUCATION',
        includeCoursework: true,
        includeHonors: true,
        showFirst: true
      },
      skills: {
        name: 'TECHNICAL SKILLS',
        categories: ['Languages', 'Software & Tools', 'Hardware', 'Certifications'],
        showAsPills: false // List format for EE
      },
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        bulletStyle: 'technical'
      },
      projects: {
        name: 'PROJECT EXPERIENCE',
        show: true
      }
    },
    
    suggestedSkills: [
      'MATLAB', 'C', 'C++', 'Python', 'Verilog', 'VHDL', 'Assembly',
      'LabVIEW', 'PSpice', 'Logisim', 'Cadence', 'Altium Designer',
      'Oscilloscope', 'Multimeter', 'Soldering', 'PCB Design',
      'Digital Circuit Design', 'Analog Design', 'Signal Processing'
    ],
    
    tips: [
      'Include relevant honor societies (Tau Beta Pi, Eta Kappa Nu)',
      'List lab equipment experience',
      'Mention FE Exam if passed or expected',
      'Include relevant coursework'
    ]
  },

  mechanical_engineering: {
    id: 'mechanical_engineering',
    name: 'Mechanical Engineering',
    aliases: ['ME', 'Mechanical Designer', 'Manufacturing Engineer'],
    icon: '⚙️',
    color: '#64748b',
    description: 'For mechanical and manufacturing engineers',
    
    sections: {
      order: ['contact', 'education', 'skills', 'experience', 'projects', 'certifications'],
      contact: {
        includeLinkedIn: true
      },
      education: {
        name: 'EDUCATION',
        includeCoursework: true,
        includeHonors: true,
        showFirst: true
      },
      skills: {
        name: 'TECHNICAL SKILLS',
        categories: ['Software', 'Programming Languages', 'Certifications'],
        showAsPills: false
      },
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        bulletStyle: 'technical'
      },
      projects: {
        name: 'PROJECT EXPERIENCE',
        show: true
      }
    },
    
    suggestedSkills: [
      'SolidWorks', 'AutoCAD', 'CATIA', 'PTC Creo', 'ANSYS', 'Solid Edge',
      'MATLAB', 'Python', 'C++',
      'GD&T', '3D Printing', 'CNC Machining', 'Injection Molding',
      'Thermodynamics', 'Fluid Mechanics', 'Heat Transfer', 'FEA'
    ],
    
    tips: [
      'Highlight CAD software proficiency prominently',
      'Include FE Exam status',
      'Mention manufacturing processes experience',
      'List any Six Sigma or Lean certifications'
    ]
  },

  biomedical_engineering: {
    id: 'biomedical_engineering',
    name: 'Biomedical Engineering',
    aliases: ['BME', 'Biomedical Engineer', 'Medical Device Engineer'],
    icon: '🧬',
    color: '#ec4899',
    description: 'For biomedical and medical device engineers',
    
    sections: {
      order: ['contact', 'education', 'skills', 'experience', 'research', 'certifications'],
      skills: {
        name: 'TECHNICAL SKILLS',
        categories: ['Laboratory Techniques', 'Software', 'Hardware'],
        showAsPills: false
      },
      research: {
        name: 'RESEARCH EXPERIENCE',
        show: true
      }
    },
    
    suggestedSkills: [
      'MATLAB', 'Python', 'R', 'LabVIEW',
      'Cell Culture', 'PCR', 'Gel Electrophoresis', 'Flow Cytometry',
      'SolidWorks', 'AutoCAD', 'COMSOL',
      'FDA Regulations', 'ISO 13485', 'Design Controls'
    ],
    
    tips: [
      'Highlight both lab and software skills',
      'Include research experience prominently',
      'Mention regulatory knowledge (FDA, ISO)',
      'List publications if applicable'
    ]
  },

  // ============================================
  // HEALTHCARE
  // ============================================
  nursing: {
    id: 'nursing',
    name: 'Nursing',
    aliases: ['RN', 'Registered Nurse', 'Nurse Practitioner', 'NP', 'LPN', 'FNP'],
    icon: '🏥',
    color: '#06b6d4',
    description: 'For nurses and nurse practitioners',
    
    sections: {
      order: ['contact', 'education', 'licensure', 'clinical_experience', 'work_experience', 'certifications'],
      contact: {
        includeCredentials: true // "Jane Doe, RN, BSN"
      },
      licensure: {
        name: 'LICENSURE & CERTIFICATION',
        show: true,
        includeNumbers: true
      },
      clinical_experience: {
        name: 'CLINICAL EXPERIENCE',
        show: true,
        includeHours: true,
        includePreceptor: true
      },
      work_experience: {
        name: 'PROFESSIONAL NURSING EXPERIENCE',
        bulletStyle: 'clinical'
      }
    },
    
    suggestedSkills: [
      'Patient Assessment', 'Medication Administration', 'IV Therapy',
      'Electronic Health Records (EHR)', 'Epic', 'Cerner',
      'BLS', 'ACLS', 'PALS', 'NRP',
      'Critical Care', 'Emergency Care', 'Pediatrics', 'Geriatrics'
    ],
    
    tips: [
      'Include credentials after your name',
      'List all licensure with numbers',
      'Include clinical hours for each rotation',
      'Mention preceptors for clinical experience'
    ]
  },

  healthcare: {
    id: 'healthcare',
    name: 'Healthcare Administration',
    aliases: ['Healthcare Admin', 'Medical Assistant', 'Health Services', 'Clinical Admin'],
    icon: '🩺',
    color: '#14b8a6',
    description: 'For healthcare administrators and medical assistants',
    
    sections: {
      order: ['contact', 'summary', 'education', 'certifications', 'experience', 'skills'],
      certifications: {
        name: 'CERTIFICATIONS & LICENSURE',
        showEarly: true
      }
    },
    
    suggestedSkills: [
      'EHR/EMR Systems', 'Epic', 'Cerner', 'Medical Terminology',
      'HIPAA Compliance', 'Medical Billing', 'ICD-10 Coding',
      'Patient Scheduling', 'Insurance Verification'
    ]
  },

  pharmacy: {
    id: 'pharmacy',
    name: 'Pharmacy',
    aliases: ['Pharmacist', 'PharmD', 'Pharmacy Technician'],
    icon: '💊',
    color: '#8b5cf6',
    description: 'For pharmacists and pharmacy technicians',
    
    sections: {
      order: ['contact', 'education', 'licensure', 'experience', 'certifications', 'skills'],
      contact: {
        includeCredentials: true
      },
      licensure: {
        name: 'LICENSURE',
        show: true,
        includeNumbers: true
      }
    },
    
    suggestedSkills: [
      'Medication Dispensing', 'Drug Interactions', 'Patient Counseling',
      'Compounding', 'Inventory Management', 'Prescription Processing',
      'Pharmacy Software', 'HIPAA Compliance'
    ]
  },

  // ============================================
  // ACADEMIC & RESEARCH
  // ============================================
  phd_academic: {
    id: 'phd_academic',
    name: 'PhD / Academic',
    aliases: ['Doctoral', 'Research Scientist', 'Postdoc', 'Professor', 'Academic'],
    icon: '🎓',
    color: '#0ea5e9',
    description: 'For doctoral candidates, researchers, and academics',
    
    sections: {
      order: ['contact', 'summary', 'education', 'research', 'publications', 'teaching', 'skills', 'awards'],
      summary: {
        name: 'PROFESSIONAL SUMMARY',
        show: true
      },
      education: {
        name: 'EDUCATION',
        includeDissertation: true,
        includeAdvisor: true,
        showFirst: true
      },
      research: {
        name: 'RESEARCH EXPERIENCE',
        show: true
      },
      publications: {
        name: 'PUBLICATIONS',
        show: true
      },
      teaching: {
        name: 'TEACHING EXPERIENCE',
        show: true
      },
      awards: {
        name: 'AWARDS & FELLOWSHIPS',
        show: true
      }
    },
    
    suggestedSkills: [
      'Research Design', 'Data Analysis', 'Scientific Writing',
      'Grant Writing', 'Literature Review', 'Peer Review',
      'SPSS', 'R', 'Python', 'MATLAB'
    ],
    
    tips: [
      'Include a professional summary highlighting research focus',
      'List dissertation title and committee',
      'Include publications in proper citation format',
      'Mention grants and fellowships received'
    ]
  },

  // ============================================
  // BUSINESS & MANAGEMENT
  // ============================================
  executive: {
    id: 'executive',
    name: 'Executive',
    aliases: ['C-Suite', 'CEO', 'CFO', 'CTO', 'VP', 'Director'],
    icon: '👔',
    color: '#1e293b',
    description: 'For C-suite executives and senior leaders',
    
    sections: {
      order: ['contact', 'summary', 'highlights', 'experience', 'education', 'board_positions'],
      summary: {
        name: 'EXECUTIVE SUMMARY',
        show: true
      },
      highlights: {
        name: 'KEY ACHIEVEMENTS',
        show: true,
        format: 'bullets'
      },
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        bulletStyle: 'executive' // Focus on P&L, revenue, strategy
      },
      board_positions: {
        name: 'BOARD POSITIONS',
        show: true
      }
    },
    
    tips: [
      'Focus on results and business impact, not duties',
      'Include dollar amounts and percentages',
      'Highlight strategic initiatives and their outcomes',
      'Mention board positions and advisory roles'
    ]
  },

  management: {
    id: 'management',
    name: 'Management',
    aliases: ['Manager', 'Team Lead', 'Supervisor', 'Department Head'],
    icon: '📈',
    color: '#059669',
    description: 'For managers and team leaders',
    
    sections: {
      order: ['contact', 'summary', 'experience', 'skills', 'education', 'certifications'],
      summary: {
        name: 'PROFESSIONAL SUMMARY',
        show: true
      },
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        bulletStyle: 'management' // Team size, budget, initiatives
      }
    },
    
    tips: [
      'Mention team sizes managed',
      'Include budget responsibilities',
      'Highlight process improvements',
      'Show career progression'
    ]
  },

  project_management: {
    id: 'project_management',
    name: 'Project Management',
    aliases: ['PM', 'Project Manager', 'Program Manager', 'Scrum Master', 'Agile Coach'],
    icon: '📋',
    color: '#f59e0b',
    description: 'For project and program managers',
    
    sections: {
      order: ['contact', 'summary', 'certifications', 'experience', 'skills', 'education'],
      certifications: {
        name: 'CERTIFICATIONS',
        showEarly: true // PMP, CSM, etc. are important
      },
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        bulletStyle: 'project' // Budget, timeline, scope, team
      }
    },
    
    suggestedSkills: [
      'Agile', 'Scrum', 'Kanban', 'Waterfall',
      'Jira', 'Asana', 'MS Project', 'Confluence',
      'Stakeholder Management', 'Risk Management', 'Budgeting'
    ],
    
    tips: [
      'List certifications (PMP, CSM, etc.) prominently',
      'Include project budgets and team sizes',
      'Mention on-time/under-budget delivery stats',
      'Highlight cross-functional collaboration'
    ]
  },

  // ============================================
  // ENTRY LEVEL
  // ============================================
  recent_graduate: {
    id: 'recent_graduate',
    name: 'Recent Graduate',
    aliases: ['New Grad', 'Entry Level', 'College Graduate'],
    icon: '🎓',
    color: '#6366f1',
    description: 'For recent college graduates entering workforce',
    
    sections: {
      order: ['contact', 'education', 'skills', 'experience', 'projects', 'activities'],
      education: {
        name: 'EDUCATION',
        showFirst: true,
        includeCoursework: true,
        includeGPA: true,
        includeHonors: true,
        includeActivities: true
      },
      experience: {
        name: 'RELEVANT EXPERIENCE',
        includeInternships: true
      },
      projects: {
        name: 'PROJECTS',
        show: true
      },
      activities: {
        name: 'LEADERSHIP & ACTIVITIES',
        show: true
      }
    },
    
    tips: [
      'Put education first with GPA (if above 3.0)',
      'Include relevant coursework',
      'Highlight internships and projects',
      'Include leadership roles in clubs/organizations'
    ]
  },

  first_year_student: {
    id: 'first_year_student',
    name: 'First-Year Student / Intern',
    aliases: ['Freshman', 'Sophomore', 'Intern', 'Co-op'],
    icon: '📚',
    color: '#a855f7',
    description: 'For students seeking internships',
    
    sections: {
      order: ['contact', 'education', 'skills', 'projects', 'experience', 'activities'],
      education: {
        name: 'EDUCATION',
        showFirst: true,
        includeHighSchool: true, // For first-years
        includeExpectedGrad: true
      },
      projects: {
        name: 'PROJECT EXPERIENCE',
        show: true,
        emphasize: true
      },
      activities: {
        name: 'ACTIVITIES & LEADERSHIP',
        show: true
      }
    },
    
    tips: [
      'Include high school achievements if relevant',
      'Emphasize class projects',
      'Highlight any part-time work showing responsibility',
      'Include volunteer work and extracurriculars'
    ]
  },

  career_changer: {
    id: 'career_changer',
    name: 'Career Changer',
    aliases: ['Career Transition', 'Switching Careers', 'Re-entering Workforce'],
    icon: '🔄',
    color: '#10b981',
    description: 'For professionals changing industries',
    
    sections: {
      order: ['contact', 'summary', 'skills', 'experience', 'education', 'certifications'],
      summary: {
        name: 'PROFESSIONAL SUMMARY',
        show: true,
        emphasizeTransferableSkills: true
      },
      skills: {
        name: 'CORE COMPETENCIES',
        emphasizeTransferable: true
      },
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        focusOnTransferable: true
      }
    },
    
    tips: [
      'Write a strong summary bridging old and new careers',
      'Highlight transferable skills',
      'Include relevant certifications or training',
      'Focus on achievements that translate to new field'
    ]
  },

  // ============================================
  // SPECIALIZED
  // ============================================
  federal_government: {
    id: 'federal_government',
    name: 'Federal Government',
    aliases: ['Government', 'Federal', 'GS', 'Public Sector'],
    icon: '🏛️',
    color: '#1e3a8a',
    description: 'For federal government positions (USAJOBS)',
    
    sections: {
      order: ['contact', 'summary', 'education', 'certifications', 'professional_experience', 'work_experience', 'volunteer'],
      contact: {
        includeCitizenship: true,
        includeSecurityClearance: true
      },
      professional_experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        includeHoursPerWeek: true,
        includeEmploymentType: true, // Part-time, Internship, etc.
        detailedBullets: true
      },
      work_experience: {
        name: 'WORK EXPERIENCE',
        includeHoursPerWeek: true
      },
      volunteer: {
        name: 'VOLUNTEER EXPERIENCE',
        includeHoursPerWeek: true
      }
    },
    
    tips: [
      'Include US citizenship status',
      'List security clearance if applicable',
      'Include hours per week for each position',
      'Be very detailed - federal resumes are typically 2+ pages',
      'Use exact language from job announcement'
    ],
    
    allowMultiplePages: true
  },

  student_athlete: {
    id: 'student_athlete',
    name: 'Student Athlete',
    aliases: ['Athlete', 'College Athlete', 'NCAA'],
    icon: '🏆',
    color: '#dc2626',
    description: 'For student athletes entering workforce',
    
    sections: {
      order: ['contact', 'education', 'athletic_experience', 'skills', 'experience', 'activities'],
      athletic_experience: {
        name: 'ATHLETIC EXPERIENCE',
        show: true
      }
    },
    
    tips: [
      'Highlight leadership from athletics',
      'Include time management skills',
      'Mention achievements and awards',
      'Connect athletic skills to workplace'
    ]
  },

  // ============================================
  // BUSINESS FUNCTIONS
  // ============================================
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    aliases: ['Digital Marketing', 'Content Marketing', 'Brand Manager', 'Social Media'],
    icon: '📣',
    color: '#e11d48',
    description: 'For marketing professionals',
    
    sections: {
      order: ['contact', 'summary', 'experience', 'skills', 'education', 'certifications'],
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        bulletStyle: 'achievement',
        emphasizeMetrics: true // ROI, engagement, conversions
      }
    },
    
    suggestedSkills: [
      'SEO', 'SEM', 'Google Analytics', 'Google Ads',
      'Social Media Marketing', 'Content Strategy', 'Email Marketing',
      'HubSpot', 'Salesforce', 'Marketo',
      'A/B Testing', 'Conversion Optimization'
    ]
  },

  sales: {
    id: 'sales',
    name: 'Sales',
    aliases: ['Account Executive', 'Sales Manager', 'Business Development'],
    icon: '💼',
    color: '#ea580c',
    description: 'For sales professionals',
    
    sections: {
      order: ['contact', 'summary', 'experience', 'skills', 'education'],
      experience: {
        name: 'PROFESSIONAL EXPERIENCE',
        bulletStyle: 'sales', // Quota attainment, revenue, deals
        emphasizeMetrics: true
      }
    },
    
    tips: [
      'Include quota attainment percentages',
      'List revenue generated',
      'Mention major deals closed',
      'Highlight President\'s Club or awards'
    ]
  },

  finance_accounting: {
    id: 'finance_accounting',
    name: 'Finance & Accounting',
    aliases: ['Accountant', 'Financial Analyst', 'CPA', 'Controller'],
    icon: '💰',
    color: '#0d9488',
    description: 'For finance and accounting professionals',
    
    sections: {
      order: ['contact', 'summary', 'certifications', 'experience', 'skills', 'education'],
      certifications: {
        name: 'CERTIFICATIONS & LICENSES',
        showEarly: true // CPA, CFA important
      }
    },
    
    suggestedSkills: [
      'Financial Analysis', 'Financial Modeling', 'Budgeting', 'Forecasting',
      'Excel', 'QuickBooks', 'SAP', 'Oracle Financials',
      'GAAP', 'IFRS', 'Auditing', 'Tax Preparation'
    ]
  },

  human_resources: {
    id: 'human_resources',
    name: 'Human Resources',
    aliases: ['HR', 'Recruiter', 'HR Manager', 'Talent Acquisition'],
    icon: '👥',
    color: '#7c3aed',
    description: 'For HR professionals',
    
    sections: {
      order: ['contact', 'summary', 'experience', 'skills', 'certifications', 'education']
    },
    
    suggestedSkills: [
      'Recruiting', 'Onboarding', 'Employee Relations', 'Performance Management',
      'HRIS', 'Workday', 'ADP', 'BambooHR',
      'Employment Law', 'Benefits Administration', 'Compensation'
    ]
  },

  legal: {
    id: 'legal',
    name: 'Legal',
    aliases: ['Attorney', 'Lawyer', 'Paralegal', 'Legal Assistant'],
    icon: '⚖️',
    color: '#4b5563',
    description: 'For legal professionals',
    
    sections: {
      order: ['contact', 'education', 'bar_admissions', 'experience', 'skills'],
      contact: {
        includeCredentials: true // "Jane Doe, Esq."
      },
      bar_admissions: {
        name: 'BAR ADMISSIONS',
        show: true
      }
    },
    
    tips: [
      'Include credentials after name',
      'List bar admissions',
      'Mention practice areas',
      'Include notable cases or deals'
    ]
  }
};

// Helper function to get career by alias
export function getCareerByAlias(alias) {
  const lowerAlias = alias.toLowerCase();
  for (const [key, career] of Object.entries(careerCategories)) {
    if (career.name.toLowerCase() === lowerAlias) return career;
    if (career.aliases.some(a => a.toLowerCase() === lowerAlias)) return career;
  }
  return null;
}

// Get all careers as array
export function getAllCareers() {
  return Object.values(careerCategories);
}

// Group careers by category
export const careerGroups = {
  'Technology': ['software_engineering', 'data_science'],
  'Engineering': ['electrical_engineering', 'mechanical_engineering', 'biomedical_engineering'],
  'Healthcare': ['nursing', 'healthcare', 'pharmacy'],
  'Academic & Research': ['phd_academic'],
  'Business & Management': ['executive', 'management', 'project_management', 'marketing', 'sales', 'finance_accounting', 'human_resources'],
  'Legal': ['legal'],
  'Entry Level': ['recent_graduate', 'first_year_student', 'career_changer'],
  'Specialized': ['federal_government', 'student_athlete']
};

export default careerCategories;
