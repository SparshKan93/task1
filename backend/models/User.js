// models/User.js
const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, enum: ['google'] },
    providerId: { type: String, required: true },
    email: { type: String, lowercase: true },
    accessToken: String,
    refreshToken: String,
    tokenExpiresAt: Date
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    /* LOCAL-AUTH fields */
    fullName: String,
    email: {                            // <- rename to email
      type: String,
      lowercase: true,
      unique: true,
      sparse: true                      // lets Google users skip this field
    },
    passwordHash: String,               // <- add this

    /* OAUTH identities (may be empty for local users) */
    providers: [providerSchema],

    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

userSchema.index({ 'providers.name': 1, 'providers.providerId': 1 });

module.exports = mongoose.model('User', userSchema);
