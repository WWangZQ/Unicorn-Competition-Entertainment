import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';

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

// Active shape that pops out on hover
const ActiveSector = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  const midAngle = (startAngle + endAngle) / 2;
  const RADIAN = Math.PI / 180;
  const pop = 12;
  const dx = Math.cos(-RADIAN * midAngle) * pop;
  const dy = Math.sin(-RADIAN * midAngle) * pop;

  return (
    <g>
      <Sector
        cx={cx + dx}
        cy={cy + dy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
        padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{d.label}</div>
        <div style={{ color: '#6b7280' }}>{d.value} 人</div>
      </div>
    );
  }
  return null;
};

export default function Pie3D({ slices, size = 420 }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const data = slices
    .filter((s) => s.value > 0)
    .map((s, i) => ({
      label: s.label,
      value: s.value,
      color: s.color || PALETTE[i % PALETTE.length],
    }));

  if (data.length === 0) return null;

  const innerR = size * 0.22;
  const outerR = size * 0.38;

  return (
    <div>
      <ResponsiveContainer width="100%" height={size}>
        <PieChart
          onMouseMove={(data: any) => {
            if (data && data.activeTooltipIndex !== undefined) {
              setHoverIndex(data.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <Pie
            {...{
              data,
              cx: '50%',
              cy: '50%',
              innerRadius: innerR,
              outerRadius: outerR,
              dataKey: 'value',
              activeIndex: hoverIndex ?? undefined,
              activeShape: ActiveSector,
              animationBegin: 0,
              animationDuration: 400,
            } as any}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="#fff" strokeWidth={1.5} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', justifyContent: 'center', marginTop: 8 }}>
        {data.map((d, i) => (
          <span
            key={d.label}
            style={{ fontSize: 12, color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: d.color }} />
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
