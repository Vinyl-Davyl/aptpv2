// import useAppStore from "../store/store";

import useAppStore from "../../store/store";

export const handleError = (error: string) => {
  useAppStore.getState().addConsoleMessage("error", error);
  useAppStore.getState().setError(error);
};

export const clearError = () => {
  useAppStore.getState().setError(null);
};
