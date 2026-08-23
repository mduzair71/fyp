import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    age: { type: Number },
    address: { type: String },
    createdAt: { type: String }, // Explicitly handling the string date from your DB
  },
  { 
    strict: false, // Allows fetching fields not defined in the schema
    collection: "Users" // Forcing the collection name again for absolute certainty
  }
);

// This ensures we always target the 'Users' collection with a capital 'U'
const User = mongoose.models.User || mongoose.model("User", UserSchema, "Users");

export default User;