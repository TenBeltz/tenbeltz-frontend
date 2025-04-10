import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export interface AlertProps {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export default function Alert({ id, type, title, message }: AlertProps) {
  useEffect(() => {
    if (title && message) {
      MySwal.fire({
        icon: type,
        title,
        text: message,
      });
    }
  }, [id, type, title, message]); // ahora incluimos id en las dependencias

  return null;
}
