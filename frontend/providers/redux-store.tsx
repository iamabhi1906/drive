import store, { persistor } from "@/app/store";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";

export default function ReduxStore({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      {children}
      {/* </PersistGate> */}
    </Provider>
  );
}
