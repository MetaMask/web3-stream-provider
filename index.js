
const Duplex = require('readable-stream').Duplex
const inherits = require('util').inherits
const uuid = require('uuid/v4')

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

  // remap id to prevent duplicates
  const originalId = payload.id
  const id = uuid()
  payload.id = id

  // handle batch requests
  if (Array.isArray(payload)) {
    // short circuit for empty batch requests
    if (payload.length === 0){
      return callback(null, [])
    }
  }

  // store request details
  this._payloads[id] = [callback, originalId]

  this.push(payload)
}

StreamProvider.prototype.isConnected = function(){
  return true
}

// private

StreamProvider.prototype._onResponse = function(response){

  const id = response.id

  const data = this._payloads[id]
  if (!data) throw new Error(
    `StreamProvider - Unknown response id for response: ${response}`
  )

  delete this._payloads[id]
  const callback = data[0]
  response.id = data[1] // restore original id

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

function noop(){}
