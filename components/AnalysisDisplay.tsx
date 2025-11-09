import React from 'react';
import type { AnalysisData, WatchlistItem } from '../types';
import { RecommendationRating } from '../types';

interface AnalysisDisplayProps {
    data: AnalysisData;
    onAddToWatchlist: (ticker: string, currency: string) => void;
    watchlist: WatchlistItem[];
}

const RecommendationBadge: React.FC<{ rating: RecommendationRating }> = ({ rating }) => {
    const baseClasses = 'px-4 py-1 text-sm font-bold rounded-full inline-flex items-center space-x-2 border';
    let specificClasses = '';
    let icon: React.ReactElement | null = null;
    let text = '';

    switch (rating) {
        case RecommendationRating.BUY:
            specificClasses = 'bg-green-500/20 text-green-300 border-green-500/30';
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;
            text = 'Buy';
            break;
        case RecommendationRating.SELL:
            specificClasses = 'bg-red-500/20 text-red-300 border-red-500/30';
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>;
            text = 'Sell';
            break;
        case RecommendationRating.HOLD:
            specificClasses = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h.01M12 7h.01M16 7h.01M9 17h6" /></svg>;
            text = 'Hold';
            break;
    }

    return <div className={`${baseClasses} ${specificClasses}`}>
        {icon}
        <span>{text}</span>
    </div>;
};


const AnalysisCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="card-bg backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">{title}</h3>
        {children}
    </div>
);

const MetricItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
    </div>
);


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ data, onAddToWatchlist, watchlist }) => {
    const { fundamentalAnalysis, technicalAnalysis, newsAnalysis, recommendation, ticker, currency } = data;
    const isInWatchlist = watchlist.some(item => item.ticker === ticker);

    return (
        <div className="space-y-6">
            <AnalysisCard title="Recommendation">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <RecommendationBadge rating={recommendation.rating} />
                    <p className="text-gray-300 flex-1">{recommendation.justification}</p>
                     <button
                        onClick={() => onAddToWatchlist(ticker, currency)}
                        disabled={isInWatchlist}
                        className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors duration-200 flex-shrink-0"
                    >
                       {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    </button>
                </div>
            </AnalysisCard>
            
            <AnalysisCard title="Live News Analysis">
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-cyan-300 mb-2 flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                                <path d="M15 7h2v5h-2V7z" />
                            </svg>
                            <span>Recent News</span>
                        </h4>
                        <p className="text-gray-300">{newsAnalysis.newsSummary}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-cyan-300 mb-2 flex items-center space-x-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a1 1 0 100 2h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1H3a1 1 0 01-1-1V7a1 1 0 011-1h1a1 1 0 100-2H3a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-.5a1.5 1.5 0 013 0z" />
                            </svg>
                            <span>Impact Analysis</span>
                        </h4>
                        <p className="text-gray-300">{newsAnalysis.impactAnalysis}</p>
                    </div>
                </div>
            </AnalysisCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalysisCard title="Fundamental Analysis">
                    <div className="space-y-4">
                        <p className="text-gray-300">{fundamentalAnalysis.overview}</p>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <MetricItem label="P/E Ratio" value={fundamentalAnalysis.metrics.peRatio} />
                            <MetricItem label="EPS" value={fundamentalAnalysis.metrics.eps} />
                            <MetricItem label="Revenue Growth (YoY)" value={fundamentalAnalysis.metrics.revenueGrowth} />
                            <MetricItem label="Debt-to-Equity" value={fundamentalAnalysis.metrics.debtToEquity} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                                <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                    {fundamentalAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-red-400 mb-2">Weaknesses</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-300">
                                    {fundamentalAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </AnalysisCard>

                <AnalysisCard title="Technical Analysis">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <MetricItem label="Trend" value={technicalAnalysis.trend} />
                             <MetricItem label="Support" value={technicalAnalysis.supportLevel} />
                             <MetricItem label="Resistance" value={technicalAnalysis.resistanceLevel} />
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-400 mb-2">Indicators</h4>
                            <p className="text-gray-300"><strong className="text-white">Moving Averages:</strong> {technicalAnalysis.indicators.movingAverages}</p>
                            <p className="text-gray-300"><strong className="text-white">RSI:</strong> {technicalAnalysis.indicators.rsi}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-400 mb-2">Outlook</h4>
                            <p className="text-gray-300">{technicalAnalysis.outlook}</p>
                        </div>
                    </div>
                </AnalysisCard>
            </div>
        </div>
    );
};

export default AnalysisDisplay;