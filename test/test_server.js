var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should(); 

chai.use(chaiHttp);  

describe('TMDB_10 test', function() {
    it('should list top 10 rated movies on TMDB on /test_TMDB_10 GET', function(done){
        chai.request(server).get('/test_TMDB_10').end(function(err,res){
          res.should.have.status(200);
          res.should.be.json;
          var num_movies=res.body.length;
          num_movies.should.equal(10);
          done();
        });
      });
    
});

describe('CanFindMovietest', function() {
    it('should give a movie with the correct TMDB id on /test_movieIdSuccess GET', function(done){
        chai.request(server).get('/test_movieIdSuccess').end(function(err,res){
          res.should.have.status(200);
          res.body.should.be.a("object")
          done();
        });
      });
});

describe('CanFindMovieFail', function() {
    it('should not give a movie with the correct TMDB id on /test_movieIdSuccess GET as it does not exist', function(done){
        chai.request(server).get('/test_movieIdFail').end(function(err,res){
          res.should.have.status(200);
          res.body.should.be.a("object")
          done();
        });
      });
});