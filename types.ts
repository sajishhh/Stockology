export enum RecommendationRating {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
}

export interface WatchlistItem {
  ticker: string;
  currency: string;
}

export interface Alert {
  id: string;
  ticker: string;
  currency: string;
  condition: 'ABOVE' | 'BELOW';
  targetPrice: number;
}

export interface AnalysisData {
  ticker: string;
  companyName: string;
  currentPrice: number;
  currency: string;
  priceHistory: { date: string; price: number }[];
  fundamentalAnalysis: {
    overview: string;
    metrics: {
      peRatio: string;
      eps: string;
      revenueGrowth: string;
      debtToEquity: string;
    };
    strengths: string[];
    weaknesses: string[];
  };
  technicalAnalysis: {
    trend: string;
    supportLevel: string;
    resistanceLevel: string;
    indicators: {
      movingAverages: string;
      rsi: string;
    };
    outlook: string;
  };
  newsAnalysis: {
    newsSummary: string;
    impactAnalysis: string;
  };
  recommendation: {
    rating: RecommendationRating;
    justification: string;
  };
}
