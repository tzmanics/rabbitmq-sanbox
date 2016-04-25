#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

function sendingToQueue(err, ch) {
  var q = 'task_queue'
  var msg = process.argv.slice(2).join(' ') || 'Hi Toshi!'

  ch.assertQueue(q, { durable: true })
  ch.sendToQueue(q, new Buffer(msg), { persistent: true })
  console.log(' [x] Sent %s', msg)
}

Amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(sendingToQueue)
  setTimeout(function () {
    conn.close()
    process.exit(0)
  }, 500)
})

