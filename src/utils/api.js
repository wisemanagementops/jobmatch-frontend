/**
 * API Service - Handles all backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('jobmatch_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('jobmatch_token', token);
    } else {
      localStorage.removeItem('jobmatch_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('jobmatch_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async register(email, password, fullName) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName })
    });
    if (result.data?.token) {
      this.setToken(result.data.token);
    }
    return result;
  }

  async login(email, password) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (result.data?.token) {
      this.setToken(result.data.token);
    }
    return result;
  }

  async logout() {
    this.setToken(null);
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updatePreferences(preferences) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  // Analysis
  async analyzeMatch(jobDescription, resumeText, metadata = {}) {
    return this.request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ jobDescription, resumeText, ...metadata })
    });
  }

  async generateTailoredResume(data) {
    return this.request('/analyze/tailor', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async generateCoverLetter(data) {
    return this.request('/analyze/cover-letter', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getAnalysisHistory(limit = 20, offset = 0) {
    return this.request(`/analyze/history?limit=${limit}&offset=${offset}`);
  }

  async getAnalysis(id) {
    return this.request(`/analyze/${id}`);
  }

  // Resumes
  async getResumes() {
    return this.request('/resumes');
  }

  async createResume(data) {
    return this.request('/resumes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getResume(id) {
    return this.request(`/resumes/${id}`);
  }

  async updateResume(id, data) {
    return this.request(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteResume(id) {
    return this.request(`/resumes/${id}`, {
      method: 'DELETE'
    });
  }

  async setPrimaryResume(id) {
    return this.request(`/resumes/${id}/primary`, {
      method: 'POST'
    });
  }

  // Resume Builder
  async startBuilder(existingData = null) {
    return this.request('/resumes/builder/start', {
      method: 'POST',
      body: JSON.stringify({ existingData })
    });
  }

  async sendBuilderMessage(sessionId, message) {
    return this.request('/resumes/builder/message', {
      method: 'POST',
      body: JSON.stringify({ sessionId, message })
    });
  }

  async completeBuilder(sessionId) {
    return this.request('/resumes/builder/complete', {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    });
  }

  async generateBulletPoint(description, jobTitle) {
    return this.request('/resumes/builder/bullet', {
      method: 'POST',
      body: JSON.stringify({ description, jobTitle })
    });
  }

  // Job Alerts
  async getJobAlerts() {
    return this.request('/jobs/alerts');
  }

  async createJobAlert(data) {
    return this.request('/jobs/alerts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateJobAlert(id, data) {
    return this.request(`/jobs/alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteJobAlert(id) {
    return this.request(`/jobs/alerts/${id}`, {
      method: 'DELETE'
    });
  }

  // Job Matches
  async getJobMatches(status = 'all', limit = 20, offset = 0) {
    return this.request(`/jobs/matches?status=${status}&limit=${limit}&offset=${offset}`);
  }

  async getJobMatch(id) {
    return this.request(`/jobs/matches/${id}`);
  }

  async jobAction(id, action) {
    return this.request(`/jobs/matches/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action })
    });
  }

  // Payments
  async createCheckout(plan) {
    return this.request('/payments/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ plan })
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
}

export const api = new ApiService();
export default api;
