#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

function fibonacci(n) {
  if (n === 0 || n === 1) return n
  else return fibonacci(n - 1) + fibonacci(n - 2)
}

Amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    var message, fibonacciBase, queue = 'rpc_queue'

    ch.assertQueue(queue, { durable: false })
    ch.prefetch(1)
    console.log('[x] Awaiting RPC requests')
    ch.consume(queue, (msg) => {
      message = parseInt(msg.content.toString())
      fibonacciBase = fibonacci(message)

      console.log(' [.] fib(%d)', message)
      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(fibonacciBase.toString()),
        { correlationId: msg.properties.correlationId })

      ch.ack(msg)
    })
  })
})
