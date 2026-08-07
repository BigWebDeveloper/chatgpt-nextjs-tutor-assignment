import { IoMdClose } from "react-icons/io";
import PopupForm from "./PopupForm";
import { useStore } from "@/app/context/StoreContext";
import { useState } from "react";

const Popup = () => {
  const { setIsLoginPopup } = useStore();
  const [currentState, setCurrentState] = useState("Login");

  return (
    <div className="flex m-auto z-index-1000 top-0 left-0 right-0 bottom-0 backdrop-blur-sm">
      <div className="m-auto sm:w-100 w-11/12 p-10 rounded-2xl shadow-2xl bg-white user1">
        <div className="flex justify-between items-center mb-4 w-full">
          <h2>{currentState}</h2>
          <p
            onClick={() => setIsLoginPopup(true)}
            className="cursor-pointer p-2 text-black"
          >
            <IoMdClose />
          </p>
        </div>
        <PopupForm current={currentState} />
        <div className="create-account">
          {currentState === "Login" ? (
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrentState("Sign up")}>Click here</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrentState("Login")}>Login here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
