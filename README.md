### web3-stream-provider

Utility for creating an Ethereum web3 provider that forwards payloads through a stream.
Only works for **async** payloads.


For connecting to a remote eth rpc handler
```js
const StreamProvider = require('web3-stream-provider')

var streamProvider = new StreamProvider()
var web3 = new Web3(streamProvider)

streamProvider.pipe(remoteRpcHandler).pipe(streamProvider)
```


For handling incoming rpc payloads
```js
const handleRequestsFromStream = require('web3-stream-provider/handler')

handleRequestsFromStream(remoteStream, provider, logger)

function logger(err, request, response){
  console.log(arguments)
}
```