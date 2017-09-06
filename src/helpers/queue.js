import monq from 'monq';

class Queue {
  consturctor(mongoUri, queueName, functionsObject) {
    this.client = monq(mongoUri);
    this.queue = this.client.queue(queueName);
    this.worker = this.client.worker([queueName]);
    // { jobName: (params, callback) => { ... } }
    this.worker.register(functionsObject);
    this.worker.start();
  }

  enqueueJob(jobName, params, callback) {
    this.queue.enqueue(jobName, params, (err, job) => {
      callback(err, job);
    });
  }
}

export default Queue;
