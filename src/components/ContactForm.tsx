import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { AlertProps } from './Alert';
import { sendContactForm } from '@/services/api';

export default function ContactForm({ lang = 'es', audience = 'general' }: { lang?: 'es' | 'en'; audience?: 'general' | 'business' | 'software' }) {
  const en = lang === 'en';
  const t = (es: string, english: string) => en ? english : es;
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
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
    const interest = String(values.get('interest') || '').trim();
    if (!name || !email || !message) {
      setAlert({ id: Date.now(), type: 'error', title: t('Revisa el formulario', 'Check the form'), message: t('Completa nombre, email y mensaje.', 'Complete your name, email and message.') });
      return;
    }
    pending.current = true;
    setSubmitting(true);
    try {
      const result = await sendContactForm({ name, email, phone: '', message: `${interest ? `${t('Interés', 'Interest')}: ${interest}\n\n` : ''}${company ? `${t('Empresa', 'Company')}: ${company}\n\n` : ''}${message}` });
      setAlert({ id: Date.now(), type: result.success ? 'success' : 'error', title: result.success ? t('Enviado', 'Sent') : t('No se ha enviado', 'Not sent'), message: result.success ? t('Tu mensaje se ha enviado correctamente.', 'Your message has been sent.') : t('No hemos podido enviar tu mensaje. Inténtalo de nuevo o escríbenos a hello@tenbeltz.com.', 'We could not send your message. Please retry or email hello@tenbeltz.com.') });
      if (result.success) form.reset();
    } finally { pending.current = false; setSubmitting(false); }
  }

  return <div className="contact-form-shell">
    <form onSubmit={handleSubmit} className="contact-form" aria-busy={submitting}>
      <fieldset disabled={!ready || submitting} className="contact-fields"><legend className="sr-only">{t('Tu consulta', 'Your enquiry')}</legend>
      <div className="form-grid">
        <div className="field"><label htmlFor="name">{t('Nombre', 'Name')}</label><input id="name" name="name" autoComplete="name" required maxLength={120} className="form-input" /></div>
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="form-input" /></div>
        <div className="full-field field"><label htmlFor="company">{t('Empresa (opcional)', 'Company (optional)')}</label><input id="company" name="company" autoComplete="organization" maxLength={160} className="form-input" /></div>
        <div className="full-field field"><label htmlFor="interest">{t('¿En qué podemos ayudarte?', 'How can we help?')}</label><select id="interest" name="interest" defaultValue={audience === 'business' ? 'business' : audience === 'software' ? 'software' : ''} className="form-input"><option value="">{t('Selecciona una opción (opcional)', 'Select an option (optional)')}</option><option value="business">{t('Automatizar un proceso de mi empresa', 'Automate a business workflow')}</option><option value="software">{t('Desarrollar o integrar IA en software', 'Build or integrate AI in software')}</option><option value="training">{t('Formación para mi equipo', 'Training for my team')}</option><option value="other">{t('Otro proyecto', 'Another project')}</option></select></div>
        <div className="full-field field"><label htmlFor="message">{t('Mensaje', 'Message')}</label><textarea id="message" name="message" rows={5} required maxLength={6000} placeholder={audience === 'business' ? t('Qué tarea repetís, con qué herramientas y qué os gustaría mejorar.', 'What task you repeat, which tools you use and what you want to improve.') : audience === 'software' ? t('Tu producto, la funcionalidad de IA y en qué punto está el proyecto.', 'Your product, the AI feature and the current project stage.') : t('Cuéntanos en qué podemos ayudarte.', 'Tell us how we can help.')} className="form-input" /></div>
      </div>
      <p className="form-note">{t('No incluyas documentación confidencial ni datos personales de terceros.', 'Do not include confidential documents or personal data about other people.')}</p>
      <p className="form-note">{t('Usaremos tus datos para responder a tu consulta.', 'We will use your details to respond to your enquiry.')} <a href={en ? '/en/politicas' : '/politicas'} className="text-link">{t('Privacidad', 'Privacy')}</a></p>
      <div className="form-end"><button type="submit" id="submit-form-button" disabled={!ready || submitting} className="button">{submitting ? t('Enviando…', 'Sending…') : t('Enviar mensaje', 'Send message')}</button><span className="form-note">{t('Tu consulta llegará al equipo de TenBeltz', 'Your enquiry goes to the TenBeltz team')}</span></div>
      </fieldset>
    </form>
    <div className="contact-feedback" aria-live={alert?.type === 'error' ? 'assertive' : 'polite'} aria-atomic="true">{alert && <div className={`contact-feedback-message contact-feedback-${alert.type}`}><strong>{alert.title}</strong><p>{alert.message}</p></div>}</div>
    <noscript><p className="form-note">{t('Para enviar el formulario, activa JavaScript o escríbenos a ', 'To send the form, enable JavaScript or email ')}<a href="mailto:hello@tenbeltz.com">hello@tenbeltz.com</a>.</p></noscript>
  </div>;
}
