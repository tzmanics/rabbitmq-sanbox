#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

function sendingToQueue(err, ch) {
  var q = 'hello'

  ch.assertQueue(q, { durable: false })
  ch.sendToQueue(q, new Buffer('Hello Poop!'))
  console.log(' [x] Sent Hello Poop')
}

Amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(sendingToQueue)
  setTimeout(function () {
    conn.close()
    process.exit(0)
  }, 500)
})

