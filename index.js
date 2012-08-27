function Router(routes) {
  var routeList = this.routes = []

  for (var route in routes) this.route(route, routes[route])

  this.onrequest = function(req, res) {
    var i = 0
    var route

    while (route = routeList[i++]) {
      req.params = req.url.match(route.pattern)

      if (!req.params) continue

      req.params.shift()

      route = route.methods[req.method]

      if (route) return route.apply(this, arguments)

      res.writeHead(405, {"Content-Type": "text/plain"})
      res.end("Method not allowed")

      return
    }

    res.writeHead(404, {"Content-Type": "text/plain"})
    res.end("Not found")
  }
}

// Same route string definitions patterns as Backbone.js
// http://backbonejs.org/docs/backbone.html#section-116
Router.prototype.route = function(route, methods) {
  route = route
    .replace(/:\w+/g                   , "\\$&"    )
    .replace(/\*\w+/g                  , "([^\/]+)")
    .replace(/[-[\]{}()+?.,\\^$|#\s]/g , "(.*?)"   )

  this.routes.push({
    pattern: new RegExp("^" + route + "$"),
    methods: methods
  })

  return this
}

if (typeof require == "function" && typeof module != "undefined") {
  module.exports = Router
}
