import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { RecommendationRating } from '../types';

interface StockChartProps {
  data: { date: string; price: number }[];
  rating: RecommendationRating;
  currency: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 p-2 border border-slate-700 rounded-md shadow-lg">
        <p className="label text-gray-300">{`${label}`}</p>
        <p className="intro text-white">{`Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 2 }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data, rating, currency }) => {
    
    let strokeColor = '#facc15'; // HOLD - Yellow
    if (rating === RecommendationRating.BUY) strokeColor = '#4ade80'; // BUY - Green
    if (rating === RecommendationRating.SELL) strokeColor = '#f87171'; // SELL - Red
    
    // Dynamically calculate Y-axis domain to prevent chart from being crushed or cut off
    const prices = data.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding = (maxPrice - minPrice) * 0.1 || maxPrice * 0.1; // Add padding, handle case where min and max are same

    const yDomain: [number, number] = [
        Math.max(0, minPrice - padding), // Ensure domain doesn't go below 0
        maxPrice + padding
    ];

    return (
        <div className="h-96 w-full card-bg backdrop-blur-sm rounded-xl shadow-lg p-4 border border-slate-700">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis 
                        stroke="#94a3b8" 
                        tick={{ fontSize: 12 }} 
                        domain={yDomain}
                        tickFormatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, notation: 'compact' }).format(value as number)} 
                    />
                    <Tooltip content={<CustomTooltip currency={currency} />} />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} dot={false} name={`Price (${currency})`} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockChart;