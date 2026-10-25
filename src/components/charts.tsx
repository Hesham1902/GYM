import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts'

const axis = { stroke: 'var(--color-border)', tick: { fill: 'var(--color-muted)', fontSize: 11 } }
const tip = { contentStyle: { background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 12, color: 'var(--color-text)', fontSize: 12 }, labelStyle: { color: 'var(--color-muted)' } }

export function LineSeries({ data, keys, height = 200, yDomain }: { data: Record<string, unknown>[]; keys: { k: string; color: string; dashed?: boolean; name?: string }[]; height?: number; yDomain?: [number | 'auto', number | 'auto'] }) {
  return (
    <div dir="ltr" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="x" {...axis} minTickGap={24} />
          <YAxis {...axis} domain={yDomain ?? ['auto', 'auto']} width={48} />
          <Tooltip {...tip} />
          {keys.map((s) => <Line key={s.k} type="monotone" dataKey={s.k} name={s.name ?? s.k} stroke={s.color} strokeWidth={s.dashed ? 2 : 2.5} strokeDasharray={s.dashed ? '4 4' : undefined} dot={{ r: 2.5, fill: s.color, strokeWidth: 0 }} connectNulls isAnimationActive={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function Bars({ data, k, color = 'var(--color-accent)', height = 200, name }: { data: Record<string, unknown>[]; k: string; color?: string; height?: number; name?: string }) {
  return (
    <div dir="ltr" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="x" {...axis} interval={0} />
          <YAxis {...axis} width={48} />
          <Tooltip {...tip} cursor={{ fill: 'var(--color-surface-2)' }} />
          <Bar dataKey={k} name={name ?? k} fill={color} radius={[6, 6, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
