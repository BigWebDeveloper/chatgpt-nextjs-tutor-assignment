import React from "react";
import UploadTest from "./components/UploadTest";

const page = () => {
  return (
    <div className="flex justify-center items-center h-lvh flex-col gap-10">
      <h1 className="text-6xl font-black">Home</h1>
      <UploadTest />
    </div>
  );
};

export default page;
