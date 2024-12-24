import { Schema, model } from 'mongoose';

const PlanetSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  assetUrl: { 
    type: String, 
    required: true 
  },
  difficulty: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10 
  },
  currencyType: { 
    type: String, 
    required: true,
    enum: ['lunar', 'venus', 'saturn'] 
  },
  themeColor: {
    type: String,
    required: true,
  },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
}, {
  timestamps: true
});

// Indexes for frequent queries
PlanetSchema.index({ isActive: 1 });
PlanetSchema.index({ difficulty: 1 });

export const Planet = model('Planet', PlanetSchema);
