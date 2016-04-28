#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

Amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var q = 'hello'

    ch.assertQueue(q, { durable: false })
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q)
    ch.consume(q, msg => console.log('[x] Received %s', msg.content.toString()),
      { noAck: true }
    )
  })
})

