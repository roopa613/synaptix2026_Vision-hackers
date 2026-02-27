const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  python: { type: Number, min: 0, max: 5, default: 0 },
  ml: { type: Number, min: 0, max: 5, default: 0 },
  sql: { type: Number, min: 0, max: 5, default: 0 },
  tensorflow: { type: Number, min: 0, max: 5, default: 0 },
  dataviz: { type: Number, min: 0, max: 5, default: 0 },
  aws: { type: Number, min: 0, max: 5, default: 0 },
  javascript: { type: Number, min: 0, max: 5, default: 0 },
  react: { type: Number, min: 0, max: 5, default: 0 },
  nodejs: { type: Number, min: 0, max: 5, default: 0 },
  docker: { type: Number, min: 0, max: 5, default: 0 }
}, { _id: false });

const DemographicsSchema = new mongoose.Schema({
  gender: { 
    type: String, 
    enum: ['M', 'F', 'NB', ' Prefer not to say'], 
    required: true 
  },
  ethnicity: { 
    type: String, 
    enum: ['Asian', 'Black', 'Hispanic', 'White', 'Native American', 'Pacific Islander', 'Mixed', 'Other', 'Prefer not to say'],
    required: true 
  },
  ageRange: { 
    type: String, 
    enum: ['18-24', '25-34', '35-44', '45+', 'Prefer not to say'] 
  },
  disability: { type: Boolean, default: false },
  veteran: { type: Boolean, default: false }
}, { _id: false });

const RawScoresSchema = new mongoose.Schema({
  technical: Number,
  experience: Number,
  learning: Number,
  collaboration: Number
}, { _id: false });

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, required: true },
  location: { type: String, required: true },
  education: { type: String, required: true },
  skills: { type: SkillSchema, required: true },
  experience: { type: Number, min: 0, max: 50, required: true }, // Years
  learning: { type: Number, min: 1, max: 5, required: true }, // Agility score
  collaboration: { type: Number, min: 1, max: 5, required: true },
  projects: { type: Number, default: 0 },
  demographics: { type: DemographicsSchema, required: true },
  rawScores: { type: RawScoresSchema },
  resumeUrl: String,
  portfolioUrl: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to calculate raw scores
CandidateSchema.pre('save', function(next) {
  this.rawScores = {
    technical: this.calculateTechnicalRawScore(),
    experience: (this.experience / 5) * 100,
    learning: (this.learning / 5) * 100,
    collaboration: (this.collaboration / 5) * 100
  };
  this.updatedAt = Date.now();
  next();
});

// Instance method to calculate technical raw score
CandidateSchema.methods.calculateTechnicalRawScore = function() {
  const skillValues = Object.values(this.skills.toObject());
  const avgSkill = skillValues.reduce((a, b) => a + b, 0) / skillValues.length;
  return (avgSkill / 5) * 100;
};

// Static method to get diversity statistics
CandidateSchema.statics.getDiversityStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: {
          gender: '$demographics.gender',
          ethnicity: '$demographics.ethnicity'
        },
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Candidate', CandidateSchema);