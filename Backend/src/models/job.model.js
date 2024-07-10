import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  locations: {
    type: [String],
    default: [],
  },
  salary: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
    default: new Date('9999-12-31')
  },

  workExperienceMinYears: { ////////////
    type: Number,
    default: 0,
  },
  isRemote: {
    type: Boolean,
    default: false,
  },
  skillsRequired: {
    type: [String],
    default: [],
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
  },
  industry: {
    type: String,
    default: '',
  },  //////////////

}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;