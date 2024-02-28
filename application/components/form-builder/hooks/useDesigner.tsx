import { useContext } from "react";
import { DesginerContext } from "../context/designer-context";

export default function useDesigner() {
  const context = useContext(DesginerContext);

  if (!context) {
    throw new Error(
      "useDesigner must be used within a DesginerContextProvider"
    );
  }

  return context;
}
