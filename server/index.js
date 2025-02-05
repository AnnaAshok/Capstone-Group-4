const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

const user = require("./models/users")
const Courses = require("./models/courses"); 
const Categories = require('./models/categories');

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


connectDB();

app.post("/login",(req,res)=>{
    const {email, password} = req.body
    user.findOne({email: email})
    .then(user => {
        if(user.password === password){
            res.json("Success")
        }
        else{
            res.json("Wrong Password")
        }
    })
    .catch(error => error.json(error))
}) 

app.post("/register",(req,res)=>{
   user.findOne({email: req.body.email})
   .then(result =>{ 
        if(result == null){
            user.create(req.body)
                .then(user=> res.json("Account created Successfully"))
                .catch(error => res.json(error))
        }else{
            res.json("User Already exists.Please Login!")
        }
   })
   
})

app.post("/getEmail",(req,res) =>{
    const {email} = req.body
    user.findOne({email:email})
    .then(result => {
        if(result){
            res.json("Success")
        }else{
            res.json("Email not found.Create an account!")
        }
    })
})

app.post("/resetpassword",(req, res)=>{
    const {email, password} = req.body
    user.findOneAndUpdate({email:email},{ password:password},{
        new: true
    }).then(result => {
        res.json("Success")
    })
})


// API Route to Fetch Courses
app.get("/courses", async (req, res) => {
    try {
        const courses = await Courses.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error });
    }
});

// API Route to fetch categories
app.get("/categories", async (req, res) => {
    try {
      const categories = await Categories.find();
      console.log("Fetched Categories:", categories);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })

app.listen(5000, () => {
    console.log('App listening on port 5000')
})