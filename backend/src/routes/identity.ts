import { Router } from 'express';
import {
  generateLinkCode,
  createIdentity,
  linkDevice,
  getIdentityDevices,
  getIdentityByDevice,
} from '../db.js';

const router = Router();

// Create new identity with link code + password
router.post('/init', (req, res) => {
  const { password, deviceId } = req.body;

  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: '密码至少6位' });
    return;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    res.status(400).json({ error: '密码需包含字母和数字' });
    return;
  }
  if (!deviceId) {
    res.status(400).json({ error: '缺少设备标识' });
    return;
  }

  const linkCode = generateLinkCode();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  const identity = createIdentity(linkCode, password, deviceId, ip, ua);

  res.json({
    identityId: identity.id,
    linkCode: identity.link_code,
  });
});

// Link existing device to an identity
router.post('/link', (req, res) => {
  const { linkCode, password, deviceId } = req.body;

  if (!linkCode || !password || !deviceId) {
    res.status(400).json({ error: '缺少参数' });
    return;
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const ua = req.headers['user-agent'] || 'unknown';
  const identity = linkDevice(linkCode, password, deviceId, ip, ua);

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

// Check if device has linked identity
router.get('/check/:deviceId', (req, res) => {
  const identity = getIdentityByDevice(req.params.deviceId);
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
