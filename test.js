var assert = require("assert")
var Router = require("./")

var router = new Router({
  "/": {
    GET: function(req, res) {
      res.writeHead(200)
      res.end("OK")
    }
  },

  "/hello/:name": {
    GET: function(req, res) {
      res.writeHead(200)
      res.end("Hello, " + req.params[0] + ".")
    }
  },

  "/throws":
    function(req) {
      throw new Error
    },

  "/nothrow":
    function(req) {
      // no response
    }
})

router.route("/nomethod", function(req, res) {
  res.writeHead(200)
  res.end("OK")
})

var called = false

router.onrequest(
  {url: "/", method: "GET"},
  {
    writeHead: function(code){ assert.equal(code, 200) },
    end: function(data) {
      assert.equal(data, "OK")
      called = true
    }
  }
)

assert(called)
called = false

router.onrequest(
  {url: "/hello/dude", method: "GET"},
  {
    writeHead: function(code){ assert.equal(code, 200) },
    end: function(data) {
      assert.equal(data, "Hello, dude.")
      called = true
    }
  }
)

assert(called)
called = false

router.onrequest(
  {url: "/", method: "PATCH"},
  {
    writeHead: function(code){ assert.equal(code, 405) },
    end: function(data) {
      assert.equal(data, "Method Not Allowed")
      called = true
    }
  }
)

assert(called)
called = false

router.onrequest(
  {url: "/notfound", method: "GET"},
  {
    writeHead: function(code){ assert.equal(code, 404) },
    end: function(data) {
      assert.equal(data, "Not Found")
      called = true
    }
  }
)

assert(called)
called = false

router.onrequest(
  {url: "/nomethod", method: "PATCH"},
  {
    writeHead: function(code){ assert.equal(code, 200) },
    end: function(data) {
      assert.equal(data, "OK")
      called = true
    }
  }
)

assert(called)
called = false

router.onrequest(
  {url: "/throws", method: "GET"},
  {
    writeHead: function(code){ assert.equal(code, 500) },
    end: function(data) {
      assert.equal(data, "Internal Server Error")
      called = true
    }
  }
)

assert(called)
called = false

router.onrequest(
  {url: "/nothrow", method: "GET"},
  {
    writeHead: function(code){ assert.equal(code, 204) },
    end: function() {
      assert.equal(arguments.length, 0)
      called = true
    }
  }
)

assert(called)
