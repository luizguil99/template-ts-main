import { contextBridge } from 'electron'

// Exponha APIs seguras aqui se precisar no futuro
contextBridge.exposeInMainWorld('api', {})


