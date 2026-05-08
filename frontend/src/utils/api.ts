const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Stats
export interface PersonalityStat {
  code: string;
  name: string;
  count: number;
}

export interface StatsData {
  totalParticipants: number;
  personalityDistribution: PersonalityStat[];
}

export function submitResult(data: {
  nickname: string;
  personalityCode: string;
  personalityName: string;
  dimensionScores: Record<string, number>;
  deviceId?: string;
}): Promise<{ success: boolean }> {
  return request('/stats/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getStats(): Promise<StatsData> {
  return request('/stats');
}

// Questions (admin)
export function fetchQuestions(): Promise<any[]> {
  return request('/questions');
}

export function saveQuestion(q: any): Promise<any> {
  if (q.id) {
    return request(`/questions/${q.id}`, {
      method: 'PUT',
      body: JSON.stringify(q),
    });
  }
  return request('/questions', {
    method: 'POST',
    body: JSON.stringify(q),
  });
}

export function deleteQuestion(id: string): Promise<any> {
  return request(`/questions/${id}`, { method: 'DELETE' });
}

// Personalities (admin)
export function fetchPersonalities(): Promise<any[]> {
  return request('/personalities');
}

export function savePersonality(p: any): Promise<any> {
  if (p.id) {
    return request(`/personalities/${p.id}`, {
      method: 'PUT',
      body: JSON.stringify(p),
    });
  }
  return request('/personalities', {
    method: 'POST',
    body: JSON.stringify(p),
  });
}
