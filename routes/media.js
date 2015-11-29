var express = require('express');
var gm = require('gm');
var dir = require('node-dir');
var async = require('async');
var router = express.Router();
var ExifImage = require('exif').ExifImage;

// get list of all image filenames
router.get('/filenames', function(req, res, next) {
  var db = req.db;
  var collection = db.get('chronoshot');
  collection.find(  {},
                    { fields : { thumbnail:0 }, sort: {datetime: 1} }
                    ,
                    function(e, dbResult) {
                      res.send(dbResult);
                    });
    //).sort({datetime: 1}, function(e, dbResult) {
   //                    res.send(dbResult);
    //                 });
});

// get single image
router.get('/', function(req, res, next) {
  
  // var options = {
  //   //root: __dirname + '/public/',
  //   dotfiles: 'deny',
  //   headers: {
  //       'x-timestamp': Date.now(),
  //       'x-sent': true,
  //   }
  // };
  
  var db = req.db;
  var collection = db.get('chronoshot');

  collection.find(  { _id: req.query['name'] },
                    { fields : { thumbnail:1 } },
                    function(e, dbResult) {
                      if (dbResult[0] === undefined || dbResult[0].thumbnail === null) {
                        console.log('_id ' + req.query['name'] + ' not found.');
                      }
                      else {
                        res.writeHead(200, {'Content-Type': 'image/jpg' });
                        res.end(dbResult[0].thumbnail.buffer, 'binary');
                      }
                    }
   );
});

// /*
//  * POST to adduser.
//  */
// router.post('/adduser', function(req, res) {
//   var db = req.db;
//   var collection = db.get('chronoshot');
//   collection.insert(req.body, function(err, result){
//       res.send(
//           (err === null) ? { msg: '' } : { msg: err }
//       );
//   });
// });

router.post('/updatethumbnails', function(req, res) {

  dir.files('/home/vin/code/chronoshot/photos', function(err, files) {
  //dir.files('/home/vin/code/chronoshot/photos/10/18', function(err, files) {

  if (err) throw err;
  console.log(files);

  // We have an array of files now, so now we'll iterate that array.
  files.forEach(function(filePath) {
    if (filePath.indexOf('.JPG') > -1) {
      thumbnailGeneratorQueue.push({filePath: filePath, req: req}, function (err) {
        if (err) throw err;
          console.log('Finished creating thumbnail for ' + filePath);
      });
    }
  });
    
  });
});

module.exports = router;

////////////////////////////////////////////////////////////////////////////////
// BEGIN - Async thumbnail generation stuff.
////////////////////////////////////////////////////////////////////////////////
var maxAsyncThreads = 4;
var thumbnailGeneratorQueue = async.queue(function (task, callback) {
  
  var db = task.req.db;
  
  gm(task.filePath)
  .resize(200, 200)
  .toBuffer(function (err, buffer) {
    if (err) {
      callback(err);
    }
    else {
      
      new ExifImage({ image: task.filePath}, function (error, exifData) {
        if (error) {
          console.log('Exif error: ' + error.message);
        }
        else {
          console.log(exifData.exif.DateTimeOriginal);
          var dateTimeOriginal = exifData.exif.DateTimeOriginal
          //console.log(exifData.image.Orientation);
          
          var collection = db.get('chronoshot');
          collection.insert({"filename": task.filePath, "datetime":dateTimeOriginal, "thumbnail": buffer}, function(err, result) {
            var insertResult = (err === null) ? { msg: 'Inserted ' + task.filePath } : { msg: err };
            console.log(insertResult);
            callback();
          });
        }
      });
      
      
    }
  });

}, maxAsyncThreads);

// assign a callback
thumbnailGeneratorQueue.drain = function() {
  console.log('All thumbnail tasks completed.');
}
////////////////////////////////////////////////////////////////////////////////
// END - Async thumbnail generation stuff.
////////////////////////////////////////////////////////////////////////////////