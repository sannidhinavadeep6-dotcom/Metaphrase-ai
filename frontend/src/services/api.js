const API_BASE = '/api';

/**
 * Handle API responses with proper error parsing
 */
async function handleResponse(res) {
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const err = await res.json();
      errorDetail = err.detail || err.message || errorDetail;
    } catch {
      // Ignored
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

/**
 * Health check
 */
export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}

/**
 * Get Tone Profiles
 */
export async function fetchTones() {
  const res = await fetch(`${API_BASE}/tones`);
  return handleResponse(res);
}

/**
 * Get Supported Languages
 */
export async function fetchLanguages() {
  const res = await fetch(`${API_BASE}/languages`);
  return handleResponse(res);
}

/**
 * User Login
 */
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
}

/**
 * User Registration
 */
export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return handleResponse(res);
}

/**
 * Google Sign In / Fast OAuth Login
 */
export async function googleLogin(payload) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(typeof payload === 'string' ? { email: payload } : payload)
  });
  return handleResponse(res);
}

/**
 * Admin: Get dashboard global analytics
 */
export async function fetchAdminDashboard() {
  const res = await fetch(`${API_BASE}/admin/dashboard`);
  return handleResponse(res);
}

/**
 * Admin: Get all users with progress and metrics
 */
export async function fetchAllUsersAdmin() {
  const res = await fetch(`${API_BASE}/admin/users`);
  return handleResponse(res);
}

/**
 * Admin: Get comprehensive progress & feature usage for a specific user
 */
export async function fetchUserProgressAdmin(email) {
  const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(email)}/progress`);
  return handleResponse(res);
}

/**
 * Admin: Get activity log timeline for a user
 */
export async function fetchUserActivityLogsAdmin(email) {
  const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(email)}/activity`);
  return handleResponse(res);
}

/**
 * Admin: Update user status
 */
export async function updateUserStatusAdmin(email, status) {
  const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(email)}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

/**
 * Log generic user feature activity
 */
export async function logUserActivity(email, featureName, action, details = '', wordCount = 0) {
  if (!email) return;
  try {
    await fetch(`${API_BASE}/activity/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        feature_name: featureName,
        action,
        details,
        word_count: wordCount
      })
    });
  } catch {
    // Non-blocking background log
  }
}

/**
 * Fetch Custom Personas for a user
 */
export async function fetchCustomPersonas(email) {
  if (!email) return { personas: [] };
  const res = await fetch(`${API_BASE}/personas?email=${encodeURIComponent(email)}`);
  return handleResponse(res);
}

/**
 * Create Custom Persona
 */
export async function createCustomPersona(email, title, instruction, icon = 'sparkles') {
  const res = await fetch(`${API_BASE}/personas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, title, instruction, icon })
  });
  return handleResponse(res);
}

/**
 * Delete Custom Persona
 */
export async function deleteCustomPersona(personaId, email) {
  const res = await fetch(`${API_BASE}/personas/${personaId}?email=${encodeURIComponent(email)}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

/**
 * Paraphrase & Transform Text
 */
export async function transformText(text, tone, customInstruction = null, targetLanguage = 'English', email = null) {
  const res = await fetch(`${API_BASE}/paraphrase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      tone,
      custom_instruction: customInstruction,
      target_language: targetLanguage,
      email
    })
  });
  return handleResponse(res);
}

/**
 * Rewrite a specific sentence with localized alternatives
 */
export async function rewriteSentence(sentence, fullContext = '', tone = 'Fluent', email = null) {
  const res = await fetch(`${API_BASE}/sentence/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence, full_context: fullContext, tone, email })
  });
  return handleResponse(res);
}

/**
 * Get contextual synonyms for a word/phrase
 */
export async function fetchSynonyms(word, sentenceContext = '', email = null) {
  const res = await fetch(`${API_BASE}/synonyms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, sentence_context: sentenceContext, email })
  });
  return handleResponse(res);
}

/**
 * Check AI Content Detection Probability
 */
export async function detectAiContent(text, email = null) {
  const res = await fetch(`${API_BASE}/ai-detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, email })
  });
  return handleResponse(res);
}

export const checkAiDetection = detectAiContent;

/**
 * Humanize Text (drop AI markers & increase burstiness)
 */
export async function humanizeText(text, targetLanguage = 'English', email = null) {
  const res = await fetch(`${API_BASE}/humanize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, target_language: targetLanguage, email })
  });
  return handleResponse(res);
}

