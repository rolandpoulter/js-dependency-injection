# JavaScript Dependency Injection

An inversion of control implementation for any JavaScript environment.

```javascript
require('injendency').noPollute();

App = dependency.injection(App);

function App (config, lalafoofoo) {}

var config = {};

dependency.assign('config', config);

var lalafoofoo = {name: 'lalafoofoo'};

dependency.register(lalafoofoo);

var app1 = new App();

app1.config === config; // true
app1.lalafoofoo === lalafoofoo; // true

var app2 = new App(null, null);

app2.config === null; // true
app2.lalafoofoo === null; // true
```


# Documentation

See https://github.com/rolandpoulter/js-dependency-injection/blob/master/index.js


# The MIT License

Copyright (c) 2013 Roland Poulter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
