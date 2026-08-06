"use client";

import ClipLoader from "react-spinners/ClipLoader";
import { LoadingEffectProps } from "../types/frontend";

const LoadingEffect = ({
  loading,
  color = "white",
  size = 20,
}: LoadingEffectProps) => {
  return <ClipLoader color={color} loading={loading} size={size} />;
};

export default LoadingEffect;
