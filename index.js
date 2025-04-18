import express from "express";
import bodyParser from  "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

const { Pool } = pg;

const pool = new  Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized :false,
    },
});

export default pool;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var actual_user= "";

app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/home",(req,res)=>{
    res.render("home.ejs",{user:actual_user});
});
app.get("/signin",(req,res)=>{
    res.render("signup.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs")
});
app.get("/products",(req,res)=>{
    res.render("products.ejs");
});
app.get("/community",(req,res)=>{
    res.render("community.ejs");
});
app.get("/resources",(req,res)=>{
    res.render("resources.ejs");
});
app.get("/aboutus",(req,res)=>{
    res.render("about.ejs");
})
app.get("/solution",(req,res)=>{
    res.render("solution.ejs");
});
app.get("/user_home",(req,res)=>{
    res.render("user_home.ejs",{user:actual_user});
});
app.get("/userhome",(req,res)=>{
    res.render("user_home.ejs");
});
app.get("/profile",async (req,res)=>{
    const result = await pool.query("select * from users where username = $1",[actual_user]);
    const user = result.rows[0];
    console.log(user);
    const address1= user.address;
    const mail1 = user.email;
    res.render("profile.ejs",{user1:actual_user,address: address1,mail: mail1});
});
app.get("/gardener",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from gardener");
        const gardeners = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("gardener.ejs",{gardener : gardeners});
        }
        else{   
            res.send("No gardener nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/carpenter",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from carpenter");
        const carpenters = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("carpenter.ejs",{carpenter : carpenters});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/keeper",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from housekeeping");
        const keepers = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("housekeeper.ejs",{keeper: keepers});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/cleaner",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from cleaner");
        const cleaners = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("cleaner.ejs",{cleaner: cleaners});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/electrician",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from electricain");
        const electricains = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("electrician.ejs",{electricain : electricains});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/tvrepair",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from tvrepair");
        const tvrepairs = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("tvrepair.ejs",{tvrepair: tvrepairs});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.post("/register", async (req,res)=>{
    const email  = req.body.email;
    const name = req.body.username;
    const address = req.body.address;
    const password = req.body.password;
    try{
        const checkResult = await pool.query("select * from users where username = $1",[name]);
        if(checkResult.rows.length>0){  
            return res.send("user already exists");
        }
        else{
            await pool.query("insert into users (email,username,address,password) values ($1,$2,$3,$4)",[email,name,address,password]);
            return res.send("registration successfull");
        }
    }
    catch(err){ 
        console.log(err);
    }
});
app.post("/login", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const checkResult = await pool.query("select * from users where username = $1",[username]);
        if(checkResult.rows.length<0){
            res.send("user doesn't not exits please register before login");
        }
        else{
            const user = checkResult.rows[0];
            const storedPassword = user.password;
            const user_email = user.email;
            const address1  = user.address;
            if(storedPassword==password){
                actual_user = username;
                res.render("user_home.ejs",{user:username,address:address1,userMail:user_email});
            }
            else{
                res.send("invalid password");
            }
        }
    }
    catch(err){
        console.log(err);
    }
});
app.listen(port,()=>{
    console.log(`server running on port ${3000}`);
});
