/*
var monq = require('monq');
var client = monq('mongodb://localhost:27017/monq_example');

var queue = client.queue('example');

queue.enqueue('reverse', { text: 'foobar' }, function (err, job) {
  console.log('enqueued:', job.data);
});

var worker = client.worker(['example']);

worker.register({
  reverse: function (params, callback) {
    try {
      var reversed = params.text.split('').reverse().join('');
      callback(null, reversed);
    } catch (err) {
      callback(err);
    }
  }
});

worker.start();*/
