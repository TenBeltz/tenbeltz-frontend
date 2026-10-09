export async function sendContactForm(data: { name: string; email: string; phone?: string; message: string; kind?: 'contact' | 'diagnosis' }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const { phone: _phone, ...payload } = data;
    const response = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload), signal: controller.signal,
    });
    if (!response.ok) return { success: false, message: 'No se pudo enviar. Inténtalo de nuevo.' };
    return { success: true, message: 'Tu mensaje se ha enviado correctamente.' };
  } catch { return { success: false, message: 'No se pudo enviar. Inténtalo de nuevo.' }; }
  finally { clearTimeout(timeout); }
}
