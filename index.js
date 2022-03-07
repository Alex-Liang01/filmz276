const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
})


const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app=express()
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.get('/signup',(req,res)=>{
    res.render('pages/signup')
})
app.post('/signedup',async(req,res)=>{
    try{
      let username=req.body.username; let password=req.body.password; let firstname=req.body.firstname; 
      let lastname=req.body.lastname; let email =req.body.email;
      let birthday=req.body.birthday; let gender=req.body.gender;
      const newuser= await pool.query(`INSERT INTO usr VALUES ('${username}','${password}','${firstname}',
      '${lastname}','${email}','${birthday}','${gender}')`);
      res.render('pages/thankyou');
    }
    catch(err){
      res.send("Error" + err);
    }
  })
