export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt: string;
  isRecurring?: boolean;
  recurringFrequency?: "Daily" | "Weekly" | "Monthly";
}

export interface Budget {
  category: string;
  limit: number;
}

export interface SpendingSummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  date: string; // e.g., "Jun 20" or "Jun 21"
  amount: number;
}

export interface AIReceiptResult {
  merchant: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  confidence: number;
}
