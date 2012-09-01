function Router(routes) {
  function router(req, res) {
    var i = 0, route, error

    while (route = router.routes[i++]) {
      req.params = req.url.split("?", 1)[0].match(route.pattern)

      if (!req.params) continue

      req.params.shift()
      route = route.methods[req.method] || route.methods["*"]

      if (!route) {
        error = new Error("Method Not Allowed")
        error.statusCode = 405
        router.onerror(error, res)
      }

      else try {
        route.apply(this, arguments)

        if (route.length == 1) res.writeHead(204), res.end()
      }

      catch (error) { router.onerror(error, res) }

      return
    }

    error = new Error("Not Found")
    error.statusCode = 404
    router.onerror(error, res)
  }

  router.routes = []

  router.route = function(route, methods) {
    route = route
      .replace(/[-[\]{}()+?.,\\^$|#\s]/g , "\\$&"    )
      .replace(/:\w+/g                   , "([^\/]+)")
      .replace(/\*\w+/g                  , "(.*?)"   )

    if (typeof methods == "function") methods = {"*": methods}

    router.routes.push({
      pattern: new RegExp("^" + route + "$"),
      methods: methods
    })

    return router
  }

  router.onerror = function(err, res) {
    res.writeHead(err.statusCode || 500, {"Content-Type": "text/plain"})
    res.end(err.message || "Internal Server Error")
  }

  for (var route in routes) router.route(route, routes[route])

  return router
}

if (typeof require == "function" && typeof module != "undefined") {
  module.exports = Router
}
