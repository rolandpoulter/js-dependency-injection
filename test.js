global.assert = require('assert');

require('./index').noPollute();

require('./dependency_test.js');

process.exit(0);
