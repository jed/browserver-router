browserver-router
=================

[![Build Status](https://secure.travis-ci.org/jed/browserver-router.png?branch=master)](http://travis-ci.org/jed/browserver-router)

This is a simple and unambitious router implementation that can be used in either the browser or any CommonJS environment. It was designed for [browserver](http://browserver.org), but will work with any server that conforms to the [node.js](http://nodejs.org) `http.Server` API.

Features
--------

- **Small**: 548 minizipped bytes of dependency-free code
- **Portable**: works in the browser and on node.js
- **Easy**: response is automatically generated if omitted

Example
-------

### In node.js

```javascript
var Router = require("router")

var router = Router({
  "/salutation/:name": {
    GET: function(req, res) {
      res.writeHead(200)
      res.end("Hello, " + req.params[0] + ".")
    },

    DELETE: function(req, res) {
      res.writeHead(200)
      res.end("Goodbye, " + req.params[0] + ".")
    },

    "*": function(req) {
      throw new Error("No such salutation")
    }
  },

  "/method": function(req, res) {
    res.writeHead(200)
    res.end("Matched method: " + req.method)
  }
})

var http = require("http")
var server = http.createServer(router)

server.listen(8000)
```

### In the browser with [browserver](http://browserver.org) and [engine.io](https://github.com/LearnBoost/engine.io)

```javascript
var router = Router({
  "/salutation/:name": {
    GET: function(req, res) {
      res.writeHead(200)
      res.end("Hello, " + req.params[0] + ".")
    },

    DELETE: function(req, res) {
      res.writeHead(200)
      res.end("Goodbye, " + req.params[0] + ".")
    },

    "*": function(req) {
      throw new Error("No such salutation")
    }
  },

  "/method": function(req, res) {
    res.writeHead(200)
    res.end("Matched method: " + req.method)
  }
})

var server = http.createServer(router)
var ws = new eio.Socket({host: "myserver.com"})

server.listen(ws)
```

API
---

### router = new Router([Object routes])

Creates a new router, which is a function with the standard `(req, res)` signature. If a `routes` object is passed, it will `.route(key, value)` will be called for each key.

```javascript
var router = Router({
  "/": {
    GET: function(req, res) {
      res.writeHead(200)
      res.end("OK")
    }
  }
})
```

### router.route([String route], [Object methodMap])

Adds a route to match. Both arguments are required.

```javascript
router.route("/salutation/:name", {
  GET: function(req, res) {
    res.writeHead(200)
    res.end("Hello, " + req.params[0] + ".")
  },

  DELETE: function(req, res) {
    res.writeHead(200)
    res.end("Goodbye, " + req.params[0] + ".")
  }
})
```

The `route` string is compiled into a regular expression, using the same logic as the [Backbone.js router](http://backbonejs.org/#Router-route), in which `:param` strings match a single url component between slashes and `*` splats match any number of url components. Any matching parameters are used to populate the `req.params` array by match position.

The `methodMap` object maps method names (such as `GET` and `POST`) to handlers.
A fallback handler that matches all routes can be specified using `*` as the method name.

Handlers can either use the standard `function(req, res){}` signature, or a `function(req){}` signature with the response omitted, in which the response is automatically generated like this:

```javascript
router.route("/random-error", function(req) {
  var ok = Math.random() > .5

  if (!ok) {
    // equivalent to
    // res.writeHead(500, {"Content-Type": "text/plain"})
    // res.end("An error occurred")
    throw new Error("An error occurred")
  }

  else {
    // equivalent to
    // res.writeHead(204)
    // res.end()
    return
  }
})
```

### router.route([String route], [Function handler])

A convenient shortcut for `router.route(route, {"*": handler})`, to fire on any otherwise unhandled method.
