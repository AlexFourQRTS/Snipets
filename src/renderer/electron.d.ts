declare global {
  interface Window {
    electron: {
      ipc: {
        on: (channel: string, cb: (event: any, ...args: any[]) => void) => void
        send: (
          channel: string,
          data: any,
          cb?: (event: any, ...args: any[]) => void,
        ) => void
        invoke: (channel: string, data?: any) => Promise<any>
        removeListener: (
          channel: string,
          cb: (event: any, ...args: any[]) => void,
        ) => void
        removeListeners: (channel: string) => void
      }
      db: {
        query: (sql: string, params?: any[]) => Promise<any>
      }
      store: {
        app: {
          get: (name: string) => any
          set: (name: string, value: any) => void
          delete: (name: string) => void
        }
        preferences: {
          get: (name: string) => any
          set: (name: string, value: any) => void
          delete: (name: string) => void
        }
      }
      i18n: {
        t: (key: string, options?: any) => string
      }
    }
  }
}

export {}
