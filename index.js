const ProviderEngine = require('web3-provider-engine')
const StreamSubprovider = require('./stream-subprovider')
const inherits = require('inherits')

inherits(StreamProvider, ProviderEngine)

function StreamProvider () {
  ProviderEngine.call(this)

  const streamSubprovider = this.stream = new StreamSubprovider()
  this.addProvider(streamSubprovider)
  this.start()
}


module.exports = StreamProvider

