/**
 * API Client for JobMatch AI Backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth endpoints
  async register(email, password, fullName) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    this.setToken(null);
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // Analysis endpoints
  async analyze(jobDescription, resumeText, metadata = {}) {
    return this.request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ jobDescription, resumeText, ...metadata }),
    });
  }

  async tailorResume(analysisId, jobDescription, resumeText, options = {}) {
    return this.request('/analyze/tailor', {
      method: 'POST',
      body: JSON.stringify({ analysisId, jobDescription, resumeText, ...options }),
    });
  }

  async generateCoverLetter(analysisId, jobDescription, resumeText, companyName, tone) {
    return this.request('/analyze/cover-letter', {
      method: 'POST',
      body: JSON.stringify({ analysisId, jobDescription, resumeText, companyName, tone }),
    });
  }

  async getAnalysisHistory(limit = 20, offset = 0) {
    return this.request(`/analyze/history?limit=${limit}&offset=${offset}`);
  }

  async getAnalysis(id) {
    return this.request(`/analyze/${id}`);
  }

  async deleteAnalysis(id) {
    return this.request(`/analyze/${id}`, { method: 'DELETE' });
  }

  // Resume endpoints
  async getResumes() {
    return this.request('/resumes');
  }

  async createResume(resumeData) {
    return this.request('/resumes', {
      method: 'POST',
      body: JSON.stringify(resumeData),
    });
  }

  /**
   * Upload resume file (NEW!)
   * @param {FormData} formData - FormData with 'resume' file and optional 'name'
   * @param {function} onProgress - Progress callback (0-100)
   */
  async uploadResume(formData, onProgress = null) {
    const url = `${API_BASE}/resumes/upload`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response);
          } else {
            reject(new Error(response.error || 'Upload failed'));
          }
        } catch (e) {
          reject(new Error('Invalid response from server'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error. Please check your connection.'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      xhr.open('POST', url);
      
      if (this.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      }
      
      // Don't set Content-Type - browser will set it with boundary for FormData
      xhr.send(formData);
    });
  }

  async getResume(id) {
    return this.request(`/resumes/${id}`);
  }

  async updateResume(id, resumeData) {
    return this.request(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resumeData),
    });
  }

  async deleteResume(id) {
    return this.request(`/resumes/${id}`, { method: 'DELETE' });
  }

  async setPrimaryResume(id) {
    return this.request(`/resumes/${id}/primary`, { method: 'POST' });
  }

  /**
   * Download original resume file
   * @param {string} id - Resume ID
   * @returns {Promise<Blob>} - File blob
   */
  async downloadResume(id) {
    const url = `${API_BASE}/resumes/${id}/download`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Download failed');
    }
    
    return { data: await response.blob() };
  }

  /**
   * Download AI-built resume as formatted DOCX
   * @param {string} id - Resume ID
   * @returns {Promise<Blob>} - DOCX file blob
   */
  async downloadResumeDocx(id) {
    const url = `${API_BASE}/resumes/${id}/generate-docx`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to generate document');
    }
    
    return { data: await response.blob() };
  }

  // Resume Builder endpoints
  async startBuilder(existingData = {}) {
    return this.request('/resumes/builder/start', {
      method: 'POST',
      body: JSON.stringify({ existingData }),
    });
  }

  async sendBuilderMessage(sessionId, message) {
    return this.request('/resumes/builder/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, message }),
    });
  }

  async completeBuilder(sessionId) {
    return this.request('/resumes/builder/complete', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  async generateBulletPoint(description, jobTitle) {
    return this.request('/resumes/builder/bullet', {
      method: 'POST',
      body: JSON.stringify({ description, jobTitle }),
    });
  }

  // Payment endpoints
  async createCheckout(plan) {
    return this.request('/payments/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async getPortalUrl() {
    return this.request('/payments/portal');
  }

  async getSubscription() {
    return this.request('/payments/subscription');
  }

  async getPaymentHistory() {
    return this.request('/payments/history');
  }

  // Job Alert endpoints
  async getJobAlerts() {
    return this.request('/jobs/alerts');
  }

  async createJobAlert(alertData) {
    return this.request('/jobs/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  async updateJobAlert(id, alertData) {
    return this.request(`/jobs/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(alertData),
    });
  }

  async deleteJobAlert(id) {
    return this.request(`/jobs/alerts/${id}`, { method: 'DELETE' });
  }

  // Job Match endpoints
  async getJobMatches(status = 'all', limit = 20, offset = 0) {
    return this.request(`/jobs/matches?status=${status}&limit=${limit}&offset=${offset}`);
  }

  async getJobMatch(id) {
    return this.request(`/jobs/matches/${id}`);
  }

  async jobAction(id, action) {
    return this.request(`/jobs/matches/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  // ============== ONBOARDING METHODS ==============
  
  /**
   * Update user's onboarding status
   * @param {Object} data - { completed?: boolean, step?: string }
   */
  async updateOnboarding(data) {
    return this.request('/auth/onboarding', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mark extension as installed
   * Called by the Chrome extension after successful auth
   */
  async markExtensionInstalled() {
    return this.request('/auth/extension-installed', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
export default api;
