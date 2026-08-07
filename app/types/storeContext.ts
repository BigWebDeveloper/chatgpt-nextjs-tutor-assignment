// Define the state shape
export type StoreContextType = {
  isLoginPopup: boolean;
  setIsLoginPopup: (value: boolean) => void;
  openLogin: () => void;
  closeLogin: () => void;
};
