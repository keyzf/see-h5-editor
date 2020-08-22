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
    baseapi: 'https://www.fastmock.site/mock/3b9a90fe1d7a5e99d613b18a7f9f9af8/see-h5'
  },
  [HOST_BETA]: {
    baseapi: 'https://www.fastmock.site/mock/3b9a90fe1d7a5e99d613b18a7f9f9af8/see-h5'
  },
  [HOST_TEST]: {
    baseapi: 'https://www.fastmock.site/mock/3b9a90fe1d7a5e99d613b18a7f9f9af8/see-h5'
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
