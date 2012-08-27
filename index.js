function Router(routes) {
  var router = this

  this.routes = []

  for (var route in routes) this.route(route, routes[route])

  this.onrequest = function(req, res) {
    var handler = router[404]

    for (var i = 0, route; route = router.routes[i++];) {
      if (req.params = req.url.match(route.pattern)) {
        handler =
          route.methods[req.method] ||
          route.methods["*"] ||
          router[405]

        req.params.shift()

        break
      }
    }

    handler.apply(this, arguments)
  }
}

// Same route string definitions patterns as Backbone.js
// http://backbonejs.org/#Router-route
Router.prototype.route = function(route, methods) {
  route = route
    .replace(/[-[\]{}()+?.,\\^$|#\s]/g , "\\$&"    )
    .replace(/:\w+/g                   , "([^\/]+)")
    .replace(/\*\w+/g                  , "(.*?)"   )

  if (typeof methods == "function") methods = {"*": methods}

  this.routes.push({
    pattern: new RegExp("^" + route + "$"),
    methods: methods
  })

  return this
}

Router.prototype[404] = function(req, res) {
  res.writeHead(404, {"Content-Type": "text/plain"})
  res.end("Not found")
}

Router.prototype[405] = function(req, res) {
  res.writeHead(405, {"Content-Type": "text/plain"})
  res.end("Method not allowed")
}

if (typeof require == "function" && typeof module != "undefined") {
  module.exports = Router
}
