import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  subscriber: {
    type: mongoose.Schema.type.ObjectId,
    ref: "User",
  },
  channel: {
    type: mongoose.Schema.type.ObjectId,
    ref: "User",
  },
});

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
