const Duplex = require('readable-stream').Duplex
const inherits = require('util').inherits

module.exports = StreamHandler

function handleRequestsFromStream(stream, provider, logger){
  logger = logger || noop
  
  stream.on('data', function onRpcRequest(payload){
    provider.sendAsync(payload, function onPayloadHandled(err, response){
      logger(null, payload, response)
      try {
        stream.write(response)
      } catch (err) {
        logger(err)
      }
    })
  })

}


// util

function noop(){}