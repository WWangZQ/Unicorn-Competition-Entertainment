import { Router } from 'express';
import {
  generateLinkCode,
  createIdentity,
  linkDevice,
  getIdentityDevices,
  getIdentityByDevice,
  readResultsByIdentity,
} from '../db.js';

const router = Router();

// Input validation helpers
function isValidPassword(pw: string): boolean {
  return typeof pw === 'string' && pw.length >= 6 && pw.length <= 32;
}

function isValidLinkCode(code: string): boolean {
  return typeof code === 'string' && /^[A-Za-z0-9]{8}$/.test(code);
}

function isValidDeviceId(id: string): boolean {
  return typeof id === 'string' && id.length >= 16 && id.length <= 64 && /^[a-f0-9]+$/.test(id);
}

function isValidIdentityId(id: string): boolean {
  return typeof id === 'string' && id.length === 36;
}

// Create new identity with link code + password
router.post('/init', (req, res) => {
  const { password, deviceId } = req.body;

  if (!isValidPassword(password)) {
    res.status(400).json({ error: '密码需6-32位' });
    return;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    res.status(400).json({ error: '密码需包含字母和数字' });
    return;
  }
  if (!isValidDeviceId(deviceId)) {
    res.status(400).json({ error: '无效的设备标识' });
    return;
  }

  const linkCode = generateLinkCode();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  const identity = createIdentity(linkCode, password, deviceId, ip, ua.slice(0, 200));

  res.json({
    identityId: identity.id,
    linkCode: identity.link_code,
  });
});

// Link existing device to an identity
router.post('/link', (req, res) => {
  const { linkCode, password, deviceId } = req.body;

  if (!isValidLinkCode(linkCode)) {
    res.status(400).json({ error: '连接码格式不正确' });
    return;
  }
  if (!isValidPassword(password)) {
    res.status(400).json({ error: '密码需6-32位' });
    return;
  }
  if (!isValidDeviceId(deviceId)) {
    res.status(400).json({ error: '无效的设备标识' });
    return;
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  const identity = linkDevice(linkCode, password, deviceId, ip, ua.slice(0, 200));

  if (!identity) {
    res.status(401).json({ error: '连接码或密码错误' });
    return;
  }

  res.json({
    identityId: identity.id,
    linkCode: identity.link_code,
  });
});

// Get identity info (devices, link history)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidIdentityId(id)) {
    res.status(400).json({ error: '无效的身份ID' });
    return;
  }

  const info = getIdentityDevices(id);

  if (!info.identity) {
    res.status(404).json({ error: '身份不存在' });
    return;
  }

  res.json({
    identityId: info.identity.id,
    linkCode: info.identity.link_code,
    createdAt: info.identity.created_at,
    deviceCount: info.devices.length,
    resultCount: info.resultCount,
    devices: info.devices.map((d) => ({
      deviceId: d.device_id.slice(0, 8) + '...',
      ip: maskIp(d.ip),
      userAgent: d.user_agent.slice(0, 40),
      linkedAt: d.linked_at,
      lastActiveAt: d.last_active_at,
    })),
  });
});

// Get all results for an identity (cross-device)
router.get('/:id/results', (req, res) => {
  const { id } = req.params;

  if (!isValidIdentityId(id)) {
    res.status(400).json({ error: '无效的身份ID' });
    return;
  }

  const info = getIdentityDevices(id);

  if (!info.identity) {
    res.status(404).json({ error: '身份不存在' });
    return;
  }

  const deviceIds = new Set(info.devices.map((d) => d.device_id));
  const results = readResultsByIdentity([...deviceIds]);

  res.json({ results });
});

// Check if device has linked identity
router.get('/check/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;

  if (!isValidDeviceId(deviceId)) {
    res.status(400).json({ error: '无效的设备标识' });
    return;
  }

  const identity = getIdentityByDevice(deviceId);
  res.json({
    linked: !!identity,
    identityId: identity?.id ?? null,
    linkCode: identity?.link_code ?? null,
  });
});

function maskIp(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return parts[0] + '.' + parts[1] + '.*.*';
  }
  return ip;
}

export default router;
