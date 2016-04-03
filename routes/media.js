var express = require('express');
var dir = require('node-dir');
var router = express.Router();
var gm = require('gm');
var common = require('../common');

// get list of all image filenames
router.get('/filenames', function(req, res, next) {
  var db = req.db;
  var collection = db.get('chronoshot');
  collection.find(  {},
                    { fields : { thumbnail:0 }, sort: {datetime: 1} },
                    function(e, dbResult) {
                      res.send(dbResult);
                    });
});

// get single thumbnail image
router.get('/thumbnail/:id', function(req, res, next) {
  
  var db = req.db;
  var collection = db.get('chronoshot');

  collection.find(  { _id: req.params.id },
                    { fields : { thumbnail:1 } },
                    function(e, dbResult) {
                      if (dbResult[0] === undefined || dbResult[0].thumbnail === null) {
                        console.log('_id ' + req.params.id + ' not found.');
                      }
                      else {
                        res.writeHead(200, {'Content-Type': 'image/jpg' });
                        res.end(dbResult[0].thumbnail.buffer, 'binary');
                      }
                    }
   );
});

// get single original size image
router.get('/original/:id', function(req, res, next) {
  
  var db = req.db;
  var collection = db.get('chronoshot');

  collection.find(  { _id: req.params.id },
                    { fields : { filename:1 } },
                    function(e, dbResult) {
                      if (dbResult[0] === undefined || dbResult[0].thumbnail === null) {
                        console.log('_id ' + req.params.id + ' not found.');
                      }
                      else {
                        gm(dbResult[0].filename)
                        .autoOrient()
                        .toBuffer(function (err, buffer) {
                            res.writeHead(200, {'Content-Type': 'image/jpg' });
                            res.end(buffer, 'binary');
                        });
                        
                        // // A bit faster, but not auto-oriented.
                        // var img = fs.readFileSync(dbResult[0].filename);
                        // res.writeHead(200, {'Content-Type': 'image/jpg' });
                        // res.end(img, 'binary');
                      }
                    }
   );
});

router.post('/updatethumbnails', function(req, res) {

  var db = req.db;
  var collection = db.get('chronoshot');
  collection.index( {datetime: 1} );
  collection.index( {filename: 1} );

//dir.files('/home/vin/code/photos', function(err, files) {
dir.files('/media/data/photos', function(err, files) {
    if (err) throw err;
    console.log(files);

    files.forEach(function(filePath) {
        if (filePath.indexOf('.JPG') > -1) {
            common.EnqueueImageImport({filePath: filePath, db: req.db}, function (err) {
                if (err) throw err;
            });
        }
    });
   
  });
});

module.exports = router;

