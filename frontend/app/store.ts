import { configureStore, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// const authPersistReducer = persistReducer(
//   { key: "auth", storage },
//   authReducer,
// );

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});

// export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () =>
  useDispatch<ThunkDispatch<unknown, unknown, UnknownAction>>();

export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
