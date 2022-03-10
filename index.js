const { Pool } = require('pg');
var pool = new Pool({
    connectionString: process.env.DATABASE_URL|| "postgres://postgres:piechu@localhost/users",
    // ssl: {
    //   rejectUnauthorized: false
    // }
})

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
//HERE 
var app=express()
const session = require("express-session");
const res = require('express/lib/response');
const req = require('express/lib/request');
app.use(session({
  name: "session",
  secret: 'Captain Teemo',
  resave: false,
  saveUninitialized: false,
  maxAge: 30 * 60 * 1000, 
}))


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
<<<<<<< Updated upstream

app.get('/admin', (req, res) => {
	var getUsersQuery = 'SELECT * FROM usr';
	pool.query(getUsersQuery, (error,result) => {
		if (error)
			res.end(error);
		var results = {'rows':result.rows}
		res.render('pages/admin',results);
	})
});

=======
>>>>>>> Stashed changes
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

//
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});
app.post('/loginn', async(req,res)=>{

  let un = req.body.username;
  let pw = req.body.password;

  const result = await pool.query(`SELECT * FROM usr WHERE username = '${un}' AND password = '${pw}'`);

  const count = await pool.query(`SELECT COUNT(*) FROM usr WHERE username = '${un}' AND password = '${pw}'`);
  const results = { 'results': (result) ? result.rows : null};
  const countResult ={'results': (count)?count.rows:null};
  req.session.user = results;
  val=req.session.user;
  if (countResult['results'][0].count==0){
      res.render('pages/loginIncorrect')  
    }else{
      if(results['results'][0].adminid == null){
        res.render('pages/account',val);
      }else{
        res.render('pages/accountAdmin',val);
      }
  }
})

  app.get('/account/verifypassword',async(req,res)=>{
    if(req.session.user){
      try{ 
        res.render('pages/changePassword') 
      }
      catch(err){
        res.send("Error" + err);
      }
    }else{
      res.redirect('/')
    }
  })
  
  app.post('/account/verifiedpassword',async(req,res)=>{
    if(req.session.user){
      try{
        let datapassword=req.body.password;
        let id=val.results[0].uid;
        const result= await pool.query(`SELECT Count(*) FROM usr WHERE uid='${id}' AND password = '${datapassword}'`);
        const results = { 'results': (result) ? result.rows : null};
        if (results['results'][0].count==0){
          res.render('pages/changePasswordIncorrect')
        }else{
          res.render('pages/changePasswordVerified');
        }
      }
      catch(err){
        res.send(err);
      }
    }else{
      res.redirect('/')
    }
  })

  app.post('/updatedPassword',async(req,res)=>{
    if(req.session.user){
      try{
        let newPassword=req.body.password;
        let id=val.results[0].uid;
        const update= await pool.query(`UPDATE usr SET password= '${newPassword}' WHERE uid = '${id}'`);
        req.session.destroy();
        res.render('pages/index')
      }
      catch(err){
        res.send(err);
      }
    }
    else{
      res.redirect('/')
    }
  })
  
//Username change
app.get('/account/verifyusername',async(req,res)=>{
  if(req.session.user){
    try{ 
      res.render('pages/changeUsername') 
    }
    catch(err){
      res.send("Error" + err);
    }
  }else{
    res.redirect('/')
  }
})

app.post('/account/verifiedusername',async(req,res)=>{
  if(req.session.user){
    try{
      let datapassword=req.body.password;
      let id=val.results[0].uid;
      const result= await pool.query(`SELECT Count(*) FROM usr WHERE uid='${id}' AND password = '${datapassword}'`);
      const results = { 'results': (result) ? result.rows : null};
      if (results['results'][0].count==0){
        res.render('pages/changeUsernameIncorrect')
      }else{
        res.render('pages/changeUsernameVerified');
      }
    }
    catch(err){
      res.send(err);
    }
  }else{
    res.redirect('/')
  }
})

app.post('/updatedUsername',async(req,res)=>{
  if(req.session.user){
    try{
      let newUsername=req.body.username;
      let id=val.results[0].uid;
      const update= await pool.query(`UPDATE usr SET username= '${newUsername}' WHERE uid = '${id}'`);
      req.session.destroy();
      res.render('pages/index')
    }
    catch(err){
      res.send(err);
    }
  }
  else{
    res.redirect('/')
  }
})