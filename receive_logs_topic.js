#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

var args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Usage: receive_logs_topic.js <facility>.<severity>')
  process.exit(1)
}

Amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    var ex = 'topic_logs'

    ch.assertExchange(ex, 'topic', { durable: false })
    ch.assertQueue('', { exclusive: true }, (err, q) => {
      console.log('[*] Waiting for logs, To exit press CTRL+C')

      args.forEach(key => {
        ch.bindQueue(q.queue, ex, key)
      })

      ch.consume(q.queue, msg => {
        console.log('[x] %s" "%s"', msg.fields.routingKey, msg.content.toString())
      }, { noAck: true })
    })
  })
})

