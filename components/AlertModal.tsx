import React, { useState, useEffect } from 'react';
import type { Alert } from '../types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (alert: Omit<Alert, 'id'>) => void;
  ticker: string;
  currency: string;
  currentPrice: number;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onSubmit, ticker, currency, currentPrice }) => {
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [targetPrice, setTargetPrice] = useState<string>('');

  useEffect(() => {
    if (currentPrice) {
      setTargetPrice(currentPrice.toString());
    }
  }, [currentPrice, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (!isNaN(price) && price > 0) {
      onSubmit({
        ticker,
        currency,
        condition,
        targetPrice: price,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md shadow-xl border border-slate-700" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">Set Alert for {ticker}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Condition</label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as 'ABOVE' | 'BELOW')}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ABOVE">Price is Above</option>
                <option value="BELOW">Price is Below</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Target Price ({currency})</label>
              <input
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={e => setTargetPrice(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md pl-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={`e.g., ${currentPrice.toFixed(2)}`}
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Set Alert</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertModal;