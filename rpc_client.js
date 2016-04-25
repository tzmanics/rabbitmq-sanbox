#!/usr/bin/env node

const Amqp = require('amqplib/callback_api')

var args = process.argv.slice(2)

if (args.length === 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

Amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    ch.assertQueue('', { exclusive: true }, (err,q) => {
      var corrId, argsNumber
      corr = generateUuid()
      argsNumber = parseInt(args[0])

      console.log(' [x] Requesting fib(%d)', argsNumber)

      ch.consume(q.queue, (msg) => {
        if (msg.properties.correlationId === corr) {
          console.log('[.] Got %s', msg.content.toString())
          setTimeout(() => {
            conn.close()
            process.exit(0)
          }, 500)
        }
      }, { noAck: true })

      ch.sendToQueue(
        'rpc_queue',
        new Buffer(argsNumber.toString()),
        { correlationId: corrId, replyTo: q.queue }
      )
    })
  })
})

function generateUuid() {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
}
