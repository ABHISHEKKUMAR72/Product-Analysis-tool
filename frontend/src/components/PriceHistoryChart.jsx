import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15,12,41,0.95)',
        border: '1px solid rgba(124,58,237,0.4)',
        borderRadius: '10px',
        padding: '0.6rem 0.9rem',
        boxShadow: '0 8px 24px #0006',
        fontFamily: "'Inter',sans-serif",
      }}>
        <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.2rem' }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399' }}>
          ₹{payload[0].value?.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

const PriceHistoryChart = ({ title, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/history?title=${encodeURIComponent(title)}`)
      .then(res => { setData(res.data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [title]);

  const s = {
    wrap: { height: '240px', width: '100%', fontFamily: "'Inter',sans-serif" },
    center: {
      height: '240px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
    },
    stateIcon: { fontSize: '1.8rem' },
    stateText: { fontSize: '0.82rem', color: '#64748b', textAlign: 'center', maxWidth: '260px', lineHeight: 1.5 },
    closeBtn: {
      padding: '0.4rem 1rem', borderRadius: '8px',
      background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)',
      color: '#f87171', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
    },
  };

  if (loading) return (
    <div style={s.center}>
      <div style={s.stateIcon}>⏳</div>
      <div style={s.stateText}>Loading price history...</div>
    </div>
  );

  if (!data.length) return (
    <div style={s.center}>
      <div style={s.stateIcon}>📭</div>
      <div style={s.stateText}>No historical price data found for this item yet.</div>
      <button onClick={onClose} style={s.closeBtn}>Close</button>
    </div>
  );

  const chartData = data.map(d => ({
    time: d.Timestamp || new Date().toLocaleString(),
    Price: d.Price,
  }));

  // Define gradient inside the component using JSX
  const PriceGradient = () => (
    <defs>
      <linearGradient id="gcPriceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
      </linearGradient>
    </defs>
  );

  return (
    <div style={s.wrap}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <PriceGradient />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#334155', fontSize: 10 }}
            axisLine={false} tickLine={false}
            height={10} opacity={0}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#475569', fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `₹${v?.toLocaleString()}`}
            width={72}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Price"
            stroke="#7c3aed"
            strokeWidth={2.5}
            fill="url(#gcPriceGrad)"
            dot={{ r: 4, fill: '#7c3aed', stroke: '#a78bfa', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#ec4899', stroke: '#f9a8d4', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceHistoryChart;