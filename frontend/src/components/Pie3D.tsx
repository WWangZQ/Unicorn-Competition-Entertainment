import { useRef, useEffect } from 'react';

interface Slice {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  slices: Slice[];
  size?: number;
}

const PALETTE = [
  '#d97706', '#ea580c', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc',
  '#e879f9', '#f472b6', '#fb7185', '#f43f5e', '#e11d48',
  '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#ef4444',
  '#f97316', '#fb923c',
];

export default function Pie3D({ slices, size = 400 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;
    const cx = size / 2;
    const cy = size * 0.45;
    const radius = size * 0.35;
    const depth = size * 0.08;

    // Assign colors
    const data = slices.map((s, i) => ({
      ...s,
      color: s.color || PALETTE[i % PALETTE.length],
    }));

    // Draw the 3D extrusion (cylinder wall)
    let startAngle = -Math.PI / 2;
    data.forEach((slice) => {
      const sliceAngle = (slice.value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      // Darker shade for the extrusion side
      const darken = darkenColor(slice.color, 0.4);
      ctx.fillStyle = darken;
      ctx.beginPath();
      ctx.moveTo(cx + radius * Math.cos(startAngle), cy + radius * Math.sin(startAngle));
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineTo(cx + radius * Math.cos(endAngle), cy + depth + radius * Math.sin(endAngle));
      ctx.arc(cx, cy + depth, radius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fill();

      startAngle = endAngle;
    });

    // Draw bottom face (darker circle)
    ctx.fillStyle = darkenColor('#ffffff', 0.3);
    ctx.beginPath();
    ctx.ellipse(cx, cy + depth, radius, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw bottom face segments
    startAngle = -Math.PI / 2;
    data.forEach((slice) => {
      const sliceAngle = (slice.value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;
      if (sliceAngle > 0.01) {
        const darken = darkenColor(slice.color, 0.5);
        ctx.fillStyle = darken;
        ctx.beginPath();
        ctx.moveTo(cx, cy + depth);
        ctx.arc(cx, cy + depth, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
      }
      startAngle = endAngle;
    });

    // Draw top face
    startAngle = -Math.PI / 2;
    data.forEach((slice) => {
      const sliceAngle = (slice.value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      if (sliceAngle > 0.01) {
        // Slice body
        ctx.fillStyle = slice.color;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // Slice border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      startAngle = endAngle;
    });

    // Top highlight overlay for 3D feel
    const grad = ctx.createRadialGradient(cx, cy - radius * 0.3, 0, cx, cy, radius);
    grad.addColorStop(0, 'rgba(255,255,255,0.12)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.03)');
    grad.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

  }, [slices, size]);

  return <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />;
}

function darkenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 1 - amount;
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}
