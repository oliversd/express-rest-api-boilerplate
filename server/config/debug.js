import debugModule from 'debug';

// Set debug namespace for our app
// https://github.com/visionmedia/debug/issues/117
const debugApp = debugModule('app');
const debugDb = debugModule('mongoDb');

export { debugApp, debugDb };
