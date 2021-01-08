
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
      console.log("on Request Event")
      console.log(request)

      const service = this.serviceMap[request.serviceName]
      console.log(this.serviceMap)
      
      console.log(service)
      service.handleRequest(request)
      
    })

    this.on(CONST.RESPONSE_MSG,(response) => {
      console.log("on Response Event")
      console.log(response)
      const ins = this.requestMap[response.request.id]
      clearTimeout(ins.timer)
      delete this.requestMap[response.request.id]
      ins.resolve(response)
    })

    if(utils.isRenderer()) {
      console.error("in render ipc on ...")
      utils.getIPC().on(CONST.RPC_MSG , (_,data:any) => {
       
        console.log(data)
        this.dispatch(data)
      })

      const hostId = require('electron').remote.getCurrentWindow().id
      this.setHostId(utils.currentHost(),hostId)

    } else {
      utils.getIPC().on(CONST.RPC_MSG , (_,data:any) => {
        console.log("in main ipc on ...")
        console.log(data)
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
      console.log(currentHost)
      console.log(data.host)

      if(data.host == currentHost) { 
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        if(this.isRequest(data)) {
          return this.emit(CONST.REQUEST_MSG,data)
        } else {
          return this.emit(CONST.RESPONSE_MSG,data)
        }
        
      } else {
        const hostId = this.getHostId(data.host)

        console.log(hostId)

        if(!hostId) {
          console.log("cannot find hostid")
          return 
        }

        if(utils.isRenderer()) { //渲染进程
         
          return utils.getSender(0)?.send(CONST.RPC_MSG,data)
        } else { // 主进程
          console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
          console.log(hostId)
          return utils.getSender(hostId)?.send(CONST.RPC_MSG,data)
        }
    }
    }catch(e) {
      console.log(e)
    }
    
    
  }
  
}


export default Protocol