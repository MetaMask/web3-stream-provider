const Duplex = require('readable-stream').Duplex
const inherits = require('util').inherits

module.exports = StreamHandler


inherits(StreamHandler, Duplex)

function StreamHandler(provider){
  Duplex.call(this, {
    objectMode: true,
  })

  this.provider = provider
}

// private

StreamHandler.prototype._onMessage = function(payload){
  const self = this
  self.provider.sendAsync(payload, function(err, result){
    // convert errors into RPC errors
    if (err) {
      if (Array.isArray(payload)) {
        result = payload.map(convertPayloadToError.bind(null, err))
      } else {
        result = convertPayloadToError(err, payload)
      }
    }
    
    self.push(result)
  })
}

// stream plumbing

StreamHandler.prototype._read = noop

StreamHandler.prototype._write = function(msg, encoding, cb){
  this._onMessage(msg)
  cb()
}

// util

function noop(){}

function convertPayloadToError(err, payload){
  return {
    id: payload.id,
    jsonrpc: payload.jsonrpc,
    error: err.stack,
  }
}