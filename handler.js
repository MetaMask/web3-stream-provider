
module.exports = handleRequestsFromStream

function handleRequestsFromStream(stream, provider, onRequest, onResponse){
  onRequest = onRequest || noop
  onResponse = onResponse || noop

  stream.on('data', function onRpcRequest(payload){
    onRequest(payload)
    provider.sendAsync(payload, function onPayloadHandled(err, response){
      onResponse(err, payload, response)
      try {
        stream.write(response)
      } catch (err) {
        onResponse(err)
      }
    })
  })
}

// util

function noop(){}
