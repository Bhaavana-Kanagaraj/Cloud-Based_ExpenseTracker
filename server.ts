import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON middleware with safe limits for potential image parsing
app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI client lazily or safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY environment variable is not configured. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// In-Memory / File-based Database paths
const DATA_DIR = path.join(process.cwd(), "data");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");

// Ensure data directory exists and seed default expenses if empty
const initializeDb = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(EXPENSES_FILE)) {
      // Seed with some realistic startup expenses for the portfolio
      const defaultExpenses = [
        {
          id: "seed-1",
          merchant: "AWS Cloud India",
          amount: 6500.00,
          category: "Utilities & Bills",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
          description: "Database hosting and serverless compute credits",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "seed-2",
          merchant: "Swiggy Delivery",
          amount: 1240.00,
          category: "Food & Dining",
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
          description: "Team lunch and Indian refreshments",
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "seed-3",
          merchant: "Ola Cabs",
          amount: 450.00,
          category: "Transportation & Fuel",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
          description: "Cab ride to workspace and client meetings",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "seed-4",
          merchant: "Zomato Dineout",
          amount: 850.00,
          category: "Food & Dining",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
          description: "Developer office team coffee & snacks",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "seed-5",
          merchant: "Flipkart Shopping",
          amount: 4500.00,
          category: "Shopping & Clothes",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
          description: "Logitech keyboard and developer desk supplies",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      fs.writeFileSync(EXPENSES_FILE, JSON.stringify(defaultExpenses, null, 2));
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};

initializeDb();

// Read expenses from JSON file
const readExpenses = (): any[] => {
  try {
    if (fs.existsSync(EXPENSES_FILE)) {
      const data = fs.readFileSync(EXPENSES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading expenses file:", err);
  }
  return [];
};

// Write expenses to JSON file
const writeExpenses = (expenses: any[]) => {
  try {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing expenses file:", err);
    return false;
  }
};

// --- API ROUTES ---

// 1. Get all expenses
app.get("/api/expenses", (req, res) => {
  const expenses = readExpenses();
  res.json({ success: true, data: expenses });
});

// 2. Add new expense
app.post("/api/expenses", (req, res) => {
  const { merchant, amount, category, date, description, isRecurring, recurringFrequency } = req.body;

  if (!merchant || amount === undefined || !category || !date) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  const expenses = readExpenses();
  const newExpense = {
    id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    merchant: String(merchant).trim(),
    amount: Number(amount),
    category: String(category).trim(),
    date: String(date),
    description: description ? String(description).trim() : "",
    isRecurring: Boolean(isRecurring),
    recurringFrequency: isRecurring ? (String(recurringFrequency).trim() as any) : undefined,
    createdAt: new Date().toISOString()
  };

  expenses.unshift(newExpense); // Put latest first
  writeExpenses(expenses);

  res.json({ success: true, data: newExpense });
});

// 3. Delete expense
app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  let expenses = readExpenses();
  const initialLength = expenses.length;
  expenses = expenses.filter(e => e.id !== id);

  if (expenses.length === initialLength) {
    return res.status(404).json({ success: false, message: "Expense not found." });
  }

  writeExpenses(expenses);
  res.json({ success: true, message: "Expense deleted successfully." });
});

// 4. AI-Powered Expense Analyzer & Budget Strategist
app.post("/api/gemini/analyze", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      success: false,
      message: "AI services are temporarily unavailable. Please make sure GEMINI_API_KEY is configured in Settings > Secrets."
    });
  }

  const expenses = readExpenses();
  const { budgetLimit } = req.body;

  if (expenses.length === 0) {
    return res.json({
      success: true,
      report: "### Welcome to your AI Financial Strategist!\n\nNo expense data is currently available in the cloud database. Please enter a few expenses above to generate a highly detailed cloud-native budget analysis."
    });
  }

  // Format expenses nicely for the AI context
  const expenseSummary = expenses.map(e => (
    `- [${e.date}] ${e.merchant}: ₹${e.amount.toFixed(2)} (${e.category}) ${e.description ? `- "${e.description}"` : ''}`
  )).join("\n");

  const systemInstruction = `You are an elite Indian financial strategist, chartered accountant, and Cloud Billing Advisor. Your goal is to analyze the user's list of Indian cloud and personal expenses, detect anomalies, evaluate monthly budget limits in Indian Rupees (INR, ₹), and produce a stellar, professional, executive-ready Markdown report. Keep your tone helpful, professional, encouraging, and deeply practical. Provide actionable cost-cutting techniques. Do not use any placeholders or general templates; analyze the exact figures provided. Use the Indian Rupee (₹) symbol for all monetary figures. Include a structured table summarizing expenses by category, calculating the percentage of budget consumed.`;

  const prompt = `
I have set my total monthly budget limit to ₹${budgetLimit || 50000}.
Here is my current list of tracked expenses:
${expenseSummary}

Please write a highly polished financial audit report in Markdown format in Indian Rupees (INR).
Structure the report with the following clear visual sections:
1. **Executive Portfolio Summary**: Deep-dive analysis of overall health, total spent vs. remaining budget (using ₹ symbol), and risk factor (Safe, Caution, or Critical).
2. **Spending Breakdown & Analytics**: A beautifully formatted Markdown table detailing: Category, Total Spent (₹), and Percentage of Overall Budget.
3. **Anomalies & Cost Efficiency Leaks**: Identify individual high-cost transactions, potential duplicate spend, or areas of wasteful expenditures.
4. **Cloud-Native Cost Optimization Recommendations**: 3 to 4 actionable, professional tips to save money (if AWS Cloud India or local Indian cloud entities are listed, give specific cloud-based recommendations; otherwise, give top-tier savings suggestions).
5. **Projected Forecast**: A paragraph predicting end-of-month status based on current spending rate.

Use markdown accents (bold, highlight tables, lists, blockquotes) to make the UX inside the application look incredibly modern and clean. Use Indian style formatting for figures.
`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ success: true, report: result.text });
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({ success: false, message: "AI Analysis failed to generate: " + error.message });
  }
});

