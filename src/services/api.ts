export async function sendContactForm(data: { name: string; email: string; phone?: string; message: string }) {
  try {
    const response = await fetch("https://api.tenbeltz.com/communications/contact-form/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong.");
    }

    return { success: true, message: "Your message has been sent successfully." };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { success: false, message: "Unable to send your message at the moment. Please try again later." };
  }
}

export async function sendProjectEstimate(data: {
  email: string;
  language: string;
  project_text?: string;
  file?: File;
  budget?: string;
}) {
  try {
    const params = new URLSearchParams({
      email: data.email,
      language: data.language,
    });

    if (data.budget) params.append("budget", data.budget);
    if (data.project_text) params.append("project_text", data.project_text);

    let body: FormData | null = null;

    if (data.file) {
      body = new FormData();
      body.append("file", data.file);
    }

    const response = await fetch(`https://api.tenbeltz.com/communications/project-estimate/?${params.toString()}`, {
      method: "POST",
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong.");
    }

    return { success: true, message: "Your message has been sent successfully." };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "Unable to send your message at the moment. Please try again later.",
    };
  }
}