const ProviderEngine = require('web3-provider-engine')
const StreamSubprovider = require('./stream-subprovider')

module.exports = StreamProvider


inherits(StreamProvider, Duplex)

function StreamProvider(){
  const engine = new ProviderEngine()

  const streamSubprovider = new StreamSubprovider()
  engine.addProvider(streamSubprovider)

  // start polling
  engine.start()

  return engine
}

