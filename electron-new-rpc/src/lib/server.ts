import CONST  from './const.js'


// @TODO find a better way to make it work
interface Request {
  method: keyof typeof Server.prototype  
  params: any
  clientHost: string 
}

interface Response{
  data: any
  status:any
  request: Request
  type: string 
  host: string 
  endTimestamp: any  
  message: string 
}


class Server {

  host: string;
  serviceName: string;
  protocol: any;
 

  constructor(host:string,serviceName:string,protocol:any) {
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
  
  prop<T extends object, K extends keyof T>(obj: T, key: K) {
    return obj[key];
  }

  handleRequest(request:Request) {

   
    let result = this[request.method](...request.params)

    console.log(this)
    console.log(request.method)
    console.log("result = " + result )

    let response:Response; 

    return new Promise((resolve,_) => {

      response = {
        request : request,
        data : result,
        status : 0,
        type : CONST.RESPONSE_TYPE,
        host : request.clientHost,
        endTimestamp : new Date().getTime(),
        message: ""
      }

      if(result && result.then) {
        result.then( (data:any) => {
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