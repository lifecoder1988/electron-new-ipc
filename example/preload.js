
//import {client} from '../electron-new-rpc/build/main/index'

const Client = require('../electron-new-rpc/build/main/lib/client').default
const Server = require('../electron-new-rpc/build/main/lib/server').default
const Protocol = require('../electron-new-rpc/build/main/lib/protocol').default


//console.log(Client)
//console.log(Server)
//console.log(Protocol)

class HelloService extends Server {
   hello(a,b) {
     return new Promise((resolve,_) => {
        setTimeout(() => {
          resolve(a+b)
        },1000)
     })
    
  }
}

process.host = "joewang-com"


const protocol = Protocol.getInstance()

const helloService = new HelloService("joewang-com","HelloService",protocol)

helloService.startup()

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', (e) => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

