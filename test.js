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
  }
})

router.route("/nomethod", function(req, res) {
  res.writeHead(200)
  res.end("OK")
})

router.onrequest(
  {url: "/", method: "GET"},
  {
    writeHead: function(code){ assert.equal(code, 200) },
    end: function(data){ assert.equal(data, "OK") }
  }
)

router.onrequest(
  {url: "/hello/dude", method: "GET"},
  {
    writeHead: function(code){ assert.equal(code, 200) },
    end: function(data){ assert.equal(data, "Hello, dude.") }
  }
)

router.onrequest(
  {url: "/", method: "PATCH"},
  {
    writeHead: function(code){ assert.equal(code, 405) },
    end: function(data){ assert.equal(data, "Method not allowed") }
  }
)

router.onrequest(
  {url: "/notfound", method: "GET"},
  {
    writeHead: function(code){ assert.equal(code, 404) },
    end: function(data){ assert.equal(data, "Not found") }
  }
)

router.onrequest(
  {url: "/nomethod", method: "PATCH"},
  {
    writeHead: function(code){ assert.equal(code, 200) },
    end: function(data){ assert.equal(data, "OK") }
  }
)
