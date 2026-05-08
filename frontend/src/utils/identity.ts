const DEVICE_KEY = 'kgti_device_id';
const IDENTITY_KEY = 'kgti_identity_id';
const LINKCODE_KEY = 'kgti_link_code';

function randHex(len: number): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = randHex(16);
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function getIdentityId(): string | null {
  return localStorage.getItem(IDENTITY_KEY);
}

export function getLinkCode(): string | null {
  return localStorage.getItem(LINKCODE_KEY);
}

export function saveIdentity(identityId: string, linkCode: string): void {
  localStorage.setItem(IDENTITY_KEY, identityId);
  localStorage.setItem(LINKCODE_KEY, linkCode);
}

export function isLinked(): boolean {
  return !!getIdentityId();
}

export function clearIdentity(): void {
  localStorage.removeItem(IDENTITY_KEY);
  localStorage.removeItem(LINKCODE_KEY);
}

export async function initIdentity(password: string): Promise<{ identityId: string; linkCode: string }> {
  const res = await fetch('/api/identity/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, deviceId: getDeviceId() }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '创建失败');
  }
  const data = await res.json();
  saveIdentity(data.identityId, data.linkCode);
  return data;
}

export async function linkIdentity(linkCode: string, password: string): Promise<{ identityId: string; linkCode: string }> {
  const res = await fetch('/api/identity/link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ linkCode, password, deviceId: getDeviceId() }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '连接失败');
  }
  const data = await res.json();
  saveIdentity(data.identityId, data.linkCode);
  return data;
}

export async function fetchIdentityInfo(identityId: string): Promise<any> {
  const res = await fetch(`/api/identity/${identityId}`);
  if (!res.ok) throw new Error('获取失败');
  return res.json();
}

export async function checkDeviceLinked(): Promise<{ linked: boolean; identityId: string | null; linkCode: string | null }> {
  const res = await fetch(`/api/identity/check/${getDeviceId()}`);
  return res.json();
}

export interface IdentityResult {
  id: number;
  device_id: string;
  nickname: string;
  personality_code: string;
  personality_name: string;
  dimension_scores: string;
  created_at: string;
  special_code?: string | null;
  special_name?: string | null;
  special_tagline?: string | null;
  similarity?: number;
}

export async function fetchIdentityResults(identityId: string): Promise<IdentityResult[]> {
  const res = await fetch(`/api/identity/${identityId}/results`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? [];
}

export function validatePassword(pw: string): string | null {
  if (pw.length < 6) return '密码至少6位';
  if (!/[a-zA-Z]/.test(pw)) return '密码需包含字母';
  if (!/[0-9]/.test(pw)) return '密码需包含数字';
  return null;
}
