require("dotenv").config()
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const passportLocal = require("passport-local").Strategy
const session = require("express-session")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const User = require("./models/userSchema")

const app = express()

mongoose.connect(
    process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, 
).then(() => {
    console.log("mongoose is conncected")
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(process.env.SECRET_KEY));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);  

app.post('/signup', async(req, res) => {
    console.log(req.body)
    try{
        const user = await User.findOne({username:req.body.username})
        if(!user){
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword
            })
            await newUser.save();
            res.send("User created")
        }else{
            res.send("User already exists")
        }
    }catch(err){
        console.log(console.log(err))
    }
})

app.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.send("No user exists");
            return;
        }

        const compareResult = await bcrypt.compare(req.body.password, user.password);
        if (compareResult) {
            req.logIn(user, err => {
                if (err) throw err;
                res.send("Successfully authenticated");
            });
        } else {
            res.send("Incorrect password");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/user', (req, res) => {
    res.send(req.user)
}) 

app.listen(3001, () => {
    console.log("Listen to port 3001")
})
