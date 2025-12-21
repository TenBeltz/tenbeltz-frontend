import React, { useState } from "react";
import Alert, { type AlertProps } from "./Alert";
import { subscribeToNewsletter } from "@/services/api";

export default function NewsletterForm({
  variant = "page",
  source,
}: {
  variant?: "page" | "footer";
  source?: "newsletter" | "footer";
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const isFooter = variant === "footer";
  const buttonText = submitting ? "Enviando..." : "Suscribirme";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (!email) {
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Falta el email",
        message: "Completa tu email para suscribirte.",
      });
      return;
    }

    if (!name) {
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Falta el nombre",
        message: "Completa tu nombre para suscribirte.",
      });
      return;
    }

    if (!acceptedPolicy) {
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Falta el consentimiento",
        message: "Debes aceptar las políticas para continuar.",
      });
      return;
    }

    setSubmitting(true);
    const result = await subscribeToNewsletter({
      name,
      email,
      acceptedPolicy,
      source: source || (isFooter ? "footer" : "newsletter"),
    });

    setAlert({
      id: Date.now(),
      type: result.success ? "success" : "error",
      title: result.success ? "Listo" : "Error",
      message: result.message,
    });

    if (result.success) {
      setEmail("");
      setName("");
      setAcceptedPolicy(false);
    }

    setSubmitting(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={isFooter ? "flex flex-col gap-3" : "flex flex-col gap-5"}>
        <label className={isFooter ? "text-xs font-semibold text-slate-300" : "text-sm font-semibold"}>
          Nombre
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={
              isFooter
                ? "mt-2 w-full rounded-md border border-berry-blackmail bg-berry-blackmail px-3 py-2 text-sm text-white focus:border-petal-plush focus-visible:outline-none"
                : "mt-2 w-full rounded-md border border-berry-blackmail bg-berry-blackmail px-3 py-2 text-white focus:border-petal-plush focus-visible:outline-none"
            }
            placeholder="Tu nombre"
          />
        </label>

        <label className={isFooter ? "text-xs font-semibold text-slate-300" : "text-sm font-semibold"}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={
              isFooter
                ? "mt-2 w-full rounded-md border border-berry-blackmail bg-berry-blackmail px-3 py-2 text-sm text-white focus:border-petal-plush focus-visible:outline-none"
                : "mt-2 w-full rounded-md border border-berry-blackmail bg-berry-blackmail px-3 py-2 text-white focus:border-petal-plush focus-visible:outline-none"
            }
            placeholder="tu@email.com"
          />
        </label>

        <label className={isFooter ? "flex items-start gap-2 text-[11px] text-slate-400" : "flex items-start gap-3 text-xs text-slate-300"}>
          <input
            type="checkbox"
            checked={acceptedPolicy}
            onChange={(event) => setAcceptedPolicy(event.target.checked)}
            className={isFooter ? "mt-0.5" : "mt-1"}
            required
          />
          <span>
            Acepto las{" "}
            <a
              href="/politicas"
              className="text-pheromone-purple hover:text-pheromone-light underline underline-offset-2"
            >
              políticas de uso y privacidad
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className={
            isFooter
              ? "btn w-fit bg-pheromone-purple/20 text-pheromone-purple hover:bg-pheromone-purple/30"
              : "btn bg-pheromone-purple hover:bg-sapphire-siren text-white text-center font-semibold disabled:opacity-60"
          }
        >
          {buttonText}
        </button>
      </form>
      {alert && <Alert {...alert} />}
    </>
  );
}
