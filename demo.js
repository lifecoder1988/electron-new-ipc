
import Protocol from './protocol.js'

import Client from './client.js'

import Server from './server.js'

class MyClient extends Client {
  constructor(host,serviceName,protocol) {
    super(host,serviceName,protocol) 

  }
  hello() {
    return this.call("hello")
  }
}

class MyService extends Server {
  constructor(host,serviceName,protocol) {
    super(host,serviceName,protocol)
  }
  hello() {
    return "hello world"
  }
}

const protocol = new Protocol()

protocol.init()

const host = "www.baidu.com"

const serviceName = "MyService"

const s = new MyService(host,serviceName,protocol)

s.startup()



const c = new MyClient(host,serviceName,protocol)

c.hello()
.then(data => {
  console.log(data)
  console.log("***********************************")
})

/*


特性 

  1. 业务不用关心是否在render 还是 main 进程 
  2. 不仅支持electron 环境 ， 也支持 node ， 普通brower环境（TO DO）
  3. rpc safe 各种exception 能轻松捕获
  4. 详细的日志 
  5. rpc有最大超时时间 默认是3秒

限制 
  1. 每个进程只能有且只有一个protocol 实例
  2. 主进程
    调用protocol init 
  3. 渲染进程
    调用 preload内调用protocol.setHostId
  
在 electron 环境中的使用 


-------------- electron main


const protocol = new Protocol()

protocol.init()

win = new BrowerWindow()
protocal.setHostId('www.baidu.com',win.id)
win.injectEnv("hostname=XXX") 每个进程都要注入 host ， 通过utils.getHost 可以获取到 形式如 www.baidu.com  

--------------------- client ever --------------------

const protocol = new Protocol()

protocol.init()

const c = new MyClient(host,serviceName,protocol)

c.hello()
.then(data => {
  console.log(data)
  console.log("***********************************")
})


---------------------- server ever ---------------------------- 

const protocol = new Protocol()

protocol.init()

const host = "www.baidu.com"

const serviceName = "MyService"

const s = new MyService(host,serviceName,protocol)

s.startup()


*/