import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Email address is required"],
    validate: [validator.isEmail, "Invalid Email Id"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password Confirm is required"],
    validate: {
      // This only works on CREATE or SAVE!!
      validator: function (el: any) {
        return el === (this as any).password;
      },
      message: "Passwords are not the same!",
    },
  },
});

UserSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  (this as any).passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: any,
  userPassword: any
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

declare interface IUser extends mongoose.InferSchemaType<typeof UserSchema> {
  correctPassword(candidatePassword: any, userPassword: any): boolean;
}

export const User = mongoose.model<IUser>("User", UserSchema);
