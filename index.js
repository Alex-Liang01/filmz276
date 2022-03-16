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

//app.get('/', (req, res) => res.render('pages/index'))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.get('/signup',(req,res)=>{
    res.render('pages/signup')
})

// ----------- MAIN PAGE -----------
app.get('/',(req,res)=>{
	if (typeof req.session.user === 'undefined') {
		res.redirect('loginn')
	}
	else {
		res.render('pages/', {data: {user:val}})
	}
  
})

// ----------- ACCOUNT PAGE -----------
app.get('/account',(req,res)=>{ 
	if (typeof req.session.user === 'undefined') {
		res.redirect('loginn')
	}
	else {
		res.render('pages/account', {data: {user:val}})
	}
})

// ----------- ADMIN PAGE -----------
app.get('/admin', (req, res) => {
	if (typeof req.session.user === 'undefined') {
		res.redirect('loginn')
	}
	else {
		if (typeof req.session.isAdmin === 'undefined') {
			res.redirect('/')
		}
		else if (req.session.isAdmin == 1) {
			var getUsersQuery = 'SELECT * FROM usr';
			pool.query(getUsersQuery, (error,result) => {
				if (error)
					res.end(error);
				var results = {'rows':result.rows}
				res.render('pages/admin', {data: {user:val, userlist:results}});
			})
		}
	}
});

app.post('/signedup',async(req,res)=>{
    try{
      let username=req.body.username; let password=req.body.password; let firstname=req.body.firstname; 
      let lastname=req.body.lastname; let email =req.body.email;
      let birthday=req.body.birthday; let gender=req.body.gender;
      const newuser= await pool.query(`INSERT INTO usr (username, password, firstname, lastname, email, birthday, gender) VALUES ('${username}','${password}','${firstname}',
      '${lastname}','${email}','${birthday}','${gender}')`);
      res.render('pages/thankyou');
    }
    catch(err){
      res.send("Error" + err);
    }
  })



  app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
  });

// ----------- LOGIN PAGE -----------
app.get('/loginn',(req,res)=>{
	if(req.session.user){
	  res.redirect('/');
	}
	else{
	  res.render('pages/login')
	}
})

// ----------- LOGIN SCRIPT -----------
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
		if(results['results'][0].adminid == 1){
		  req.session.isAdmin = 1;
		  
		}
		res.redirect('/');
		//res.render('pages/', val)
	}
})

// ----------- LOGOUT SCRIPT -----------
app.post('/logout', async(req,res) => {
	req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
})

    app.get('/account/verifypassword',async(req,res)=>{
      if(req.session.user){
        let adminid=val.results[0].adminid; 
        try{
          if(adminid==null){
            res.render('pages/changePassword')  
          }
          else{
            res.render('pages/changePasswordAdmin') 
          }
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
          let adminid=val.results[0].adminid; 
          
          let datapassword=req.body.password;
          let id=val.results[0].uid;
          const result= await pool.query(`SELECT Count(*) FROM usr WHERE uid='${id}' AND password = '${datapassword}'`);
          const results = { 'results': (result) ? result.rows : null};
          if (results['results'][0].count==0){
            if(adminid==null){
              res.render('pages/changePasswordIncorrect')
            }else{
              res.render('pages/changePasswordAdminIncorrect')
            }
          }else{
            if(adminid==null){
              res.render('pages/changePasswordVerified');
          }else{
            res.render('pages/changePasswordVerifiedAdmin')
          }
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
        let adminid=val.results[0].adminid; 
        if(adminid==null){
          res.render('pages/changeUsername') 
        }else{
          res.render('pages/changeUsernameAdmin')
        }
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
        let adminid=val.results[0].adminid; 
        let datapassword=req.body.password;
        let id=val.results[0].uid;
        const result= await pool.query(`SELECT Count(*) FROM usr WHERE uid='${id}' AND password = '${datapassword}'`);
        const results = { 'results': (result) ? result.rows : null};
        if (results['results'][0].count==0){
          if(adminid==null){
            res.render('pages/changeUsernameIncorrect')
          }else{
            res.render('pages/changeUsernameAdminIncorrect')
          }
        }else{
          if(adminid==null){
            res.render('pages/changeUsernameVerified');
          }else{
            res.render('pages/changeUsernameVerifiedAdmin');
          }
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
  


