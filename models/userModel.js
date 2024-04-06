/* eslint-disable import/no-extraneous-dependencies */
const crypto = require("crypto");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      // required: [true, "Phone is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    profilePic: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12); // the higher the better and slower encrypted

  this.passwordConfirm = undefined;
});

// compering password
userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.updatedAt) {
    const changedTimestamp = parseInt(this.updatedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;

    // False means NOT changed
  }
  return false;
};

userSchema.methods.createPasswordRestToken = function () {
  const restToken = crypto.randomBytes(4).toString("hex"); // generating random string

  console.log(restToken);

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(restToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

  return restToken; // we gonna sent it via email
};

const User = mongoose.model("User", userSchema);

module.exports = User;
