import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, lowercase: true, unique: true },
  password:{type:String, required:true},
}, { timestamps: true });


teacherSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  

teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
  return next();
}
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


export default mongoose.model('Teacher', teacherSchema);