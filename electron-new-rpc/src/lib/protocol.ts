
import * as utils from './utils'
import CONST from './const'

import GlobalStore from './store'
import {EventEmitter} from 'events'
//import { BrowserWindow, ipcMain, ipcRenderer } from 'electron';

class Protocol extends EventEmitter {

  private static instance: Protocol;
  serviceMap: any;
  requestMap: any;

  private  constructor() {
    super()
    this.serviceMap = {}
    this.requestMap = {}
    this.init()
  }

  static getInstance() {
    if (!Protocol.instance) {
      Protocol.instance = new Protocol();
    }
    return Protocol.instance
  }

  private init() {

    this.on(CONST.REQUEST_MSG,(request) => {
      const service = this.serviceMap[request.serviceName]
      console.log(service)
      service.handleRequest(request)
      
    })

    this.on(CONST.RESPONSE_MSG,(response) => {
      console.log(response)
      const ins = this.requestMap[response.request.id]
      clearTimeout(ins.timer)
      delete this.requestMap[response.request.id]
      ins.resolve(response)
    })

    if(utils.isRenderer()) {
      utils.getIPC().on(CONST.RPC_MSG , (data:any) => {
        this.dispatch(data)
      })
    } else {
      utils.getIPC().on(CONST.RPC_MSG , (data:any) => {
        this.dispatch(data)
      })
    }

  }
  
  register(serviceName:string,ins:any) {
    this.serviceMap[serviceName] = ins 
  }

  unregister(serviceName:string) {
    this.serviceMap[serviceName] = null 
  }

  isRequest(data:any) {
    console.log(data)
    return data.type == CONST.REQUEST_TYPE
  }

  isResponse(data:any) {
    return data.type == CONST.RESPONSE_TYPE
  }


  getHostId(hostname:string) : number {
    return GlobalStore.get(hostname)
  }
  setHostId(hostname:string,hostId:any){
    GlobalStore.set(hostname,hostId)
  }

  dispatch(data:any) {

    try {
      const currentHost = utils.currentHost()

      if(data.host == currentHost) { 
        if(this.isRequest(data)) {
          return this.emit(CONST.REQUEST_MSG,data)
        } else {
          return this.emit(CONST.RESPONSE_MSG,data)
        }
        
      } else {
        const hostId = this.getHostId(data.host)

        if(!hostId) {
          return 
        }

        if(utils.isRenderer()) { //渲染进程
          return utils.getSender(0)?.send(CONST.RPC_MSG,data)
        } else { // 主进程
          
          return utils.getSender(hostId)?.send(CONST.RPC_MSG,data)
        }
    }
    }catch(e) {
      console.log(e)
    }
    
    
  }
  
}


export default Protocol