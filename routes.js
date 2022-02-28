const routes = require('next-routes')()

routes.add('/campaigns/new','/campaigns/new')
.add('/campaigns/:address','/campaigns/show')
.add('/campaigns/:address/requests','/campaigns/requests/show')
.add('/campaigns/:address/requests/create','/campaigns/requests/create/index')

module.exports = routes;