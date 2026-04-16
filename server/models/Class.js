import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "8th", "9th"
  section: { type: String }, // optional: "A", "B"

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },

  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }
  ]

}, { timestamps: true });

export default mongoose.model('Class', classSchema);