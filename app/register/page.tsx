"use client";
import Popup from "../components/registration/Popup";
import { useStore } from "../context/StoreContext";

const RegistrationPopup = () => {
  const { isLoginPopup } = useStore();

  return <>{isLoginPopup ? <></> : <Popup />}</>;
};

export default RegistrationPopup;
