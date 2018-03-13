require('log-timestamp')(function () { return '[' + new Date().toLocaleString() + ']' + ' %s' })
require('./server')

