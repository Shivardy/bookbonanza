import * as React from "react";

export default function createContext() {
  const ctx = React.createContext(undefined);

  const useContext = () => {
    const c = React.useContext(ctx);
    if (c === undefined)
      throw new Error("useContext must be inside a Provider with a value");
    return c;
  };
  return [useContext, ctx.Provider];
}
