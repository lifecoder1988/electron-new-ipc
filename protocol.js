
import {default as utils} from './utils.js'
import CONST from './const.js'

import store from './store.js'
import EventEmitter from 'events'
import { BrowserWindow, ipcMain, ipcRenderer } from 'electron';

class Protocol extends EventEmitter {

  constructor() {
    super()
    this.serviceMap = {}
    this.requestMap = {}
  }

  init() {

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

    if(isRenderer()) {
      ipcRenderer.on(CONST.RPC_MSG , (data) => {
        this.dispatch(data)
      })
    } else {
      ipcMain.on(CONST.RPC_MSG , (data) => {
        this.dispatch(data)
      })
    }

  }
  
  register(serviceName,ins) {
    this.serviceMap[serviceName] = ins 
  }

  unregister(serviceName) {
    this.serviceMap[serviceName] = null 
  }

  isRequest(data) {
    console.log(data)
    return data.type == CONST.REQUEST_TYPE
  }

  isResponse(data) {
    return data.type == CONST.RESPONSE_TYPE
  }


  getHostId(hostname) {
    return store.get(hostname)
  }
  setHostId(hostname,hostId){
    store.set(hostname,hostId)
  }

  dispatch(data) {

    try {
      const currentHost = utils.currentHost()

      if(data.host == currentHost) { 
        if(this.isRequest()) {
          return this.emit(CONST.REQUEST_MSG,data)
        } else {
          return this.emit(CONST.RESPONSE_MSG,data)
        }
        
      } else {
        const hostId = this.getHostId(data.host)

        if(!hostId) {
          return 
        }

        if(isRenderer()) { //渲染进程
          return ipcRenderer.send(CONST.RPC_MSG,data)
        } else { // 主进程
          
          return BrowserWindow.fromId(hostId).webContents.send(CONST.RPC_MSG,data)
        }
    }
    }catch(e) {
      console.log(e)
    }
    
    
  }
  
}


export default Protocol