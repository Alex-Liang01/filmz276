const { Pool } = require('pg')
const pool = new Pool({
  connectionSring: process.env.DATABASE_URL,
  
});

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
      //let birthday=req.body.birthday; 
      let gender=req.body.gender;
      const client = await pool.connect();
      const newuser= await client.query(`INSERT INTO users VALUES ('${username}','${password}','${email}','${firstname}',
      '${lastname}','${gender}')`);
      res.render('pages/index');
      client.release();
    }
    catch(err){
      res.send("Error" + err);
    }
  })
