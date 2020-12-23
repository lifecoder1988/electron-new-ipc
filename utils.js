import { v4 as uuidv4 } from 'uuid';

function isRenderer () {
  // running in a web browser
  if (typeof process === 'undefined') return true

  // node-integration is disabled
  if (!process) return true

  // We're in node.js somehow
  if (!process.type) return false

  return process.type === 'renderer'
}

function currentHost() {
  return process.host 
}



function UUID() {
  return uuidv4()
}


export default {
  isRenderer : isRenderer ,
  currentHost : currentHost,
  UUID : UUID
}