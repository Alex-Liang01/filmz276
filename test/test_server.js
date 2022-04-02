var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should(); 

chai.use(chaiHttp);  

describe('Signup test', function() {
  it('should add a user on /testSignup POST', function(done){
      chai.request(server).post('/testSignup').send({'username':'test','password':'myPassword','firstname':'Joe',
      'lastname':'Wong','email':'cmpt@sfu.ca','birthday':'2001-02-01','gender':'male'})
        .end(function(err,res){
          res.should.have.status(200);
          res.should.be.json;
          res.body[0].username.should.equal('test');
          res.body[0].password.should.equal('myPassword');
          res.body[0].firstname.should.equal('Joe');
          res.body[0].lastname.should.equal('Wong');
          res.body[0].email.should.equal('cmpt@sfu.ca');
          res.body[0].birthday.should.equal('2001-02-01');
          res.body[0].gender.should.equal('male');
          done();
        });
  });
});

describe('Test admin',function() {
  it('should return all users on a /testAdmin GET', function(done){
      chai.request(server).get('/testAdmin').end(function(err,res){
        res.should.have.status(200);
        res.body.should.be.a("object")
        res.body.rows[0].should.have.property('username')
        res.body.rows[0].should.have.property('password')
        res.body.rows[0].should.have.property('firstname')
        res.body.rows[0].should.have.property('lastname')
        res.body.rows[0].should.have.property('birthday')
        res.body.rows[0].should.have.property('adminid')
        res.body.rows[0].should.have.property('uid')
        res.body.rows[0].should.have.property('email')
        done();
      });
    });
});

describe('TMDB_10 test', function() {
  it('should list top 10 rated movies on TMDB on /test_TMDB_10 GET', function(done){
    chai.request(server).get('/test_TMDB_10').end(function(err,res){
      res.should.have.status(200);
      res.should.be.json;
      var num_movies=res.body.length;
      num_movies.should.equal(10);
      res.body[0].should.have.property('title')
      res.body[0].should.have.property('adult')
      res.body[0].should.have.property('backdrop_path')
      res.body[0].should.have.property('genre_ids')
      res.body[0].should.have.property('id')
      res.body[0].should.have.property('original_language')
      res.body[0].should.have.property('original_title')
      res.body[0].should.have.property('overview')
      res.body[0].should.have.property('popularity')
      res.body[0].should.have.property('poster_path')
      res.body[0].should.have.property('release_date')
      res.body[0].should.have.property('video')
      res.body[0].should.have.property('vote_average')
      res.body[0].should.have.property('vote_count')
      done();
    });
  });
    
});

describe('Trending Movies test', function() {
  it('should list 10 Trending movies on TMDB on /testTrending GET', function(done){
    chai.request(server).get('/testTrending').end(function(err,res){
      res.should.have.status(200);
      res.should.be.json;
      var num_movies=res.body.length;
      num_movies.should.equal(10);
      res.body[0].should.have.property('title')
      res.body[0].should.have.property('adult')
      res.body[0].should.have.property('backdrop_path')
      res.body[0].should.have.property('genre_ids')
      res.body[0].should.have.property('id')
      res.body[0].should.have.property('original_language')
      res.body[0].should.have.property('original_title')
      res.body[0].should.have.property('overview')
      res.body[0].should.have.property('popularity')
      res.body[0].should.have.property('poster_path')
      res.body[0].should.have.property('release_date')
      res.body[0].should.have.property('video')
      res.body[0].should.have.property('vote_average')
      res.body[0].should.have.property('vote_count')
      done();
    });
  });
});

