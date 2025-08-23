import { GoogleGenAI } from "@google/genai";
import type { Request, Response } from "express";
import { validateJWT } from "../auth";
import { config } from "../config";
import { BadRequestError, UnauthorizedError } from "./errors";
import { globalStockState } from "../state";
import { saveFortune } from "../db/queries/fortunes";
import { getSymbols } from "../db/queries/instruments";

const ai = new GoogleGenAI({});

async function generateGeminiResponse(prompt: string) {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    if (!res.text) {
      throw new Error("No response generated from Gemini");
    }
    return res.text;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(
      "Unknown error occurred while generating response. Try again later."
    );
  }
}

export async function handlerGenerateFortune(req: Request, res: Response) {
  type Parameters = {
    symbol: string;
  };

  const params: Parameters = req.body;

  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new UnauthorizedError("You are not authorized, please login.");
  }

  const userID = validateJWT(accessToken, config.jwtSecret);

  const stockData = globalStockState[params.symbol];
  if (!stockData) {
    throw new BadRequestError("We don't have data for that symbol, sorry.");
  }

  const prompt = createPrompt(stockData);
  try {
    const fortune = await generateGeminiResponse(prompt);

    const savedFortune = await saveFortune({
      userId: userID,
      symbol: params.symbol,
      body: fortune,
    });
    
    console.log("Fortune saved:", savedFortune);
    res.status(200).send({ fortune: fortune });
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Unknown message occurred");
  }
}

export async function handlerGetSymbols(req: Request, res: Response) {
  const symbols = await getSymbols();
  if (symbols.length === 0) {
    throw new Error("No symbols found.");
  }
  res.status(200).send(symbols);
}

function createPrompt(stockData: string) {
  return `
  You are a wise fortune cookie writer. 
  Based only on the stock data below, write a single short, mystical fortune about the stock. 
  Do not include explanations, disclaimers, or extra text. 
  Output only the fortune itself, in one sentence, under 25 words.

  Stock Data:
  ${stockData}
  `;
}

