#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')


Amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel( (err, ch) => {
    var ex, args, key, msg
    ex = 'topic_logs'
    args = process.argv.slice(2)
    key = args.length > 0 ? args[0] : 'anonymous.info'
    msg = args.slice(1).join(' ') || 'Hi Toshi!'

    ch.assertExchange(ex, 'topic', { durable: false })
    ch.publish(ex, key, new Buffer(msg))
    console.log('[x] Send %s: "%s"', key, msg)
  })
})