describe('Upcoming Movies test', function() {
  it('should list 10 upcoming movies on TMDB on /testUpcoming GET', function(done){
    chai.request(server).get('/testUpcoming').end(function(err,res){
      res.should.have.status(200);
      res.should.be.json;
      var num_movies=res.body.length;
      num_movies.should.equal(10);
      res.body[0].should.have.property('title')
      res.body[0].should.have.property('adult')
      res.body[0].should.have.property('backdrop_path')
      res.body[0].should.have.property('genre_ids')
      res.body[0].should.have.property('id')
      res.body[0].should.have.property('original_language')
      res.body[0].should.have.property('original_title')
      res.body[0].should.have.property('overview')
      res.body[0].should.have.property('popularity')
      res.body[0].should.have.property('poster_path')
      res.body[0].should.have.property('release_date')
      res.body[0].should.have.property('video')
      res.body[0].should.have.property('vote_average')
      res.body[0].should.have.property('vote_count')
      done();
    });
  });
    
});


describe('CanFindMovietest', function() {
    it('should give a movie with the correct TMDB id on /test_movieIdSuccess GET', function(done){
        chai.request(server).get('/test_movieIdSuccess').end(function(err,res){
          res.should.have.status(200);
          res.body.should.be.a("object")
          res.body.should.have.property('title')
          res.body.should.have.property('adult')
          res.body.should.have.property('backdrop_path')
          res.body.should.have.property('genres')
          res.body.should.have.property('id')
          res.body.should.have.property('original_language')
          res.body.should.have.property('original_title')
          res.body.should.have.property('overview')
          res.body.should.have.property('popularity')
          res.body.should.have.property('poster_path')
          res.body.should.have.property('release_date')
          res.body.should.have.property('video')
          res.body.should.have.property('vote_average')
          res.body.should.have.property('vote_count')
          done();
        });
      });
});

describe('CanNotFindMovie', function() {
    it('should not give a movie with the correct TMDB id on /test_movieIdSuccess GET as it does not exist', function(done){
        chai.request(server).get('/test_movieIdFail').end(function(err,res){
          res.body.should.be.a("object")
          done();
        });
      });
});

describe('Similar Movies', function() {
  it('should list 9 similar movies from TMDB on /testSimilar GET', function(done){
    chai.request(server).get('/testSimilar').end(function(err,res){
      res.should.have.status(200);
      res.should.be.json;
      var num_movies=res.body.length;
      num_movies.should.equal(9);
      res.body[0].should.have.property('title')
      res.body[0].should.have.property('adult')
      res.body[0].should.have.property('backdrop_path')
      res.body[0].should.have.property('genre_ids')
      res.body[0].should.have.property('id')
      res.body[0].should.have.property('original_language')
      res.body[0].should.have.property('original_title')
      res.body[0].should.have.property('overview')
      res.body[0].should.have.property('popularity')
      res.body[0].should.have.property('poster_path')
      res.body[0].should.have.property('release_date')
      res.body[0].should.have.property('video')
      res.body[0].should.have.property('vote_average')
      res.body[0].should.have.property('vote_count')
      done(); 
    });
  });
});

describe('Search Spider-Man', function() {
  it('should list serach results of spiderman on /testSearchSpider-Man GET', function(done){
    chai.request(server).get('/testSearchSpider-Man').end(function(err,res){
      res.should.have.status(200);
      res.should.be.json;
      var num_movies=res.body.length;
      num_movies.should.equal(20);
      res.body[0].title.match('(Spider-man)')
      res.body[0].should.have.property('title')
      res.body[0].should.have.property('adult')
      res.body[0].should.have.property('backdrop_path')
      res.body[0].should.have.property('genre_ids')
      res.body[0].should.have.property('id')
      res.body[0].should.have.property('original_language')
      res.body[0].should.have.property('original_title')
      res.body[0].should.have.property('overview')
      res.body[0].should.have.property('popularity')
      res.body[0].should.have.property('poster_path')
      res.body[0].should.have.property('release_date')
      res.body[0].should.have.property('video')
      res.body[0].should.have.property('vote_average')
      res.body[0].should.have.property('vote_count')
      done(); 
    });
  });
});



 
