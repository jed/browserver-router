browserver-router
=================

This is a simple and unambitious router implementation that can be used in the browser or any CommonJS environment. It has no dependencies, and weighs in at 462 minizipped bytes. It was designed for [browserver](http://browserver.org), but will work with any server that conforms to the node.js HTTP spec (in which handlers take have a `(req, res)` signature, where `req` has `url` and `method` properties, and `res` has `writeHead` and `end` methods).

Example
-------

```javascript
var router = new Router({
  "/hello/:name": {
    GET: function(req, res) {
      res.writeHead(200)
      res.end("Hello, " + req.params[0] + ".")
    },

    DELETE: function(req, res) {
      res.writeHead(200)
      res.end("Goodbye, " + req.params[0] + ".")
    }
  },

  "/method": function(req, res) {
    res.writeHead(200)
    res.end("Matched method: " + req.method)
  }
})
```

API
---

### router = new Router([Object routes])

Creates a new router. `routes` is optional, and can be an object where each key is a route pattern, and each value is either a route handler function, or object with methods for keys and route handler functions for values.

### router.route([String route], [Function handler])
### router.route([String route], [Object methodMap])

Adds a route to match. Both arguments are required. The `route` string is compiled into a regular expression, using the same logic as the [Backbone.js router](http://backbonejs.org/#Router-route), in which `:param` strings match a single url component between slashes and `*` splats match any number of url components. Any matching parameters are used to populate the `req.params` array by match position.

If a `handler` function is provided, it will be fired when the route is matched, for any request method.

If a `methodMap` object is provided, it will be used to disambiguate between methods of a given route by specifying them as keys, with the handlers for the values.

### router[404] and router[405]

These are where the default handlers lives. Override them to provide your own fallback logic.
