var express = require('express');
var gm = require('gm');
var dir = require('node-dir');
var router = express.Router();

// get list of all image filenames
router.get('/filenames', function(req, res, next) {
  var db = req.db;
  var collection = db.get('chronoshot');
  collection.find(  {},
                    { fields : { thumbnail:0 } },
                    function(e, dbResult) {
                      res.send(dbResult);
                    }
   );
});

// get single image
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

  // var fileName = '/home/vin/code/chronoshot/photos/10/26/' + req.query['name'] + '.JPG';
  // //var fileName = '/home/vin/code/chronoshot/photos/10/26/' + req.query['name'] + '.MOV';
  // res.sendFile(fileName, options, function (err) {
  //   if (err) {
  //     console.log(err);
  //     res.status(err.status).end();
  //   }
  //   else {
  //     console.log('Sent:', fileName);
  //   }
  // });
  
  var db = req.db;
  var collection = db.get('chronoshot');
  //collection.find(  { filename: '/home/vin/code/chronoshot/photos/10/04/' + req.query['name'] + '.JPG' },
  collection.find(  { _id: req.query['name'] },
                    { fields : { thumbnail:1 } },
                    function(e, dbResult) {
                      if (dbResult[0] === undefined || dbResult[0].thumbnail === null) {
                        console.log('_id ' + req.query['name'] + ' not found.');
                      }
                      else {
                        res.writeHead(200, {'Content-Type': 'image/jpg' });
                        res.end(dbResult[0].thumbnail.buffer, 'binary');
                        //res.end(new Buffer(dbResult[0].thumbnail, 'binary'), 'binary');
                      }
                    }
   );
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
  var db = req.db;
  var collection = db.get('chronoshot');
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

    // We have an array of files now, so now we'll iterate that array.
    files.forEach(function(filePath) {
      var db = req.db;
      gm(filePath)
      .resize(120, 120)
      .toBuffer(function (err, buffer) {
        if (err) {
            //next();
        }
        else {
          var collection = db.get('chronoshot');
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