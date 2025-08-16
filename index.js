const dotnev=require('dotenv');
const express=require('express');
const path=require('path');
const app=express();
const userRoutes=require('./routes/user');
const blogRoute=require('./routes/blog');
const {authenticationMiddleware}=require('./middlewares/authentication');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const {token} = require('./services/authentication');
const Blog = require('./models/blog');


dotnev.config();
console.log(process.env.DB_URL);
console.log(process.env.PORT);

mongoose.connect(process.env.DB_URL)
.then((e) => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});

app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 8000;
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));



app.use(cookieParser());
app.use(authenticationMiddleware("token"));
app.use(express.static(path.resolve("./public")));

app.get("/",async(req,res)=>{
    // console.log("User at route handler:", req.user);
    const allblogs=await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs:allblogs,
    });
});

app.use("/user", userRoutes);
app.use("/blog", blogRoute);


app.listen(port,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});