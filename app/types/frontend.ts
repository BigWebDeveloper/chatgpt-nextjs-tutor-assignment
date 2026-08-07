export interface PopupFormProps {
  current: "Login" | "Register" | string;
}

export interface FormDataState {
  name: string;
  email: string;
  password: string;
}
export interface LoadingEffectProps {
  loading: boolean;
  color?: string;
  size?: number;
}
