import React, { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export default function Alert({ type, title, message }: AlertProps) {
  useEffect(() => {
    if (title && message) {
      MySwal.fire({
        icon: type,
        title,
        text: message,
      });
    }
  }, [type, title, message]);

  return null; // No renderiza nada en la UI
}
