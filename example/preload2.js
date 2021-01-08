
//import {client} from '../electron-new-rpc/build/main/index'

const Client = require('../electron-new-rpc/build/main/lib/client').default
const Server = require('../electron-new-rpc/build/main/lib/server').default
const Protocol = require('../electron-new-rpc/build/main/lib/protocol').default


//console.log(Client)
//console.log(Server)
//console.log(Protocol)

process.host = "joewang2-com"

const protocol = Protocol.getInstance()

class HelloClient extends Client {
  
  async hello(a,b) {
    const result = await this.call("hello",a,b)
    console.log(result)
  }
}

const client = new HelloClient("joewang-com","HelloService",protocol)

setTimeout(() => {
  client.hello(1,3)
},3000)



// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

