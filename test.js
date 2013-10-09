var assert = require('assert');

require('./index');

App = dependency.injection(App);

function App (config, lalafoofoo) {}

App.prototype.isApp = true;

var config = {};

dependency.assign('config', config);

var lalafoofoo = {name: 'lalafoofoo'};

dependency.register(lalafoofoo);

var app = new App();

assert(app.isApp);
assert(app.config === config);
assert(app.lalafoofoo === lalafoofoo);

var app2 = new App(null, null);

assert(app2.isApp);
assert(app2.config === null);
assert(app2.lalafoofoo === null);

console.log('ok');
process.exit(0);
