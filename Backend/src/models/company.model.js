import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique:true
  },
  address: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    default:""
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;