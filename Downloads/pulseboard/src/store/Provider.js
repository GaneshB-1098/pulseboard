"use client";

import { Provider } from "react-redux";
import { store } from "./stores";
import Persistence from "./Persistence";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <Persistence>{children}</Persistence>
    </Provider>
  );
}