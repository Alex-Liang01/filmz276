const { Pool } = require('pg');
var pool = new Pool({
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
	}
  else{
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
    //}
    catch(err){
      res.send("Error" + err);
    }
  })

  app.post('/deleteuser', async (req, res) => {
    var username = req.body.username;
    console.log(username);
  
    try{
      // await pool.query(`DELETE FROM usr WHERE username='${username}'`);
      // const banneduser = await pool.query(`INSERT INTO banned (username) VALUES ('${username}')`);
      const banneduser = await pool.query(`UPDATE usr SET banned = '1' WHERE username = '${username}'`);
      res.redirect('/admin');

    }catch(err) {
    }
  });



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
	if (countResult['results'][0].count==0 || results['results'][0].banned == 1){
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
        res.redirect('/', {data: {user:val}})
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
    if (typeof query != 'string' || query == "") {
      // error page
      res.redirect('/')
    }
    else {
      await fetch(url).then(res=>res.json()).then(data=>{
        //results = data.results.slice(0, 10);
        results = data.results;
        currentPage = data.page;
        numPages = data.total_pages;
        res.render('pages/search',{data: {user:val},results, currentPage, numPages, query});
      })
    }
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
  
  app.get('/TMDB_10_TV',async(req,res)=>{
    if (typeof req.session.user === 'undefined') {
      res.redirect('loginn')
    }else{
    try{
  
      const base_url="https://api.themoviedb.org/3/tv/top_rated?"
      const url=base_url+api_key+"&language=en-US&page=1"
      const img_url="https://image.tmdb.org/t/p/w500/"
      await fetch(url).then(res=>res.json()).then(data=>{
        results=data.results.slice(0, 10);
        res.render('pages/top10TV',{data: {user:val},results});
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

  app.get('/test_Tv_10', function(req, res) {
    const base_url="https://api.themoviedb.org/3/tv/top_rated?"
      const url=base_url+api_key+"&language=en-US&page=1"
      const img_url="https://image.tmdb.org/t/p/w500/"
      fetch(url).then(res=>res.json()).then(data=>{
        results=data.results.slice(0, 10);
        res.json(results);
      })
  });

  app.get('/trending',async(req,res)=>{
    if (typeof req.session.user === 'undefined') {
      res.redirect('loginn')
    }else{
    try{
   
      const base_url="https://api.themoviedb.org/3/movie/popular?"
      const url=base_url+api_key+"&language=en-US&page=1"
      const img_url="https://image.tmdb.org/t/p/w154/"
      await fetch(url).then(res=>res.json()).then(data=>{
        results=data.results.slice(0, 10);
        res.render('pages/trending',{data: {user:val},results});
      })
    }
    catch(err){
      res.send(err);
    }
  }
 })
 
 //--------------Upcoming Movies---------------->
 app.get('/upcoming',async(req,res)=>{
  if (typeof req.session.user === 'undefined') {
    res.redirect('loginn')
  }else{
  try{
 
    const base_url="https://api.themoviedb.org/3/movie/upcoming?"
    const url=base_url+api_key+"&language=en-US&page=1"
    const img_url="https://image.tmdb.org/t/p/w154/"
    await fetch(url).then(res=>res.json()).then(data=>{
      results=data.results.slice(0, 10);
      res.render('pages/upcoming',{data: {user:val},results});
    })
  }
  catch(err){
    res.send(err);
  }
}
})

//Testing of Upcoming movies
app.get('/testUpcoming', function(req, res) {
  const base_url="https://api.themoviedb.org/3/movie/upcoming?"
  const url=base_url+api_key+"&language=en-US&page=1"
  fetch(url).then(res=>res.json()).then(data=>{
    results=data.results.slice(0, 10);
    res.json(results);
  })
});

//Testing of Trending Movies
app.get('/testTrending', function(req, res) {
  const base_url="https://api.themoviedb.org/3/movie/popular?"
  const url=base_url+api_key+"&language=en-US&page=1"
  fetch(url).then(res=>res.json()).then(data=>{
    results=data.results.slice(0, 10);
    res.json(results);
  })
});


//------------------- Trending TV Shows --------------->
app.get('/tv_trending',async(req,res)=>{
  if (typeof req.session.user === 'undefined') {
    res.redirect('loginn')
  }else{
  try{
 
    const base_url="https://api.themoviedb.org/3/tv/popular?"
    const url=base_url+api_key+"&language=en-US&page=1"
    const img_url="https://image.tmdb.org/t/p/w154/"
    await fetch(url).then(res=>res.json()).then(data=>{
      results=data.results.slice(0, 10);
      res.render('pages/tv_trending',{data: {user:val},results});
    })
  }
  catch(err){
    res.send(err);
  }
}
})

app.get('/testTrendingTv', function(req, res) {
  const base_url="https://api.themoviedb.org/3/tv/popular?"
  const url=base_url+api_key+"&language=en-US&page=1"
  const img_url="https://image.tmdb.org/t/p/w154/"
  fetch(url).then(res=>res.json()).then(data=>{
    results=data.results.slice(0, 10);
    res.json(results);
  })
  
});


// ----------- SUBMIT RATING -----------  
app.post('/submitrating', async(req,res) => {
    try{
		// needs to verify inputs
		let movie_id = req.body.movie_id; let user_id = req.session.user['results'][0].uid; 
		let rating = req.body.rating; let review_text = req.body.review_text;
		var storeReviewQuery = "INSERT INTO reviews (movie_id, user_id, rating, review_text) VALUES ($1, $2, $3, $4)";
		await pool.query(storeReviewQuery, [movie_id, user_id, rating, review_text])
		res.redirect('back');
    }
    catch(err){
      res.send("Error" + err);
    }
  })

// ----------- API -----------
	app.get('/api/movie/:id',async(req,res)=>{
		const movie_id = req.params.id;// needs sanitization
		var getReviewsQuery = "SELECT review_id, user_id, rating, review_text, firstname, lastname, username FROM reviews INNER JOIN usr ON reviews.user_id=usr.uid WHERE reviews.movie_id=$1";
		pool.query(getReviewsQuery, [movie_id], (error,result) => {
			if (error)
				res.end(error);
			res.setHeader('Content-Type', 'application/json');
			if (result.rows.length == 0) {
				success = "false";
				res.end(JSON.stringify({success:success}, null, 3));
			}
			else {
				success = "true";
				var reviews = {'rows':result.rows}
				var num = 0;
				result.rows.forEach( function(item) {
					num += item.rating;
				})
				//console.log(num)
				var avg = num/result.rows.length;
				res.end(JSON.stringify({success:success, resultCount:result.rows.length, avgRating:avg, reviews:reviews}, null, 3));
			}
		})
	})
  app.get('/api/tvshow/:id',async(req,res)=>{
		const movie_id = req.params.id;// needs sanitization
		var getReviewsQuery = "SELECT review_id, user_id, rating, review_text, firstname, lastname, username FROM reviews INNER JOIN usr ON reviews.user_id=usr.uid WHERE reviews.tvshow_id=$1";
		pool.query(getReviewsQuery, [movie_id], (error,result) => {
			if (error)
				res.end(error);
			res.setHeader('Content-Type', 'application/json');
			if (result.rows.length == 0) {
				success = "false";
				res.end(JSON.stringify({success:success}, null, 3));
			}
			else {
				success = "true";
				var reviews = {'rows':result.rows}
				var num = 0;
				result.rows.forEach( function(item) {
					num += item.rating;
				})
				//console.log(num)
				var avg = num/result.rows.length;
				res.end(JSON.stringify({success:success, resultCount:result.rows.length, avgRating:avg, reviews:reviews}, null, 3));
			}
		})
	})
//Testing of each individual movie page
  app.get('/test_movieIdSuccess', function(req, res) {
      fetch("https://api.themoviedb.org/3/movie/25?api_key=430a4dbae6e33d3664541b0199ae6a38&language=en-US").then(res=>res.json()).then(data=>{
        if(data.success==false){
          res.json(data)
          return;
        }
        results=data
        res.json(results);
      })
  });

  app.get('/test_movieIdFail', function(req, res) {
    fetch("https://api.themoviedb.org/4/movie/25?api_key=430a4dbae6e33d3664541b0199ae6a38&language=en-US").then(res=>res.json()).then(data=>{
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

  app.get('/testAdmin', function(req, res) {
    var getUsersQuery = 'SELECT * FROM usr';
			pool.query(getUsersQuery, (error,result) => {
				if (error)
					res.end(error);
				var results = {'rows':result.rows}
				res.json(results);
			})
  });

  app.get('/testSimilar', function(req, res) {
    const base_url="https://api.themoviedb.org/3/movie/"
    const similar_id="25/recommendations?"
    const url_similar=base_url+similar_id+api_key+"&language=en-US&page=1"
    fetch(url_similar).then(res=>res.json()).then(data=>{
      simResults=data.results.slice(0, 9);
      res.json(simResults);
    })
  });

  app.get('/testSimilarTv', function(req, res) {
    const base_url="https://api.themoviedb.org/3/tv/"
    const similar_id="25/recommendations?"
    const url_similar=base_url+similar_id+api_key+"&language=en-US&page=1"
    fetch(url_similar).then(res=>res.json()).then(data=>{
      simResultsTv=data.results.slice(0, 9);
      res.json(simResultsTv);
    })
  });

  app.get('/testSearchSpider-Man', function(req, res) {
    const url="https://api.themoviedb.org/3/search/movie?query=spiderman&page=1&api_key=430a4dbae6e33d3664541b0199ae6a38"
    fetch(url).then(res=>res.json()).then(data=>{
      results = data.results;
      res.json(results);
    })
  });

  app.get('/test_TvIdSuccess', function(req, res) {
      fetch("https://api.themoviedb.org/3/tv/25?api_key=430a4dbae6e33d3664541b0199ae6a38&language=en-US").then(res=>res.json()).then(data=>{
        if(data.success==false){
          res.json(data)
          return;
        }
        results=data
        res.json(results);
      })
  });

  app.get('/test_TvIdFail', function(req, res) {
    fetch("https://api.themoviedb.org/3/tv/10000000000000?api_key=430a4dbae6e33d3664541b0199ae6a38&language=en-US").then(res=>res.json()).then(data=>{
      if(data.success==false){
        res.json(data)
        return;
      }
      results=data
      res.json(results);
    })
});

  // ----------- MOVIE PAGE -----------
  app.get('/movie/:id',async(req,res)=>{
    if (typeof req.session.user === 'undefined') {
      res.redirect('/loginn')
    }else{
    try{
      const base_url="https://api.themoviedb.org/3/movie/"
      const movie_id=req.params.id+"?"
      const similar_id=req.params.id+"/recommendations?"
      const url_movie=base_url+movie_id+api_key+"&language=en-US"
      const url_similar=base_url+similar_id+api_key+"&language=en-US&page=1"
      await fetch(url_movie).then(res=>res.json()).then(data=>{
        if(data.success==false){
          res.render('pages/notfound',{data:{user:val}})
          return;
        }
        results=data
        fetch(url_similar).then(res=>res.json()).then(data=>{
          simResults=data.results.slice(0, 9);
          res.render('pages/movie',{data: {user:val},results,simResults});
        })
      })
    }
    catch(err){
      res.send(err);
    }
  }
  })

  
  app.get('/tvshow/:id',async(req,res)=>{
    if (typeof req.session.user === 'undefined') {
      res.redirect('/loginn')
    }else{
    try{
      const base_url="https://api.themoviedb.org/3/tv/"
      const movie_id=req.params.id+"?"
      const similar_id=req.params.id+"/recommendations?"
      const url_movie=base_url+movie_id+api_key+"&language=en-US"
      const url_similar=base_url+similar_id+api_key+"&language=en-US&page=1"
      await fetch(url_movie).then(res=>res.json()).then(data=>{
        if(data.success==false){
          res.render('pages/notfound',{data:{user:val}})
          return;
        }
        results=data
        fetch(url_similar).then(res=>res.json()).then(data=>{
          simResults=data.results.slice(0, 9);
          res.render('pages/tvshow',{data: {user:val},results,simResults});
        })
      })
    }
    catch(err){
      res.send(err);
    }
  }
  })

  //Rendering main page for all other endpoints
  app.get('*',async(req,res)=>{
    if (typeof req.session.user === 'undefined') {
      res.redirect('loginn')
    }
    else{
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

  module.exports = app;
  
