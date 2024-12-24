import { Schema, model, models, Document } from 'mongoose';

// Interface for test cases
interface TestCase {
  input: string;
  expectedOutput: string;
  explanation: string;
  isHidden: boolean;
}

// Interface for challenge requirements
interface Requirements {
  previousChallengeIds: Schema.Types.ObjectId[];
  requiredSkills: string[];
  difficulty: number;
}

// Interface for Monaco editor settings
interface EditorConfig {
  language: string;  // javascript, typescript, python, etc.
  theme: string;
  autoComplete: boolean;
  tabSize: number;
  minimap: boolean;
  lineNumbers: boolean;
  wordWrap: string;
}

// Main CodingChallenge interface
export interface ICodingChallenge extends Document {
  title: string;
  description: string;
  storylineContext: string;    // How this fits into the station's story
  category: string;            // frontend, backend, algorithms, etc.
  subCategory: string;         // arrays, functions, API calls, etc.
  planetId: Schema.Types.ObjectId;
  orderInPlanet: number;       // 1-10
  requirements: Requirements;
  problemStatement: {
    context: string;           // Real-world scenario
    task: string;             // What needs to be done
    constraints: string[];     // Technical limitations/requirements
    examples: {
      input: string;
      output: string;
      explanation: string;
    }[];
  };
  testCases: TestCase[];
  startingCode: string;        // Initial code template
  solution: {
    code: string;
    explanation: string;
    timeComplexity: string;
    spaceComplexity: string;
    alternativeApproaches: string[];
  };
  editorConfig: EditorConfig;
  hints: {
    text: string;
    unlockCost: number;       // Currency cost to unlock hint
  }[];
  resources: {
    title: string;
    url: string;
    type: string;            // documentation, article, video
  }[];
  validation: {
    timeLimit: number;       // in milliseconds
    memoryLimit: number;     // in MB
    inputFormat: string;     // Description of expected input format
    outputFormat: string;    // Description of expected output format
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CodingChallengeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  storylineContext: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'algorithms', 'database', 'system-design']
  },
  subCategory: {
    type: String,
    required: true
  },
  planetId: {
    type: Schema.Types.ObjectId,
    ref: 'Planet',
    required: true
  },
  orderInPlanet: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  requirements: {
    previousChallengeIds: [{
      type: Schema.Types.ObjectId,
      ref: 'CodingChallenge'
    }],
    requiredSkills: [String],
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    }
  },
  problemStatement: {
    context: { type: String, required: true },
    task: { type: String, required: true },
    constraints: [String],
    examples: [{
      input: String,
      output: String,
      explanation: String
    }]
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    explanation: String,
    isHidden: { type: Boolean, default: false }
  }],
  startingCode: {
    type: String,
    required: true
  },
  solution: {
    code: { type: String, required: true },
    explanation: { type: String, required: true },
    timeComplexity: String,
    spaceComplexity: String,
    alternativeApproaches: [String]
  },
  editorConfig: {
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'typescript', 'python', 'java']
    },
    theme: {
      type: String,
      default: 'vs-dark'
    },
    autoComplete: {
      type: Boolean,
      default: true
    },
    tabSize: {
      type: Number,
      default: 2
    },
    minimap: {
      type: Boolean,
      default: true
    },
    lineNumbers: {
      type: Boolean,
      default: true
    },
    wordWrap: {
      type: String,
      default: 'on'
    }
  },
  hints: [{
    text: String,
    unlockCost: Number
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['documentation', 'article', 'video']
    }
  }],
  validation: {
    timeLimit: {
      type: Number,
      required: true
    },
    memoryLimit: {
      type: Number,
      required: true
    },
    inputFormat: String,
    outputFormat: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for planet and challenge order
CodingChallengeSchema.index({ planetId: 1, orderInPlanet: 1 }, { unique: true });

// Indexes for frequent queries
CodingChallengeSchema.index({ category: 1 });
CodingChallengeSchema.index({ difficulty: 1 });
CodingChallengeSchema.index({ isActive: 1 });

export const CodingChallenge = models.CodingChallenge || 
  model<ICodingChallenge>('CodingChallenge', CodingChallengeSchema);