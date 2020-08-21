import {
  HOST_DEV,
  HOST_BETA,
  HOST_ONLINE,
  HOST_TEST
} from './constants'

const {
  location: { host: HOST }
} = window

export const IS_DEV = process && process.env.NODE_ENV === 'development'

export const HOST_ENV = [HOST_ONLINE, HOST_BETA, HOST_TEST].find(key => HOST.indexOf(key) === 0) || HOST_DEV

export const prodRootMap = {
  [HOST_ONLINE]: {
    baseapi: '//github.api.huangjin.cn/'
  },
  [HOST_BETA]: {
    baseapi: '//betagithub.api.huangjin.cn/'
  },
  [HOST_TEST]: {
    baseapi: '//testgithub.api.huangjin.cn/'
  }
}

const rootObj = prodRootMap[Object.keys(prodRootMap).find(key => HOST.indexOf(key) === 0)] || {}

const DEFAULT_ROOT = '/'

const getRootStr = rootStr => {
  return rootStr || DEFAULT_ROOT
}

const PROD = {
  APIS: {
    baseapi: getRootStr(rootObj.baseapi)
  }
}

const DEV = {
  APIS: {
    baseapi: DEFAULT_ROOT
  }
}

const ENV = IS_DEV ? DEV : PROD
export default ENV.APIS
