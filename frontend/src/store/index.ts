import { configureStore } from '@reduxjs/toolkit'
import { queryAPI } from '@/queries/api'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [queryAPI.reducerPath]: queryAPI.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(queryAPI.middleware),
  })
}

// types
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
