#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

function sendingToQueue(err, ch) {
  var q = 'hello'

  ch.assertQueue(q, { durable: false })
  ch.sendToQueue(q, new Buffer('Hello World!'))
  console.log(' [x] Sent Hello World')
}

Amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(sendingToQueue)
  setTimeout(function () {
    conn.close()
    process.exit(0)
  }, 500)
})

