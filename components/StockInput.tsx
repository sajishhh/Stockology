import React, { useState } from 'react';

interface StockInputProps {
  onAnalyze: (ticker: string, currency: string) => void;
  isLoading: boolean;
}

const currencies = [
  'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'INR'
];

const StockInput: React.FC<StockInputProps> = ({ onAnalyze, isLoading }) => {
  const [ticker, setTicker] = useState('');
  const [currency, setCurrency] = useState('USD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(ticker, currency);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter stock ticker (e.g. AAPL)"
          className="w-full bg-slate-800/60 border border-slate-700 text-white rounded-md pl-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
          disabled={isLoading}
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-slate-800/60 border border-slate-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
          disabled={isLoading}
        >
          {currencies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          type="submit"
          disabled={isLoading || !ticker}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
        >
          {isLoading ? '...' : 'Analyze'}
        </button>
      </div>
    </form>
  );
};

export default StockInput;