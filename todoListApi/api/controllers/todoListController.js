'use strict';


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Alex1730:Alex1730.@cluster0-k7juy.gcp.mongodb.net/test?retryWrites=true"

exports.list_all_tasks = function(req, res) {
  console.log("movies");
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("movies").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log("Since");
      console.log(result);
      res.send(result);
      db.close();
    });
  });
};
/*
var mongoose = require('mongoose'),
  Task = mongoose.model('Tasks');

exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
*/



exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_a_task = function(req, res) {


  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
