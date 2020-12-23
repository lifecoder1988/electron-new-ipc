import * as CONST  from './const.js'

class Server {

  constructor(host,serviceName,protocol) {
    this.host = host 
    this.serviceName = serviceName
    this.protocol = protocol
  }
  startup() {
    this.protocol.register(this.serviceName,this)
  }
  down() {
    this.protocol.unregister(this.serviceName,this)
  }
  
  handleRequest(request) {

    let result = this[request.method](request.params)
    console.log(this)
    console.log(request.method)
    console.log("result = " + result )

    return new Promise((resolve,reject) => {

      let response = {
        request : request,
        data : result,
        status : 0,
        type : CONST.RESPONSE_TYPE,
        host : request.clientHost,
        endTimestamp : new Date().getTime()
      }

      if(result && result.then) {
        result.then( (data) => {
          response.data = data 
          resolve(response)
        })
      } else {
        resolve(response)
      }
    }).then(response => {
      this.protocol.dispatch(response)
      return response
    }).catch(e => {
      response.status = -1
      response.message = e
      this.protocol.dispatch(response)
      return response
    })
   
   
  }
 

}

export default Server 