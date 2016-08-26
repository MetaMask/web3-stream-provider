const Duplex = require('readable-stream').Duplex
const inherits = require('util').inherits

module.exports = StreamProvider


inherits(StreamProvider, Duplex)

function StreamProvider(){
  Duplex.call(this, {
    objectMode: true,
  })

  this._payloads = {}
}

// public

StreamProvider.prototype.send = function(payload){
  throw new Error('StreamProvider - does not support synchronous RPC calls. called: "'+payload.method+'"')
}

StreamProvider.prototype.sendAsync = function(payload, callback){
  // console.log('StreamProvider - sending payload', payload)
  var id = payload.id
  // handle batch requests
  if (Array.isArray(payload)) {
    // short circuit for empty batch requests
    if (payload.length === 0){
      return callback(null, [])
    }
    id = generateBatchId(payload)
  }
  // store request details
  this._payloads[id] = [payload, callback]
  // console.log('payload for plugin:', payload)
  this.push(payload)
}

StreamProvider.prototype.isConnected = function(){
  return true
}

// private

StreamProvider.prototype._onResponse = function(response){
  // console.log('StreamProvider - got response', payload)
  var id = response.id
  // handle batch requests
  if (Array.isArray(response)) {
    id = generateBatchId(response)
  }
  var data = this._payloads[id]
  if (!data) throw new Error('StreamProvider - Unknown response id')
  delete this._payloads[id]
  var payload = data[0]
  var callback = data[1]

  // logging
  // var res = Array.isArray(response) ? response : [response]
  // ;(Array.isArray(payload) ? payload : [payload]).forEach(function(payload, index){
  //   console.log('plugin response:', payload.id, payload.method, payload.params, '->', res[index].result)
  // })

  // run callback on empty stack,
  // prevent internal stream-handler from catching errors
  setTimeout(function(){
    callback(null, response)
  })
}

// stream plumbing

StreamProvider.prototype._read = noop

StreamProvider.prototype._write = function(msg, encoding, cb){
  this._onResponse(msg)
  cb()
}

// util

function generateBatchId(batchPayload){
  return 'batch:'+batchPayload.map(function(payload){ return payload.id }).join(',')
}

function noop(){}
