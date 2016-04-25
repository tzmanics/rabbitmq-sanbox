#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

Amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var ex, args, msg, severity

    ex = 'direct_logs'
    args = process.argv.slice(2)
    msg = args.slice(1).join(' ') || 'Hiya Tosh!'
    severity = args.length > 0 ? args[0] : 'info'

    ch.assertExchange(ex, 'direct', { durable: false })
    ch.publish(ex, severity, new Buffer(JSON.stringify(msg)))
    console.log(' [x] Sent %s: "%s"', severity, msg)
  })

  setTimeout(function() {
    conn.close()
    process.exit(0)
  }, 500)
})