/**
 * OCR Multimodal Image Extraction
 */
export async function extractOcr(file, email = null) {
  const formData = new FormData();
  formData.append('file', file);
  if (email) formData.append('email', email);
  const res = await fetch(`${API_BASE}/ocr/extract`, {
    method: 'POST',
    body: formData
  });
  return handleResponse(res);
}

/**
 * Check Plagiarism / Originality Score
 */
export async function checkOriginality(originalText, transformedText, email = null) {
  const res = await fetch(`${API_BASE}/originality/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ original_text: originalText, transformed_text: transformedText, email })
  });
  return handleResponse(res);
}

/**
 * Generate Standardized Academic Citations
 */
export async function generateCitations(title, author = '', year = '', sourceUrl = '', email = null) {
  const res = await fetch(`${API_BASE}/citation/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, year, source_url: sourceUrl, email })
  });
  return handleResponse(res);
}

/**
 * Upload & Process Batch Document (PDF, Word .docx/.doc, .txt, .md, .rtf, .csv, etc.)
 */
export async function uploadBatchDocument(file, tone, customInstruction = null, targetLanguage = 'English', email = null) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tone', tone || 'Simple');
  if (customInstruction) formData.append('custom_instruction', customInstruction);
  if (targetLanguage) formData.append('target_language', targetLanguage);
  if (email) formData.append('email', email);

  const res = await fetch(`${API_BASE}/batch/upload`, {
    method: 'POST',
    body: formData
  });
  return handleResponse(res);
}

/**
 * Extract text from any document file (PDF, DOCX, DOC, TXT, MD, RTF, CSV) into editor
 */
export async function extractDocumentText(file, email = null) {
  const formData = new FormData();
  formData.append('file', file);
  if (email) formData.append('email', email);

  const res = await fetch(`${API_BASE}/doc/extract`, {
    method: 'POST',
    body: formData
  });
  return handleResponse(res);
}

/**
 * Fetch Linguistic Metrics
 */
export async function fetchMetrics(originalText, paraphrasedText, email = null) {
  const res = await fetch(`${API_BASE}/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      original_text: originalText,
      paraphrased_text: paraphrasedText,
      email
    })
  });
  return handleResponse(res);
}

/**
 * Get User Transformation History
 */
export async function fetchUserHistory(email) {
  const res = await fetch(`${API_BASE}/history?email=${encodeURIComponent(email)}`);
  return handleResponse(res);
}

/**
 * Clear All User History
 */
export async function clearAllHistory(email) {
  const res = await fetch(`${API_BASE}/history?email=${encodeURIComponent(email)}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

/**
 * Delete a Single History Record
 */
export async function deleteHistoryRecord(id, email) {
  const res = await fetch(`${API_BASE}/history/${id}?email=${encodeURIComponent(email)}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

/**
 * Download Transformed Output as Microsoft Word .docx
 */
export async function downloadDocx(originalText, paraphrasedText, tone = 'Simple', targetLanguage = 'English', email = null) {
  const res = await fetch(`${API_BASE}/export/docx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      original_text: originalText,
      paraphrased_text: paraphrasedText,
      tone,
      target_language: targetLanguage,
      email
    })
  });
  if (!res.ok) throw new Error('Failed to generate DOCX file.');

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Metaphrase_Output.docx';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Check Grammar and Spelling
 */
export async function checkGrammar(text, email = null) {
  const res = await fetch(`${API_BASE}/grammar/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, email })
  });
  return handleResponse(res);
}

/**
 * Check Plagiarism & Web Matches
 */
export async function checkPlagiarism(text, email = null) {
  const res = await fetch(`${API_BASE}/plagiarism/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, email })
  });
  return handleResponse(res);
}

/**
 * AI Chat Co-Pilot Turn
 */
export async function sendChatMessage(messages, workspaceText = '', email = null) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      workspace_text: workspaceText,
      email
    })
  });
  return handleResponse(res);
}

/**
 * Direct Neural Translation
 */
export async function translateDirect(text, targetLanguage, sourceLanguage = 'Auto-detect', email = null) {
  const res = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      target_language: targetLanguage,
      source_language: sourceLanguage,
      email
    })
  });
  return handleResponse(res);
}
