const TIMEOUT_MS = 10000; // 10 seconds timeout

export async function sendContactForm(data: { name: string; email: string; phone?: string; message: string }) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch("https://api.tenbeltz.com/communications/contact-form/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Ha ocurrido un error inesperado" }));
      throw new Error(error.message || "Algo salió mal.");
    }

    return { success: true, message: "Tu mensaje se ha enviado correctamente." };
  } catch (error) {
    console.error("Error submitting form:", error);
    
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { success: false, message: "La solicitud excedió el tiempo. Intenta de nuevo." };
      }
      return { success: false, message: error.message };
    }
    
    return { success: false, message: "No se pudo enviar el mensaje. Intenta más tarde." };
  }
}

export async function subscribeToNewsletter(data: {
  name: string;
  email: string;
  acceptedPolicy: boolean;
  source?: "newsletter" | "footer";
}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch("https://api.tenbeltz.com/communications/newsletter/subscribe/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        accepted_policy: data.acceptedPolicy,
        source: data.source,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message =
        payload?.detail ||
        payload?.email ||
        payload?.accepted_policy ||
        payload?.non_field_errors ||
        "No se pudo completar la suscripción.";
      throw new Error(Array.isArray(message) ? message.join(" ") : message);
    }

    return {
      success: true,
      message: payload?.detail || "Te has suscrito correctamente.",
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { success: false, message: "La solicitud excedió el tiempo. Intenta de nuevo." };
      }
      return { success: false, message: error.message };
    }

    return { success: false, message: "No se pudo completar la suscripción. Intenta más tarde." };
  }
}
