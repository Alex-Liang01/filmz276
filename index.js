const { Pool } = require('pg');
var pool = new Pool({
<<<<<<< HEAD
    connectionString: 'postgres://postgres:sanjit12@localhost/users',
    // ssl: {
    //   rejectUnauthorized: false
    // }
})
=======
<<<<<<< HEAD
    connectionString: process.env.DATABASE_URL|| "postgres://postgres:123456789@localhost/proj",
>>>>>>> f4648d280b0667e6ba0cf1aafc140a0b975847e1


    // connectionString: process.env.DATABASE_URL
    // ssl: {
    // rejectUnauthorized: false
    // }
  })
  var cors = require("cors")
  const express = require('express')
  const path = require('path')
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const PORT = process.env.PORT || 5000
  var app=express()
  app.use("/", cors())
  const session = require("express-session");
  const res = require('express/lib/response');
  const req = require('express/lib/request');
  const { timeStamp } = require('console');
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
  app.get('/',async(req,res)=>{
    if (typeof req.session.user === 'undefined') {
      res.redirect('loginn')
    }else{
    try {
      const base_url="https://api.themoviedb.org/3/movie/popular?"
      const url=base_url+api_key+"&language=en-US&page=1"
      const img_url="https://image.tmdb.org/t/p/w500/"
      await fetch(url).then(res=>res.json()).then(data=>{
        results=data.results.slice(0, 10);
        res.render('pages/',{data: {user:val},results});
      })
    }
    catch(err){
      res.send(err);
    }
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
            res.redirect('/')
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
=======
  connectionString: process.env.DATABASE_URL,
  ssl: {
   rejectUnauthorized: false
  }
})
var cors = require("cors")
const express = require('express')
const path = require('path')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const PORT = process.env.PORT || 5000
var app=express()
app.use("/", cors())
const session = require("express-session");
const res = require('express/lib/response');
const req = require('express/lib/request');
const { timeStamp } = require('console');
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
app.get('/',async(req,res)=>{
	if (typeof req.session.user === 'undefined') {
		res.redirect('loginn')
	}else{
	try {
    const base_url="https://api.themoviedb.org/3/movie/popular?"
    const url=base_url+api_key+"&language=en-US&page=1"
    const img_url="https://image.tmdb.org/t/p/w500/"
    await fetch(url).then(res=>res.json()).then(data=>{
      results=data.results.slice(0, 10);
      res.render('pages/',{data: {user:val},results});
    })
	}
  catch(err){
    res.send(err);
  }
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
>>>>>>> 1d884678e98a94e293efbd85cc9a6c71be27c626
      if(req.session.user){
        let adminid=val.results[0].adminid; 
        try{
          if(adminid==null){
            res.render('pages/changePassword', {data: {user:val}})  
          }
          else{
            res.render('pages/changePasswordAdmin', {data: {user:val}}) 
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
              res.render('pages/changePasswordIncorrect', {data: {user:val}})
            }else{
              res.render('pages/changePasswordAdminIncorrect', {data: {user:val}})
            }
          }else{
            if(adminid==null){
              res.render('pages/changePasswordVerified', {data: {user:val}});
          }else{
            res.render('pages/changePasswordVerifiedAdmin', {data: {user:val}})
          }
        }
      }
        catch(err){
          res.send(err);
        }
      }else{
        res.redirect('/',)
      }
    })
  
    app.post('/updatedPassword',async(req,res)=>{
      if(req.session.user){
        try{
         
          let newPassword=req.body.password;
          let id=val.results[0].uid;
          const update= await pool.query(`UPDATE usr SET password= '${newPassword}' WHERE uid = '${id}'`);
          req.session.destroy();
          res.redirect('/')
        }
        catch(err){
          res.send(err, {data: {user:val}});
        }
      }
      else{
        res.redirect('/', {data: {user:val}})
      }
    })
<<<<<<< HEAD
  
    const api_key="api_key=430a4dbae6e33d3664541b0199ae6a38"
  
  
    // ----------- SEARCH -----------
  app.post('/search', async(req,res) => {
    if (typeof req.session.user === 'undefined') {
    res.redirect('/loginn')
  } else {
    let query = req.body.searchquery;
        res.redirect('/search?q='+query)
  }
=======
    
  //Username change
  app.get('/account/verifyusername',async(req,res)=>{
    if(req.session.user){
      try{
        let adminid=val.results[0].adminid; 
        if(adminid==null){
          res.render('pages/changeUsername', {data: {user:val}}) 
        }else{
          res.render('pages/changeUsernameAdmin', {data: {user:val}})
        }
      }
      catch(err){
        res.send("Error" + err, {data: {user:val}});
      }
    }else{
      res.redirect('/', {data: {user:val}})
    }
>>>>>>> 1d884678e98a94e293efbd85cc9a6c71be27c626
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
            res.render('pages/changeUsernameIncorrect', {data: {user:val}})
          }else{
            res.render('pages/changeUsernameAdminIncorrect', {data: {user:val}})
          }
        }else{
          if(adminid==null){
            res.render('pages/changeUsernameVerified', {data: {user:val}});
          }else{
            res.render('pages/changeUsernameVerifiedAdmin', {data: {user:val}});
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
        res.redirect('/')
      }
      catch(err){
        res.send(err);
      }
    }
    else{
      res.redirect('/')
    }
  })

  const api_key="api_key=430a4dbae6e33d3664541b0199ae6a38"


  // ----------- SEARCH -----------
app.post('/search', async(req,res) => {
  if (typeof req.session.user === 'undefined') {
  res.redirect('/loginn')
} else {
  let query = req.body.searchquery;
      res.redirect('/search?q='+query)
}
})

// ----------- SEARCH RESULTS -----------
app.get('/search', async(req,res) => {
if (typeof req.session.user === 'undefined') {
  res.redirect('/loginn')
}
else {
  try{
    const query = req.query.q;
    const page = req.query.page;
    const url="https://api.themoviedb.org/3/search/movie?query="+query+"&page="+page+"&api_key=430a4dbae6e33d3664541b0199ae6a38"
    await fetch(url).then(res=>res.json()).then(data=>{
      //results = data.results.slice(0, 10);
      results = data.results;
      currentPage = data.page;
      numPages = data.total_pages;
      res.render('pages/search',{data: {user:val},results, currentPage, numPages, query});
    })
  }
  catch(err){
    res.send(err);
  }
}
})

  app.get('/TMDB_10',async(req,res)=>{
    if (typeof req.session.user === 'undefined') {
      res.redirect('loginn')
    }else{
    try{
   
      const base_url="https://api.themoviedb.org/3/movie/top_rated?"
      const url=base_url+api_key+"&language=en-US&page=1"
      const img_url="https://image.tmdb.org/t/p/w500/"
      await fetch(url).then(res=>res.json()).then(data=>{
        results=data.results.slice(0, 10);
        res.render('pages/top10',{data: {user:val},results});
      })
    }
    catch(err){
      res.send(err);
    }
  }
  })
<<<<<<< HEAD
  
    app.get('/TMDB_10',async(req,res)=>{
      if (typeof req.session.user === 'undefined') {
        res.redirect('loginn')
      }else{
      try{
     
        const base_url="https://api.themoviedb.org/3/movie/top_rated?"
        const url=base_url+api_key+"&language=en-US&page=1"
        const img_url="https://image.tmdb.org/t/p/w500/"
        await fetch(url).then(res=>res.json()).then(data=>{
          results=data.results.slice(0, 10);
          res.render('pages/top10',{data: {user:val},results});
        })
      }
      catch(err){
        res.send(err);
      }
    }
    })
    //Testing of top 10 TMDB page
    app.get('/test_TMDB_10', function(req, res) {
      const base_url="https://api.themoviedb.org/3/movie/top_rated?"
        const url=base_url+api_key+"&language=en-US&page=1"
        const img_url="https://image.tmdb.org/t/p/w500/"
        fetch(url).then(res=>res.json()).then(data=>{
          results=data.results.slice(0, 10);
          res.json(results);
        })
    });
    app.get('/:id',async(req,res)=>{
      if (typeof req.session.user === 'undefined') {
        res.redirect('loginn')
      }else{
      try{
        const base_url="https://api.themoviedb.org/3/movie/"
        const movie_id=req.params.id+"?"
        const url_movie=base_url+movie_id+api_key+"&language=en-US"
        await fetch(url_movie).then(res=>res.json()).then(data=>{
          if(data.success==false){
            res.render('pages/notfound',{data:{user:val}})
            return;
          }
          results=data
          res.render('pages/movie',{data: {user:val},results});
        })
      }
      catch(err){
        res.send(err);
      }
    }
    })
  //Testing of each individual movie page
    app.get('/test_movieIdSuccess', function(req, res) {
        fetch("https://api.themoviedb.org/3/movie/25?api_key=430a4dbae6e33d3664541b0199ae6a38&language=en-US")
        .then(res=>res.json()).then(data=>{
          if(data.success==false){
            res.json(data)
            return;
          }
          results=data
          res.json(results);
        })
    });
    app.get('/test_movieIdFail', function(req, res) {
      fetch("https://api.themoviedb.org/4/movie/25?api_key=430a4dbae6e33d3664541b0199ae6a38&language=en-US")
=======
  //Testing of top 10 TMDB page
  app.get('/test_TMDB_10', function(req, res) {
    const base_url="https://api.themoviedb.org/3/movie/top_rated?"
      const url=base_url+api_key+"&language=en-US&page=1"
      const img_url="https://image.tmdb.org/t/p/w500/"
      fetch(url).then(res=>res.json()).then(data=>{
        results=data.results.slice(0, 10);
        res.json(results);
      })
  });
  app.get('/:id',async(req,res)=>{
    if (typeof req.session.user === 'undefined') {
      res.redirect('loginn')
    }else{
    try{
      const base_url="https://api.themoviedb.org/3/movie/"
      const movie_id=req.params.id+"?"
      const url_movie=base_url+movie_id+api_key+"&language=en-US"
      await fetch(url_movie).then(res=>res.json()).then(data=>{
        if(data.success==false){
          res.render('pages/notfound',{data:{user:val}})
          return;
        }
        results=data
        res.render('pages/movie',{data: {user:val},results});
      })
    }
    catch(err){
      res.send(err);
    }
  }
  })
//Testing of each individual movie page
  app.get('/test_movieIdSuccess', function(req, res) {
      fetch("https://api.themoviedb.org/3/movie/25?api_key=430a4dbae6e33d3664541b0199ae6a38&language=en-US")
>>>>>>> 1d884678e98a94e293efbd85cc9a6c71be27c626
      .then(res=>res.json()).then(data=>{
        if(data.success==false){
          res.json(data)
          return;
        }
        results=data
        res.json(results);
      })
  });
<<<<<<< HEAD
  
  us=[];
    app.post('/testSignup', function(req, res) {
      signup_query=`....`
      //`INSERT INTO usr (username, password, firstname, lastname, email, birthday, gender) VALUES ('${username}','${password}','${firstname}','${lastname}','${email}','${birthday}','${gender}')`
      const newuser=pool.query(signup_query);
  
      ob={'username':'test','password':'myPassword','firstname':'Joe',
      'lastname':'Wong','email':'cmpt@sfu.ca','birthday':'2001-02-01','gender':'male'}
      us.push(ob);
      res.json(us);
    });
    module.exports = app;
=======
  app.get('/test_movieIdFail', function(req, res) {
    fetch("https://api.themoviedb.org/4/movie/25?api_key=430a4dbae6e33d3664541b0199ae6a38&language=en-US")
    .then(res=>res.json()).then(data=>{
      if(data.success==false){
        res.json(data)
        return;
      }
      results=data
      res.json(results);
    })
});

us=[];
  app.post('/testSignup', function(req, res) {
    signup_query=`....`
    //`INSERT INTO usr (username, password, firstname, lastname, email, birthday, gender) VALUES ('${username}','${password}','${firstname}','${lastname}','${email}','${birthday}','${gender}')`
    const newuser=pool.query(signup_query);

    ob={'username':'test','password':'myPassword','firstname':'Joe',
    'lastname':'Wong','email':'cmpt@sfu.ca','birthday':'2001-02-01','gender':'male'}
    us.push(ob);
    res.json(us);
  });
  module.exports = app;
>>>>>>> 1d884678e98a94e293efbd85cc9a6c71be27c626
