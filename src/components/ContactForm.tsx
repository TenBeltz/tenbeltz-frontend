import React, { useState } from "react";
import Alert, { type AlertProps } from "./Alert";
import { sendContactForm } from "@/services/api";
import { ScrollReveal } from "./ScrollReveal";

export default function ContactForm() {
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const company = (formData.get("company") as string) || "";
    const role = (formData.get("role") as string) || "";
    const rawMessage = (formData.get("message") as string) || "";
    const contextLines = [
      company ? `Empresa: ${company}` : "",
      role ? `Rol: ${role}` : "",
    ].filter(Boolean);
    const message = contextLines.length
      ? `${contextLines.join("\n")}\n\n${rawMessage}`
      : rawMessage;
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: "",
      message,
    };

    if (!data.name || !data.email || !rawMessage) {
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Error",
        message: "Por favor completa los campos obligatorios.",
      });
      return;
    }

    setSubmitting(true);
    const result = await sendContactForm(data);

    setAlert({
      id: Date.now(),
      type: result.success ? "success" : "error",
      title: result.success ? "Enviado" : "Error",
      message: result.message,
    });

    if (result.success) form.reset();
    setSubmitting(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <div className="grid grid-cols-2 gap-x-14 gap-y-8">
          <ScrollReveal className="flex flex-col col-span-2 gap-y-3">
            <label htmlFor="name" className="font-semibold">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col col-span-2 gap-y-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="px-3 py-2 text-white border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col col-span-2 gap-y-3">
            <label htmlFor="company" className="font-semibold">
              Empresa
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="px-3 py-2 text-white border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col col-span-2 gap-y-3">
            <label htmlFor="role" className="font-semibold">
              Rol
            </label>
            <input
              id="role"
              name="role"
              type="text"
              className="px-3 py-2 text-white border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col col-span-2 gap-y-3">
            <label htmlFor="message" className="font-semibold">
              Mensaje (¿qué quieres construir?)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              required
              className="px-3 py-2 text-white border rounded-md resize-none border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
        </div>
        <ScrollReveal className="self-end">
          <div className="flex flex-col items-end gap-y-2">
            <button
              type="submit"
              id="submit-form-button"
              disabled={submitting}
              className="btn font-semibold leading-none border border-pheromone-purple text-pheromone-purple w-fit bg-pheromone-purple/20 hover:bg-pheromone-purple/25 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando..." : "Hablar con TenBeltz"}
            </button>
            <span className="text-xs text-slate-400">Respondemos en menos de 48h</span>
          </div>
        </ScrollReveal>
      </form>
      {alert && <Alert {...alert} />}
    </>
  );
}
