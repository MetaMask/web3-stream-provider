const ProviderEngine = require('web3-provider-engine')
const StreamSubprovider = require('./stream-subprovider')
const inherits = require('inherits')

module.exports = StreamProvider


function StreamProvider(){
  const engine = new ProviderEngine()

  const streamSubprovider = new StreamSubprovider()
  engine.addProvider(streamSubprovider)

  // start polling
  engine.start()

  return engine
}

