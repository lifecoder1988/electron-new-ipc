//import Store from 'electron-store';

const store = new Map();


function get(host) {
  return store.get(host)
}

function set(host,info) {
  return store.set(host,info)
}

export default {
  get,
  set
}