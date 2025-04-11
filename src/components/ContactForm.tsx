import React, { useState } from "react";
import Alert, { type AlertProps } from "./Alert";
import { sendContactForm } from "@/services/api";
import { ScrollReveal } from "./ScrollReveal";

export default function ContactForm() {
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || "",
      message: formData.get("message") as string,
    };

    if (!data.name || !data.email || !data.message) {
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Error!",
        message: "Please fill out all required fields.",
      });
      return;
    }

    const result = await sendContactForm(data);

    setAlert({
      id: Date.now(),
      type: result.success ? "success" : "error",
      title: result.success ? "Success!" : "Error!",
      message: result.message,
    });

    if (result.success) form.reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <div className="grid grid-cols-2 gap-x-14 gap-y-8">
          <ScrollReveal className="flex flex-col col-span-2 gap-y-3">
            <label htmlFor="name" className="font-semibold">
              Name
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
            <label htmlFor="phone" className="font-semibold">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="px-3 py-2 text-white border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </ScrollReveal>
          <ScrollReveal className="flex flex-col col-span-2 gap-y-3">
            <label htmlFor="message" className="font-semibold">
              Message
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
          <button
            type="submit"
            id="submit-form-button"
            className="btn font-semibold leading-none border border-pheromone-purple text-pheromone-purple w-fit bg-pheromone-purple/20 hover:bg-pheromone-purple/25 hover:cursor-pointer"
          >
            Send message
          </button>
        </ScrollReveal>
      </form>
      {alert && <Alert {...alert} />}
    </>
  );
}
