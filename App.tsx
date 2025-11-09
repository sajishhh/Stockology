import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getStockAnalysis, getCurrentPrices } from './services/geminiService';
import type { AnalysisData, WatchlistItem, Alert } from './types';
import StockInput from './components/StockInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import StockChart from './components/StockChart';
import WatchlistSidebar from './components/WatchlistSidebar';
import { requestNotificationPermission, showNotification } from './utils/notifications';

const App: React.FC = () => {
    const [ticker, setTicker] = useState<string>('');
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const alertCheckInterval = useRef<number | null>(null);

    useEffect(() => {
        try {
            const storedWatchlist = localStorage.getItem('stockWatchlist');
            if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
            const storedAlerts = localStorage.getItem('stockAlerts');
            if (storedAlerts) setAlerts(JSON.parse(storedAlerts));
        } catch (e) {
            console.error("Failed to parse from localStorage", e);
        }
        requestNotificationPermission();
    }, []);

    useEffect(() => {
        localStorage.setItem('stockWatchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    useEffect(() => {
        localStorage.setItem('stockAlerts', JSON.stringify(alerts));
    }, [alerts]);

    const checkAlerts = useCallback(async () => {
        if (alerts.length === 0) return;

        const stocksToFetch = alerts.map(a => ({ ticker: a.ticker, currency: a.currency }));
        const currentPrices = await getCurrentPrices(stocksToFetch);

        const triggeredAlerts: string[] = [];
        alerts.forEach(alert => {
            const currentPrice = currentPrices[alert.ticker];
            if (currentPrice !== undefined) {
                const conditionMet =
                    (alert.condition === 'ABOVE' && currentPrice > alert.targetPrice) ||
                    (alert.condition === 'BELOW' && currentPrice < alert.targetPrice);

                if (conditionMet) {
                    showNotification('Stock Alert Triggered!', {
                        body: `${alert.ticker} is now ${alert.condition === 'ABOVE' ? 'above' : 'below'} your target of ${alert.targetPrice} ${alert.currency}. Current price: ${currentPrice} ${alert.currency}.`,
                    });
                    triggeredAlerts.push(alert.id);
                }
            }
        });

        if (triggeredAlerts.length > 0) {
            setAlerts(prev => prev.filter(a => !triggeredAlerts.includes(a.id)));
        }
    }, [alerts]);

    useEffect(() => {
        if (alertCheckInterval.current) clearInterval(alertCheckInterval.current);
        alertCheckInterval.current = window.setInterval(checkAlerts, 60000);
        return () => {
            if (alertCheckInterval.current) clearInterval(alertCheckInterval.current);
        };
    }, [checkAlerts]);

    const handleAnalyze = useCallback(async (symbol: string, currency: string) => {
        if (!symbol) {
            setError('Please enter a stock ticker.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setTicker(symbol.toUpperCase());

        try {
            const result = await getStockAnalysis(symbol, currency);
            const sortedPriceHistory = result.priceHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setAnalysis({ ...result, priceHistory: sortedPriceHistory });
        } catch (e) {
            console.error(e);
            setError('Failed to retrieve analysis. The ticker might be invalid or there was a network issue. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addToWatchlist = useCallback((ticker: string, currency: string) => {
        if (!watchlist.some(item => item.ticker === ticker)) {
            setWatchlist(prev => [...prev, { ticker, currency }]);
        }
    }, [watchlist]);

    const removeFromWatchlist = useCallback((ticker: string) => {
        setWatchlist(prev => prev.filter(item => item.ticker !== ticker));
        setAlerts(prev => prev.filter(alert => alert.ticker !== ticker));
    }, []);

    const addAlert = useCallback((alertData: Omit<Alert, 'id'>) => {
        const newAlert: Alert = { ...alertData, id: crypto.randomUUID() };
        setAlerts(prev => [...prev, newAlert]);
    }, []);

    const removeAlert = useCallback((id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, []);

    const WelcomeScreen = () => (
        <div className="text-center p-8">
            <div className="max-w-md mx-auto">
                <svg className="w-24 h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-white">Welcome to <span className="text-gradient">Global Stock Advisor</span></h2>
            <p className="mt-2 text-md text-gray-400">
                Enter a stock ticker to begin. You can add stocks to your watchlist and set price alerts.
            </p>
             <p className="mt-4 text-xs text-gray-500">
                Disclaimer: This is not financial advice. Analysis is generated by an AI model and may not be accurate.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen text-gray-200">
            <header className="bg-slate-900/60 backdrop-blur-sm shadow-lg sticky top-0 z-10 border-b border-slate-700/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                         <div className="flex items-center space-x-3">
                            <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h1 className="text-xl font-bold text-white">Global Stock <span className="text-gradient">Advisor</span></h1>
                        </div>
                        <div className="w-full max-w-lg">
                            <StockInput onAnalyze={handleAnalyze} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </header>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-8 items-start">
                <main className="flex-1 w-full">
                    {isLoading && <LoadingSpinner />}
                    {error && !isLoading && <ErrorMessage message={error} />}
                    {!isLoading && !analysis && !error && <WelcomeScreen />}
                    {analysis && !isLoading && (
                        <div className="space-y-8">
                            <div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-4 mb-2">
                                    <h2 className="text-3xl font-extrabold text-gradient">{analysis.companyName} ({analysis.ticker})</h2>
                                    <p className="text-5xl font-black text-white tracking-tighter">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: analysis.currency, minimumFractionDigits: 2 }).format(analysis.currentPrice)}
                                    </p>
                                </div>
                                <StockChart data={analysis.priceHistory} rating={analysis.recommendation.rating} currency={analysis.currency} />
                            </div>
                            <AnalysisDisplay data={analysis} onAddToWatchlist={addToWatchlist} watchlist={watchlist} />
                        </div>
                    )}
                </main>
                <WatchlistSidebar
                    watchlist={watchlist}
                    alerts={alerts}
                    onSelect={handleAnalyze}
                    onRemoveWatchlist={removeFromWatchlist}
                    onAddAlert={addAlert}
                    onRemoveAlert={removeAlert}
                    currentAnalysis={analysis ? { ticker: analysis.ticker, currency: analysis.currency, currentPrice: analysis.currentPrice } : null}
                />
            </div>
        </div>
    );
};

export default App;