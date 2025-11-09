import { GoogleGenAI } from "@google/genai";
import type { AnalysisData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCurrentPrices = async (stocks: {ticker: string, currency: string}[]): Promise<{[key: string]: number}> => {
    if (stocks.length === 0) {
        return {};
    }

    const stockList = stocks.map(s => `${s.ticker} in ${s.currency}`).join(', ');

    const prompt = `
        Get the absolute latest real-time stock price for the following stocks: ${stockList}.
        
        Your entire response MUST be a single, valid JSON object. Do not include any text, markdown, or explanations before or after the JSON object.
        The keys of the object should be the stock tickers, and the values should be their current price as a number in their respective requested currency.
        If you cannot find a price for a ticker, omit it from the response.

        Example response for a request for "GOOGL in USD, MSFT in USD":
        {
          "GOOGL": 180.50,
          "MSFT": 450.15
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith('```')) {
             jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error fetching current prices:", error);
        return {};
    }
};


export const getStockAnalysis = async (ticker: string, currency: string): Promise<AnalysisData> => {
    const prompt = `
        Analyze the stock with the ticker "${ticker}" with all financial figures presented in the currency "${currency}". 
        Use Google Search to get the absolute latest real-time information, including the current stock price and recent news.

        Your entire response MUST be a single, valid JSON object. Do not include any text, markdown, or explanations before or after the JSON object.

        The JSON object must have the following structure:
        {
          "ticker": "string",
          "companyName": "string",
          "currentPrice": "number (The most recent real-time price in the requested currency)",
          "currency": "string (The currency code, e.g., 'USD', 'EUR')",
          "priceHistory": [
            {
              "date": "string (YYYY-MM-DD)",
              "price": "number (closing price in the requested currency)"
            }
          ],
          "fundamentalAnalysis": {
            "overview": "string",
            "metrics": {
              "peRatio": "string",
              "eps": "string",
              "revenueGrowth": "string",
              "debtToEquity": "string"
            },
            "strengths": ["string"],
            "weaknesses": ["string"]
          },
          "technicalAnalysis": {
            "trend": "string",
            "supportLevel": "string",
            "resistanceLevel": "string",
            "indicators": {
              "movingAverages": "string",
              "rsi": "string"
            },
            "outlook": "string"
          },
          "newsAnalysis": {
            "newsSummary": "string (Summary of the latest 2-3 significant news events)",
            "impactAnalysis": "string (Analysis of how the news could impact the stock price)"
          },
          "recommendation": {
            "rating": "'BUY' | 'SELL' | 'HOLD'",
            "justification": "string"
          }
        }

        Details for the response:
        - The currency for all monetary values MUST be ${currency}.
        - priceHistory should be an array of the last 90 days.
        - For fundamental metrics, if a value is not applicable, use "N/A".
        - The recommendation should be based on a synthesis of fundamental, technical, and recent news analysis.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith('```')) {
             jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }

        const parsedData = JSON.parse(jsonText);
        
        parsedData.currentPrice = parseFloat(parsedData.currentPrice);
        parsedData.priceHistory = parsedData.priceHistory.map((item: any) => ({
            ...item,
            price: parseFloat(item.price),
        }));
        
        return parsedData as AnalysisData;
    } catch (error) {
        console.error("Error fetching or parsing stock analysis:", error);
        throw new Error("Failed to get analysis from Gemini API. The model may have returned an invalid format.");
    }
};