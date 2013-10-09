// Dependency Injection - MIT License - Copyright (c) 2013 Roland Poulter

(function () {

	var main = global || window || this,
	    conflict = main.dependency;


	// Create main dependency injection container.

	main.dependency = dependency(exports || {}, main);


	// Fix conflicts with the global object.

	main.dependency.noConflict = function () {

		main.dependency = conflict;

		return this;

	};


	// Prevent the global object from being used as the namespace.

	main.dependency.noPollute = function (namespace) {

		this.namespace = namespace || {};

	};


	function dependency (exports, namespace) {

		"use strict";


		// References

		exports.namespace = namespace || {};


		// API

		exports.arguments_names = arguments_names;

		exports.assign = assign;

		exports.create = create;

		exports.find = find;

		exports.freeze = freeze;

		exports.get = get;

		exports.inject = inject;

		exports.injection = injection;

		exports.register = register;

		exports.wrap = wrap;

		exports.unassign = unassign;


		return exports;


		// Implementations


		function create (exports, namespace) {

			// Create a new dependency injection container.

			return dependency(exports, namespace);

		}


		function register (named_object, namespace) {

			// Automatically assign an object with a name to a namespace.

			return assign(named_object.name, named_object, namespace);

		}


		function assign (name, value, namespace) {

			// Define a value by a name to a namespace.

			namespace = namespace || exports.namespace;


			return namespace[name] = value;

		}


		function unassign (name, namespace) {

			// Un-define a value by its name to a namespace.

			assign(name, undefined, namespace);

		}


		function get (name, namespace) {

			// Retrieve a value by its name, from a namespace.

			return (namespace || exports.namespace)[name];

		}


		function find (names, namespace, context, args) {

			// Lookup a list of names, assign them to a context, and map them to
			// an arguments array in the same order they appeared from the names list.


			namespace = namespace || exports.namespace;


			// Ensure the array is an array, and not a raw arguments list.

			if (args) {
				args = Array.prototype.slice.call(args, 0);
			}


			names.forEach(function (name, index) {

				// Some names may not be defined in the namespace. Those should be skipped.

				if (namespace[name] !== undefined) {
					// When a context exists and it has no value assigned to name, then
					// assign the dependency.

					if (context && context[name] === undefined) {
						context[name] = namespace[name];
					}

					// Just like with context only we use the index of the name, to assign
					// the dependency to an arguments array, but only if it is undefined.

					if (args && args[index] === undefined) {
						args[index] = namespace[name];
					}
				}

			});


			return args;

		}


		function freeze (namespace) {

			// Freezes a namespace. Dependencies cannot be changed once a namespace is frozen.

			Object.freeze(namespace || exports.namespace);

		}


		function inject (callable, namespace, context, args) {

			// Call a function with injected dependencies.


			namespace = namespace || exports.namespace;


			// Callable functions with names are assumed to be class constructors.
			// The context should not be undefined if this is the case, because then
			// the global object will be used as the context, which is okay if the
			// callable function is anonymous.

			if (context === undefined && callable.name) {
				context = Object.create(callable.prototype);
			}


			// Discover dependencies based on the arguments of the callable function.
			// So that dependencies can be extracted from the namespace.

			var names = arguments_names(callable);

			// Finds values of names inside of a namespace and maps them to
			// an args array, but only for undefined arguments in args. This will also
			// assign the dependencies to the context by the same name from namespace.

			args = exports.find(names, namespace, context, args);


			return callable.apply(context, args);

		}


		function injection (callable, namespace) {

			// Wraps a callable function so it automatically injects dependencies.

			var wrapper = wrap(callable, namespace);

			// Assign the callable function to the namespace, but only if it has a name.
			// This is for convenience.

			if (callable.name) assign(callable.name, wrapper, namespace);


			return wrapper;

		}


		function wrap (callable, namespace) {

			namespace = namespace || exports.namespace;


			// Create a named function with the same name as the callable function.
			// Eval is used because there is no way to create a name function without
			// using a literal. The wrapper calls the original with dependencies injected.

			var wrapper = eval(
				'(function ' + callable.name + ' () {\n' +
				'\treturn inject(callable, namespace, this, arguments);\n' +
				'})'
			);


			// Preserve the callable function's prototype. But overload the constructor with the wrapper.
			// This makes the wrapped function work essentially the same as the original.

			wrapper.prototype = Object.create(callable.prototype, {
				constructor: {value: wrapper}
			});


			// Provide a reference to the original callable function. Just in case
			// it may be needed.

			Object.defineProperty(wrapper, 'original', {value: callable});


			return wrapper;

		}

	}


	function arguments_names (callable) {

		// Parse argument names from a callable function source string.

		"use strict";


		// Extracts only the arguments portion of a callable function's source.
		// So that it can be transformed into a array of names.

		var source = callable.toString(),

		    first_left_parentheses = source.indexOf('('),
		    first_right_parentheses = source.indexOf(')'),

		    names = source.substring(first_left_parentheses + 1, first_right_parentheses);


		// Filter out comments and extra whitespace. So that a clean list of
		// names is returned.

		names = names.replace(/\/\*(.|[\r\n])*?\*\//g, ''); // Remove block comments.
		names = names.replace(/\/\/[^\n\r]*[\n\r]/g, '');   // Remove inline comments.
		names = names.replace(/[\s\r\n]+/g, '');            // Remove extra whitespace.


		return names.split(',');

	}

})();
