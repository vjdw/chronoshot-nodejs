var fs = require('fs');
var gm = require('gm');
var async = require('async');
var ExifImage = require('exif').ExifImage;

function Common(){}

////////////////////////////////////////////////////////////////////////////////
// BEGIN - Async thumbnail generation stuff.
////////////////////////////////////////////////////////////////////////////////
var maxAsyncThreads = 4;
var thumbnailGeneratorQueue = async.queue(function (task, callback) {
  
  var db = task.db;
  var collection = db.get('chronoshot');
  
  // Check if filePath exists in database already.
  collection.findOne( {filename : task.filePath},
                      function (err, doc) {
                        if(err) return callback(err);
                        
                        if (doc !== null) {
                            console.log('Found a file, but it\'s already in the database: ' + task.filePath);
                            callback();
                        }
                        else {
                          // filePath not in database, generate thumbnail and add it.
                          gm(task.filePath)
                          .autoOrient()
                          .resize('200', '200', '^')
                          .gravity('Center')
                          .crop('200', '200')
                          .toBuffer(function (err, buffer) {
                            if (err) {
                              callback(err);
                            }
                            else {
                              try {
                                new ExifImage({ image: task.filePath}, function (error, exifData) {
                                  if (error) {
                                    console.log('Exif error: ' + error.message);
                                    callback(error);
                                  }
                                  else {
                                    //console.log(exifData.exif.DateTimeOriginal);
                                    var dateTimeOriginal = exifData.exif.DateTimeOriginal;
                                    
                                    collection.insert({"filename": task.filePath, "datetime":dateTimeOriginal, "thumbnail": buffer}, function(err, result) {
                                      var insertResult = (err === null) ? { msg: 'Inserted ' + task.filePath } : { msg: err };
                                      console.log(insertResult);
                                      callback();
                                    });
                                  }
                                });
                              }
                              catch (err) {
                                console.log('Error: ' + err.message);
                                callback(err);
                              }
                            }
                          });
                        }              
                      });
}, maxAsyncThreads);

// assign a callback
thumbnailGeneratorQueue.drain = function() {
  console.log('All thumbnail tasks completed.');
}

Common.prototype.EnqueueImageImport = function(options, callback) {
    if (options.filePath.indexOf('.JPG') > -1 || options.filePath.indexOf('.jpg') > -1) {
        thumbnailGeneratorQueue.push(options, function (err) {
            if (err) throw err;
        });
    }
    else {
        console.log('Can\'t add file because not JPG: ' + options.filePath);
    }
}
////////////////////////////////////////////////////////////////////////////////
// END - Async thumbnail generation stuff.
////////////////////////////////////////////////////////////////////////////////

module.exports = new Common();