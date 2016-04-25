#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

Amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var ex = 'logs'

    ch.assertExchange(ex, 'fanout', { durable: false })
    ch.assertQueue('', { exclusive: true }, function (err, q) {
      console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue)
      ch.bindQueue(q.queue, ex, '')

      ch.consume(q.queue, function (msg) {
        console.log(' [x] Received %s', msg.content.toString())
      }, { noAck: false })
    })
  })
})

