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
      const error = await response.json().catch(() => ({ message: "An unexpected error occurred" }));
      throw new Error(error.message || "Something went wrong.");
    }

    return { success: true, message: "Your message has been sent successfully." };
  } catch (error) {
    console.error("Error submitting form:", error);
    
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { success: false, message: "Request timed out. Please try again." };
      }
      return { success: false, message: error.message };
    }
    
    return { success: false, message: "Unable to send your message at the moment. Please try again later." };
  }
}