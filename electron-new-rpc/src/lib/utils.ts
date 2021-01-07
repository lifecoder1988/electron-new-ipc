import { v4 as uuidv4 } from 'uuid';
import  electron from 'electron';

// @TODO find a better way to make it work
interface Process {
  type?: string
  host?: string 
}
declare var process: Process

console.log(process)

export function getSender(hostId: number) {
  if(isRenderer()) {
    //import { BrowserWindow, ipcMain, ipcRenderer } from 'electron';
    return electron.ipcRenderer
  } else {
    return electron.BrowserWindow.fromId(hostId)?.webContents
  }
}

export function getIPC() {
  if(isRenderer()) {
    //import { BrowserWindow, ipcMain, ipcRenderer } from 'electron';
    return electron.ipcRenderer
  } else {
    return electron.ipcMain
  }
}



export function isRenderer () {
  // running in a web browser
  if (typeof process === 'undefined') return true

  // node-integration is disabled
  if (!process) return true

  // We're in node.js somehow

  if (!process.type) return false

  return process.type === 'renderer'
}

export function currentHost() {
  return process.host 
}



export function UUID() {
  return uuidv4()
}

