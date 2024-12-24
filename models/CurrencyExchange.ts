import { Schema, model, models, Document } from 'mongoose';

// Interface for exchange rates
interface ExchangeRates {
  lunar: number;
  venus: number;
  saturn: number;
  [key: string]: number;  // For future currency additions
}

// Interface for special event
interface SpecialEvent {
  name: string;
  description: string;
  multiplier: number;
  affectedCurrencies: string[];
  startDate: Date;
  endDate: Date;
}

// Main CurrencyExchange interface
export interface ICurrencyExchange extends Document {
  baseCurrency: string;
  rates: ExchangeRates;
  effectiveFrom: Date;
  effectiveUntil: Date;
  specialEvent?: SpecialEvent;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SpecialEventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  multiplier: {
    type: Number,
    required: true,
    min: 0.1,
    max: 10.0
  },
  affectedCurrencies: [{
    type: String,
    enum: ['lunar', 'venus', 'saturn', 'galactic']
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

const CurrencyExchangeSchema = new Schema({
  baseCurrency: {
    type: String,
    required: true,
    default: 'galactic',
    enum: ['galactic']  // Only galactic can be base currency
  },
  rates: {
    lunar: {
      type: Number,
      required: true,
      min: 0.000001  // Prevent division by zero issues
    },
    venus: {
      type: Number,
      required: true,
      min: 0.000001
    },
    saturn: {
      type: Number,
      required: true,
      min: 0.000001
    }
  },
  effectiveFrom: {
    type: Date,
    required: true
  },
  effectiveUntil: {
    type: Date,
    required: true
  },
  specialEvent: {
    type: SpecialEventSchema
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
CurrencyExchangeSchema.index({ effectiveFrom: 1, effectiveUntil: 1 });
CurrencyExchangeSchema.index({ isActive: 1 });

// Method to calculate exchange amount
CurrencyExchangeSchema.methods.exchange = function(
  fromCurrency: string,
  toCurrency: string,
  amount: number
): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to base currency (galactic) first if needed
  let baseAmount = amount;
  if (fromCurrency !== 'galactic') {
    baseAmount = amount * (1 / this.rates[fromCurrency]);
  }
  
  // Convert from base currency to target currency
  if (toCurrency === 'galactic') {
    return baseAmount;
  }
  
  let finalAmount = baseAmount * this.rates[toCurrency];
  
  // Apply special event multiplier if applicable
  if (this.specialEvent) {
    const now = new Date();
    if (
      now >= this.specialEvent.startDate &&
      now <= this.specialEvent.endDate &&
      this.specialEvent.affectedCurrencies.includes(toCurrency)
    ) {
      finalAmount *= this.specialEvent.multiplier;
    }
  }
  
  return finalAmount;
};

// Method to get current exchange rate between any two currencies
CurrencyExchangeSchema.methods.getRate = function(
  fromCurrency: string,
  toCurrency: string
): number {
  return this.exchange(fromCurrency, toCurrency, 1);
};

// Static method to find active exchange rates
CurrencyExchangeSchema.statics.getCurrentRates = async function() {
  const now = new Date();
  return this.findOne({
    effectiveFrom: { $lte: now },
    effectiveUntil: { $gt: now },
    isActive: true
  }).sort({ effectiveFrom: -1 });
};

export const CurrencyExchange = models.CurrencyExchange || 
  model<ICurrencyExchange>('CurrencyExchange', CurrencyExchangeSchema);