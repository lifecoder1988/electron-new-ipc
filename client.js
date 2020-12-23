


import CONST from './const.js'

import {default as utils} from './utils.js'


class Client {
  constructor(host,serviceName,protocol) {
    this.host = host
    this.serviceName = serviceName
    this.protocol = protocol
  }
 
  call(method,...params) {
    let request = {
      id : utils.UUID(),
      method : method,
      type : CONST.REQUEST_TYPE,
      params : [...params],
      host : this.host,
      clientHost : utils.currentHost(),
      serviceName : this.serviceName ,
      startTimestamp : new Date().getTime()
    }
    console.log(request)
    return new Promise((resolve,reject) => {

      const timer = setTimeout(() => {
         delete this.protocol.requestMap[request.id]
         reject("timeout")
      },3000)

      this.protocol.requestMap[request.id] = {
        resolve:resolve,
        reject:reject ,
        timer : timer
      }
     
      this.protocol.dispatch(request)
      
    })
    
  } 

}

export default Client 