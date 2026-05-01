const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const readJsonResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : {};
};

const requestJson = async (path, body) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const loginRequest = (payload) => requestJson('/api/auth/login', payload);

export const signupRequest = (payload) => requestJson('/api/auth/signup', payload);

export const verifySignupOtpRequest = (payload) => requestJson('/api/auth/verify-signup-otp', payload);

export const googleAuthRequest = (token) => requestJson('/api/auth/google', { token });

export const checkEmailRequest = (payload) => requestJson('/api/auth/check-email', payload);

export const forgotPasswordRequest = (payload) => requestJson('/api/auth/forgot-password', payload);

export const verifyResetOtpRequest = (payload) => requestJson('/api/auth/verify-reset-otp', payload);

export const resetPasswordRequest = (payload) => requestJson('/api/auth/reset-password', payload);

export const setPasswordRequest = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/set-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const loadGoogleIdentityScript = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google auth is only available in the browser'));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (window.__googleIdentityScriptPromise) {
    return window.__googleIdentityScriptPromise;
  }

  window.__googleIdentityScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-google-identity="true"]');

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google auth script')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google auth script'));
    document.head.appendChild(script);
  });

  return window.__googleIdentityScriptPromise;
};