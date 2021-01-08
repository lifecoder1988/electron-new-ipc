import Store from 'electron-store';

class GlobalStore {
  static store = new Store() 

  static  get(host:string): any {
    
    return GlobalStore.store.get(host)
  }

  static set(host:string,info:any) {
    console.log("set info...")
    console.log(host)
    console.log(info)

    return GlobalStore.store.set(host,info)
  }

}
export default GlobalStore