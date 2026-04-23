import React, { useState } from "react";
import Alert, { type AlertProps } from "./Alert";
import { sendContactForm } from "@/services/api";
import { ScrollReveal } from "./ScrollReveal";

interface ContactFormProps {
  lang?: "es" | "en";
}

export default function ContactForm({ lang = 'es' }: ContactFormProps) {
  const copy = lang === "en"
    ? {
        fields: {
          name: "Name",
          email: "Email",
          company: "Company",
          role: "Role",
          companyType: "Company type",
          engagementType: "What do you need?",
          projectStage: "Project stage",
          message: "Message",
        },
        placeholders: {
          companyType: "Select an option",
          engagementType: "Select an option",
          projectStage: "Select an option",
          message: "Context, use case, constraints, current blockers...",
        },
        options: {
          companyType: ["SaaS", "Software consultancy", "Other software company"],
          engagementType: ["AI Gap Analysis", "AI Project Foundations", "Production Delivery", "AI Partner"],
          projectStage: ["Exploring the opportunity", "Defining the project", "In development", "Already in production", "Project for a client"],
        },
        submit: "Request proposal",
        submitting: "Sending...",
        note: "We respond in less than 48h",
        required: "Please complete the required fields.",
        success: "Sent",
        error: "Error",
      }
    : {
        fields: {
          name: "Nombre",
          email: "Email",
          company: "Empresa",
          role: "Rol",
          companyType: "Tipo de empresa",
          engagementType: "Qué necesitáis",
          projectStage: "Estado del proyecto",
          message: "Mensaje",
        },
        placeholders: {
          companyType: "Selecciona una opción",
          engagementType: "Selecciona una opción",
          projectStage: "Selecciona una opción",
          message: "Contexto, caso de uso, restricciones, bloqueos actuales...",
        },
        options: {
          companyType: ["SaaS", "Consultora de software", "Otra empresa de software"],
          engagementType: ["AI Gap Analysis", "AI Project Foundations", "Production Delivery", "AI Partner"],
          projectStage: ["Explorando la oportunidad", "Definiendo el proyecto", "En desarrollo", "Ya en producción", "Proyecto para un cliente"],
        },
        submit: "Solicitar propuesta",
        submitting: "Enviando...",
        note: "Respondemos en menos de 48h",
        required: "Por favor completa los campos obligatorios.",
        success: "Enviado",
        error: "Error",
      };
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const chevronDataUrl =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'><path d='M3 4.5 L6 7.5 L9 4.5' stroke='%23E5C6F3' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>\")";

  const selectClassName =
    "appearance-none cursor-pointer bg-no-repeat pr-10 px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none [&:invalid]:text-slate-400";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const company = (formData.get("company") as string) || "";
    const role = (formData.get("role") as string) || "";
    const companyType = (formData.get("companyType") as string) || "";
    const engagementType = (formData.get("engagementType") as string) || "";
    const projectStage = (formData.get("projectStage") as string) || "";
    const rawMessage = (formData.get("message") as string) || "";
    const contextLines = [
      company ? `${copy.fields.company}: ${company}` : "",
      role ? `${copy.fields.role}: ${role}` : "",
      companyType ? `${copy.fields.companyType}: ${companyType}` : "",
      engagementType ? `${copy.fields.engagementType}: ${engagementType}` : "",
      projectStage ? `${copy.fields.projectStage}: ${projectStage}` : "",
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

    if (!data.name || !data.email || !companyType || !engagementType || !projectStage || !rawMessage) {
      setAlert({
        id: Date.now(),
        type: "error",
        title: copy.error,
        message: copy.required,
      });
      return;
    }

    setSubmitting(true);
    const result = await sendContactForm(data);

    setAlert({
      id: Date.now(),
      type: result.success ? "success" : "error",
      title: result.success ? copy.success : copy.error,
      message: result.message,
    });

    if (result.success) form.reset();
    setSubmitting(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <ScrollReveal className="flex flex-col gap-y-3">
            <label htmlFor="name" className="font-semibold">
              {copy.fields.name}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-y-3">
            <label htmlFor="email" className="font-semibold">
              {copy.fields.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="px-3 py-2 text-white border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-y-3">
            <label htmlFor="company" className="font-semibold">
              {copy.fields.company}
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="px-3 py-2 text-white border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-y-3">
            <label htmlFor="role" className="font-semibold">
              {copy.fields.role}
            </label>
            <input
              id="role"
              name="role"
              type="text"
              className="px-3 py-2 text-white border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-y-3">
            <label htmlFor="companyType" className="font-semibold">
              {copy.fields.companyType}
            </label>
            <select
              id="companyType"
              name="companyType"
              required
              defaultValue=""
              className={selectClassName}
              style={{ backgroundImage: chevronDataUrl, backgroundPosition: "right 0.875rem center", backgroundSize: "12px 12px" }}
            >
              <option value="" disabled className="text-slate-500">
                {copy.placeholders.companyType}
              </option>
              {copy.options.companyType.map((option) => (
                <option key={option} value={option} className="text-white bg-obsidian-shard">
                  {option}
                </option>
              ))}
            </select>
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-y-3">
            <label htmlFor="engagementType" className="font-semibold">
              {copy.fields.engagementType}
            </label>
            <select
              id="engagementType"
              name="engagementType"
              required
              defaultValue=""
              className={selectClassName}
              style={{ backgroundImage: chevronDataUrl, backgroundPosition: "right 0.875rem center", backgroundSize: "12px 12px" }}
            >
              <option value="" disabled className="text-slate-500">
                {copy.placeholders.engagementType}
              </option>
              {copy.options.engagementType.map((option) => (
                <option key={option} value={option} className="text-white bg-obsidian-shard">
                  {option}
                </option>
              ))}
            </select>
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-y-3 md:col-span-2">
            <label htmlFor="projectStage" className="font-semibold">
              {copy.fields.projectStage}
            </label>
            <select
              id="projectStage"
              name="projectStage"
              required
              defaultValue=""
              className={selectClassName}
              style={{ backgroundImage: chevronDataUrl, backgroundPosition: "right 0.875rem center", backgroundSize: "12px 12px" }}
            >
              <option value="" disabled className="text-slate-500">
                {copy.placeholders.projectStage}
              </option>
              {copy.options.projectStage.map((option) => (
                <option key={option} value={option} className="text-white bg-obsidian-shard">
                  {option}
                </option>
              ))}
            </select>
          </ScrollReveal>
          <ScrollReveal className="flex flex-col gap-y-3 md:col-span-2">
            <label htmlFor="message" className="font-semibold">
              {copy.fields.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder={copy.placeholders.message}
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
              {submitting ? copy.submitting : copy.submit}
            </button>
            <span className="text-xs text-slate-400">{copy.note}</span>
          </div>
        </ScrollReveal>
      </form>
      {alert && <Alert {...alert} />}
    </>
  );
}
