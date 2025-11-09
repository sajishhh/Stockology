import React, { useState } from 'react';
import type { WatchlistItem, Alert } from '../types';
import AlertModal from './AlertModal';

interface WatchlistSidebarProps {
  watchlist: WatchlistItem[];
  alerts: Alert[];
  onSelect: (ticker: string, currency: string) => void;
  onRemoveWatchlist: (ticker: string) => void;
  onAddAlert: (alert: Omit<Alert, 'id'>) => void;
  onRemoveAlert: (id: string) => void;
  currentAnalysis: { ticker: string; currency: string; currentPrice: number } | null;
}

const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  watchlist,
  alerts,
  onSelect,
  onRemoveWatchlist,
  onAddAlert,
  onRemoveAlert,
  currentAnalysis,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertTarget, setAlertTarget] = useState<{ ticker: string; currency: string; currentPrice: number } | null>(null);

  const handleSetAlertClick = (item: WatchlistItem) => {
    const price = currentAnalysis?.ticker === item.ticker ? currentAnalysis.currentPrice : 0;
    if (price > 0) {
        setAlertTarget({ ticker: item.ticker, currency: item.currency, currentPrice: price });
        setIsModalOpen(true);
    } else {
        // To set an alert, first analyze the stock to get its current price context.
        onSelect(item.ticker, item.currency);
    }
  };
  
  return (
    <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 card-bg backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 p-4 space-y-6 self-start md:sticky md:top-24">
      <div>
        <h2 className="text-xl font-bold text-cyan-400 mb-3">Watchlist</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {watchlist.length === 0 && <p className="text-gray-500 text-sm">Your watchlist is empty.</p>}
          {watchlist.map(item => (
            <div key={item.ticker} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md hover:bg-slate-700/70 transition-colors">
              <button onClick={() => onSelect(item.ticker, item.currency)} className="text-left flex-grow">
                <p className="font-semibold text-white">{item.ticker}</p>
                <p className="text-xs text-gray-400">{item.currency}</p>
              </button>
              <div className="flex items-center space-x-1">
                 <button onClick={() => handleSetAlertClick(item)} title="Set Alert" className="p-1 text-gray-400 hover:text-blue-400 disabled:text-slate-600 disabled:cursor-not-allowed" disabled={currentAnalysis?.ticker !== item.ticker}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                 </button>
                 <button onClick={() => onRemoveWatchlist(item.ticker)} title="Remove" className="p-1 text-gray-400 hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-cyan-400 mb-3">Active Alerts</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {alerts.length === 0 && <p className="text-gray-500 text-sm">You have no active alerts.</p>}
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between bg-slate-800/50 p-2 rounded-md">
                <div className="text-sm">
                    <span className="font-bold text-white">{alert.ticker}</span>
                    <span className="text-gray-300"> {alert.condition === 'ABOVE' ? '>' : '<'} {new Intl.NumberFormat('en-US', { style: 'currency', currency: alert.currency }).format(alert.targetPrice)}</span>
                </div>
                 <button onClick={() => onRemoveAlert(alert.id)} title="Remove Alert" className="p-1 text-gray-400 hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                 </button>
            </div>
          ))}
        </div>
      </div>
      {alertTarget && (
        <AlertModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={onAddAlert}
            ticker={alertTarget.ticker}
            currency={alertTarget.currency}
            currentPrice={alertTarget.currentPrice}
        />
      )}
    </aside>
  );
};
export default WatchlistSidebar;