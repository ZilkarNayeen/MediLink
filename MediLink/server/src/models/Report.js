
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

// This creates the 'reports' collection in your MongoDB
const Report = mongoose.model('Report', reportSchema);

export default Report;