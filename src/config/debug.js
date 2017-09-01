import debugModule from 'debug';

// Set debug namespace for our app
// https://github.com/visionmedia/debug/issues/117
const debugApp = debugModule('app');
const debugMongo = debugModule('mongo');
const debugRedis = debugModule('redis');
const debugRoute = debugModule('route');

export { debugApp, debugMongo, debugRedis, debugRoute };
