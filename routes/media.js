var express = require('express');
var gm = require('gm');
var dir = require('node-dir');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send(req);
  
  var options = {
    //root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
    }
  };

  //var fileName = '/home/vin/code/chronoshot/photos/09/26/' + req.query['name'] + '.JPG';
  var fileName = '/home/vin/code/chronoshot/photos/10/26/' + req.query['name'] + '.MOV';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });  
  
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
  var db = req.db;
  var collection = db.get('testcollection');
  collection.insert(req.body, function(err, result){
      res.send(
          (err === null) ? { msg: '' } : { msg: err }
      );
  });
});

router.post('/updatethumbnails', function(req, res) {
  dir.files('/home/vin/code/chronoshot/photos/10/04', function(err, files) {
    if (err) throw err;
    console.log(files);
    //we have an array of files now, so now we'll iterate that array
    files.forEach(function(filePath) {
      var db = req.db;
      gm(filePath)
      .resize(120, 120)
      .toBuffer(function (err, buffer) {
        if (err) {
            //next();
        }
        else {
          var collection = db.get('testcollection');
          collection.insert({"filename": filePath, "thumbnail": buffer}, function(err, result) {
            var insertResult = (err === null) ? { msg: 'Inserted ' + filePath } : { msg: err };
            console.log(insertResult);
            }
          );
        }
      });
    });
  });
});

module.exports = router;