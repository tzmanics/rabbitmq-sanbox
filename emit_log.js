#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

function sendingToQueue(err, ch) {
  var ex = 'logs'
  var msg = process.argv.slice(2).join(' ') || 'Hi Toshi!'

  ch.assertExchange(ex, 'fanout', { durable: false })
  ch.publish(ex, '', new Buffer(msg))
  console.log(' [x] Sent %s', msg)
}

Amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(sendingToQueue)
  setTimeout(function () {
    conn.close()
    process.exit(0)
  }, 500)
})

