
const { createHmac, randomBytes } = require("crypto");
const { Schema,model } = require('mongoose');
const {createTokenForUser}=require('../services/authentication');

const userschema = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    salt: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    profileImageURL: {
      type: String,
      default: '/images/profileimage.jpg'
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    }
  },
  { timestamps: true }
);


userschema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

// userschema.methods.isValidPassword = function (password) {
//   const hashedPassword = createHmac("sha256", this.salt)
//     .update(password)
//     .digest("hex");
//   return this.password === hashedPassword;
// }; 

//end of schema definition

userschema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
  
    if (hashedPassword !== userProvidedHash) {
      throw new Error("Invalid password!");
    }
    else{
      // return {...user,password: undefined, salt: undefined};
      // return user;
      const token=createTokenForUser(user);
      return token;
    }
  }
);


const user=model('user',userschema);

module.exports = user;