import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import burn from './burn/reducer'
import burnV3 from './burn/v3/reducer'
import { updateVersion } from './global/actions'
import lists from './lists/reducer'
import logs from './logs/slice'
import market from './market/reducer'
import mint from './mint/reducer'
import mintV3 from './mint/v3/reducer'
import multicall from './multicall/reducer'
import { routingApiInch } from './routing/slice'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import { routingApiTrigonAI } from './validator/slice'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    market,
    mint,
    mintV3,
    burn,
    burnV3,
    multicall,
    lists,
    logs,
    [routingApiInch.reducerPath]: routingApiInch.reducer,
    [routingApiTrigonAI.reducerPath]: routingApiTrigonAI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true })
      .concat(routingApiInch.middleware)
      .concat(routingApiTrigonAI.middleware)
      .concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: process.env.NODE_ENV === 'test' }),
})

store.dispatch(updateVersion())

setupListeners(store.dispatch)

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