// 5. AI-Powered Receipt / Natural Language parser
app.post("/api/gemini/parse-receipt", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      success: false,
      message: "AI services are temporarily unavailable. Please make sure GEMINI_API_KEY is configured in Settings > Secrets."
    });
  }

  const { textPrompt, base64Image, mimeType } = req.body;

  if (!textPrompt && !base64Image) {
    return res.status(400).json({ success: false, message: "Must provide either text query or base64 receipt image." });
  }

  let contents: any[] = [];
  let promptText = "Extract and parse receipt information into a structured schema.";

  if (base64Image && mimeType) {
    contents.push({
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    });
    promptText = "Carefully analyze this receipt image. Extract the Merchant Name, the Total Paid Amount, the most fitting Expense Category, the Date of transaction (format: YYYY-MM-DD), and a brief description summarizing what was purchased. Use today's year (2026) if the year is ambiguous.";
  } else if (textPrompt) {
    promptText = `Parse this natural language description of an expense and extract the details. Today's date is ${new Date().toISOString().split('T')[0]}. Text: "${textPrompt}"`;
  }

  contents.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: {
              type: Type.STRING,
              description: "The name of the vendor, business, or merchant. Capitalize properly. Examples: 'Swiggy', 'Reliance Jio', 'Zomato', 'Ola Cabs', 'Flipkart'."
            },
            amount: {
              type: Type.NUMBER,
              description: "The total payment amount as a floating point number. Do not include currency symbols."
            },
            category: {
              type: Type.STRING,
              description: "The most appropriate category. MUST be one of: 'Food & Dining', 'Shopping & Clothes', 'Transportation & Fuel', 'Housing & Rent', 'Entertainment & Leisure', 'Utilities & Bills', 'Other Expenses'."
            },
            date: {
              type: Type.STRING,
              description: "The date of purchase in YYYY-MM-DD format. If date is not specified or clear, default to today's date."
            },
            description: {
              type: Type.STRING,
              description: "A friendly, concise summary of the items purchased. Max 10 words."
            }
          },
          required: ["merchant", "amount", "category", "date"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Gemini receipt parsing error:", error);
    res.status(500).json({ success: false, message: "AI parsing failed: " + error.message });
  }
});

// --- VITE MIDDLEWARE / STATIC SERVING CONFIG ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite dev server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    // Serve bundled assets in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cloud Expense Tracker server running on port ${PORT}`);
    console.log(`Backend Cloud Storage DB initialized in ${EXPENSES_FILE}`);
  });
}

startServer();
