import { useRef, useState, type FormEvent } from 'react';
import Alert, { type AlertProps } from './Alert';
import { sendContactForm } from '@/services/api';

export default function ContactForm({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const en = lang === 'en';
  const t = (es: string, english: string) => en ? english : es;
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name') || '').trim();
    const email = String(values.get('email') || '').trim();
    const company = String(values.get('company') || '').trim();
    const message = String(values.get('message') || '').trim();
    if (!name || !email || !message) {
      setAlert({ id: Date.now(), type: 'error', title: t('Revisa el formulario', 'Check the form'), message: t('Completa nombre, email y mensaje.', 'Complete your name, email and message.') });
      return;
    }
    pending.current = true;
    setSubmitting(true);
    try {
      const result = await sendContactForm({ name, email, phone: '', message: `${company ? `${t('Empresa', 'Company')}: ${company}\n\n` : ''}${message}` });
      setAlert({ id: Date.now(), type: result.success ? 'success' : 'error', title: result.success ? t('Enviado', 'Sent') : t('No se ha enviado', 'Not sent'), message: result.success ? t('Tu mensaje se ha enviado correctamente.', 'Your message has been sent.') : t('No hemos podido enviar tu mensaje. Inténtalo de nuevo o escríbenos a hello@tenbeltz.com.', 'We could not send your message. Please retry or email hello@tenbeltz.com.') });
      if (result.success) form.reset();
    } finally { pending.current = false; setSubmitting(false); }
  }

  return <>
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-grid">
        <div className="field"><label htmlFor="name">{t('Nombre', 'Name')}</label><input id="name" name="name" autoComplete="name" required maxLength={120} className="form-input" /></div>
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="form-input" /></div>
        <div className="full-field field"><label htmlFor="company">{t('Empresa (opcional)', 'Company (optional)')}</label><input id="company" name="company" autoComplete="organization" maxLength={160} className="form-input" /></div>
        <div className="full-field field"><label htmlFor="message">{t('Mensaje', 'Message')}</label><textarea id="message" name="message" rows={5} required maxLength={6000} placeholder={t('Cuéntanos en qué podemos ayudarte.', 'Tell us how we can help.')} className="form-input" /></div>
      </div>
      <p className="form-note">{t('Usaremos tus datos para responder a tu consulta.', 'We will use your details to respond to your enquiry.')} <a href={en ? '/en/politicas' : '/politicas'} className="text-link">{t('Privacidad', 'Privacy')}</a></p>
      <div className="form-end"><button type="submit" id="submit-form-button" disabled={submitting} className="button">{submitting ? t('Enviando…', 'Sending…') : t('Enviar mensaje', 'Send message')}</button><span className="form-note">{t('Respondemos en menos de 48h', 'We respond in less than 48h')}</span></div>
    </form>
    {alert && <Alert {...alert} />}
  </>;
}
