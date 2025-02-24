import React, { useState } from "react";
import Alert, { type AlertProps } from "./Alert";

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

    try {
      const response = await fetch('https://api.tenbeltz.com/communications/contact-form/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        form.reset();
        setAlert({
          id: Date.now(),
          type: "success",
          title: "Success!",
          message: "Your message has been sent successfully.",
        });
      } else {
        const error = await response.json();
        setAlert({
          id: Date.now(),
          type: "error",
          title: "Error!",
          message: error.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Error!",
        message: "Unable to send your message at the moment. Please try again later.",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <div className="grid grid-cols-2 gap-x-14 gap-y-8">
          <div className="flex flex-col col-span-2 gap-y-3">
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
          </div>
          <div className="flex flex-col col-span-2 gap-y-3">
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
          </div>
          <div className="flex flex-col col-span-2 gap-y-3">
            <label htmlFor="phone" className="font-semibold">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="px-3 py-2 text-white border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
            />
          </div>
          <div className="flex flex-col col-span-2 gap-y-3">
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
          </div>
        </div>
        <button
          type="submit"
          id="submit-form-button"
          className="self-end px-4 py-2 font-semibold leading-none border rounded-md border-pheromone-purple text-pheromone-purple w-fit bg-pheromone-purple/20"
        >
          Send message
        </button>
      </form>
      {alert && <Alert {...alert} />}
    </>
  );
}
