import { useState, useRef, type FormEvent } from 'react';
import { sendContactForm } from '@/services/api';

type Lead = { name: string; company: string; email: string };
import { questions, evaluate } from '../lib/diagnosis';
import './ai-diagnosis.css';

export default function AIDiagnosis({ lang = 'es' }: { lang?: string }) {
  const en = lang === 'en';
  const t = (es: string, english: string) => en ? english : es;
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(-1));
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const submitted = useRef('');
  const heading = useRef<HTMLHeadingElement>(null);
  const q = questions[step];
  const result = finished ? evaluate(answers) : null;
  const levels = en ? ['Foundations to define', 'Controls in progress', 'A structured foundation', 'Advanced practices'] : ['Bases por definir', 'Controles en desarrollo', 'Una base estructurada', 'Prácticas avanzadas'];
  const resultHeadlines = en ? [
    'Give your next AI decisions a stronger foundation.',
    'You have a starting point. Make it more reliable.',
    'A solid foundation. Decide what to strengthen next.',
    'Keep your practices strong as your project evolves.',
  ] : [
    'Dadle una base más sólida a vuestro proyecto de IA.',
    'Tenéis una base. Ahora toca hacerla más fiable.',
    'Una base sólida. Decidid qué reforzar a continuación.',
    'Mantened el nivel mientras evoluciona vuestro proyecto.',
  ];
  function move(next: number) { setStep(next); requestAnimationFrame(() => heading.current?.focus()); }
  async function handleReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || !result) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lead: Lead = { name: String(data.get('name') || '').trim(), company: String(data.get('company') || '').trim(), email: String(data.get('email') || '').trim() };
    if (!lead.name || !lead.company || !lead.email || data.get('permission') !== 'on') { setError(t('Completa los datos y confirma que quieres compartir el diagnóstico.', 'Complete your details and confirm you want to share your diagnosis.')); return; }
    pending.current = true; setBusy(true); setError('');
    try {
      const key = JSON.stringify({ lead, answers });
      if (submitted.current !== key) {
        const message = [
          t('Solicitud de informe de diagnóstico de IA', 'AI diagnosis report request'),
          `${t('Empresa', 'Company')}: ${lead.company}`,
          `${t('Nota', 'Score')}: ${result.score}/10`,
          ...questions.map((q, i) => `${i + 1}. ${q[en ? 1 : 0]}: ${q[en ? 3 : 2][answers[i]]}`),
          t('Prioridades:', 'Priorities:'),
          ...result.priorities.map(i => questions[i][en ? 5 : 4]),
          t('El usuario ha solicitado compartir sus datos y diagnóstico para recibir contacto sobre el resultado. Sin suscripción a newsletter.', 'The user requested sharing their details and diagnosis for follow-up about the result. No newsletter subscription.'),
        ].join('\n');
        const response = await sendContactForm({ name: lead.name, email: lead.email, phone: '', kind: 'diagnosis', message });
        if (!response.success) { setError(t('No hemos podido registrar la solicitud. Tus respuestas siguen aquí: inténtalo de nuevo o escríbenos a hello@tenbeltz.com.', 'We could not register your request. Your answers are still here: retry or email hello@tenbeltz.com.')); return; }
        submitted.current = key;
      }
      await download(lead);
    } catch { setError(t('No hemos podido generar el informe. Inténtalo de nuevo.', 'We could not generate the report. Please retry.')); }
    finally { pending.current = false; setBusy(false); }
  }
  async function download(lead: Lead) {
    if (!result) return;
    setBusy(true); setError('');
    try {
      const { buildDiagnosisReport } = await import('../lib/diagnosis-report');
      const doc = await buildDiagnosisReport(lead, answers, lang);
      doc.save(en ? 'TenBeltz-AI-diagnosis.pdf' : 'TenBeltz-diagnostico-IA.pdf');
    } catch { setError(t('No hemos podido generar el PDF. Inténtalo de nuevo.', 'Could not generate the PDF. Please try again.')); }
    finally { setBusy(false); }
  }
  return <section id="diagnostico-ia" className="diagnosis wrap home-section" aria-labelledby="diagnosis-title">
    <div className="diagnosis-intro"><span className="eyebrow">{t('Autoevaluación · 2 minutos', 'Self-assessment · 2 minutes')}</span><h2 id="diagnosis-title">{t('¿Qué le falta a vuestro proyecto de IA?', 'What is your AI project missing?')}</h2><p>{t('Diez preguntas rápidas. Tu nota del 1 al 10 al terminar. Tus prioridades de mejora, en el informe PDF.', 'Ten quick questions. See your score from 1 to 10. Get your improvement priorities in the PDF report.')}</p><p className="diagnosis-note">{t('Consulta tu nota sin dejar datos. Para descargar el PDF, te pediremos nombre, empresa y email, y compartiremos el diagnóstico con TenBeltz para comentarlo contigo.', 'See your score without sharing details. To download the PDF, we will ask for your name, company and email, and share your diagnosis with TenBeltz to discuss it with you.')}</p></div>
    <div className="diagnosis-panel">
      {!result ? <><div className="diagnosis-progress"><span>{t('Pregunta', 'Question')} {step + 1} / 10</span><span>{t('Diagnóstico de IA', 'AI diagnosis')}</span></div><progress max="10" value={step + 1} aria-label={t('Progreso del cuestionario', 'Questionnaire progress')} /><h3 tabIndex={-1} ref={heading}>{q[en ? 1 : 0]}</h3><fieldset><legend className="sr-only">{q[en ? 1 : 0]}</legend>{q[en ? 3 : 2].map((option, value) => <label key={`${step}-${value}`} className={answers[step] === value ? 'selected' : ''}><input type="radio" name={`diagnosis-${step}`} checked={answers[step] === value} onChange={() => setAnswers(current => current.map((a, i) => i === step ? value : a))} /><span>{option}</span></label>)}</fieldset><div className="diagnosis-actions"><button type="button" className="diagnosis-back" disabled={step === 0} onClick={() => move(step - 1)}>{t('Anterior', 'Back')}</button><button type="button" className="button" disabled={answers[step] < 0} onClick={() => { if (step === 9) { setFinished(true); requestAnimationFrame(() => heading.current?.focus()); } else move(step + 1); }}>{step === 9 ? t('Ver mi diagnóstico', 'See my diagnosis') : t('Siguiente', 'Next')} →</button></div></> : <><span className="eyebrow">{t('Tu diagnóstico', 'Your diagnosis')}</span><h3 ref={heading} tabIndex={-1}>{resultHeadlines[result.level]}</h3><p className="diagnosis-level">{levels[result.level]}</p><p className="diagnosis-score">{result.score.toLocaleString(en ? 'en-GB' : 'es-ES')}<span> / 10</span></p><p>{t('Fase: ', 'Stage: ')}{questions[0][en ? 3 : 2][answers[0]]}</p><p className="diagnosis-result-context">{result.score === 10 ? t('Vuestras respuestas reflejan prácticas avanzadas. El informe os ayuda a preparar la siguiente revisión y mantenerlas cuando cambie el sistema.', 'Your answers reflect advanced practices. The report helps you prepare your next review and maintain them as the system changes.') : t('La nota sitúa vuestro punto de partida. El informe convierte vuestras respuestas en prioridades: qué abordar primero y cómo comprobar que habéis avanzado.', 'Your score marks your starting point. The report turns your answers into priorities: what to tackle first and how to check progress.')}</p><form className="diagnosis-lead" onSubmit={handleReport} aria-label={t('Descargar informe personalizado', 'Download personalised report')}>
      <span className="eyebrow">{t('Vuestro siguiente paso', 'Your next step')}</span><h4>{t('De la nota a un plan de acción.', 'From your score to an action plan.')}</h4>
      <p>{t('Descarga un informe basado en vuestras respuestas, listo para llevar a la próxima reunión de equipo.', 'Download a report based on your answers, ready for your next team meeting.')}</p>
      <ul className="diagnosis-report-value">
        <li>{result.priorities.length ? t('Hasta 3 prioridades ordenadas para saber por dónde empezar.', 'Up to 3 ranked priorities so you know where to start.') : t('Una pauta de revisión para mantener vuestras prácticas.', 'A review guide to maintain your practices.')}</li>
        <li>{t('Acciones concretas y la evidencia que os permitirá comprobar el avance.', 'Concrete actions and the evidence you can use to check progress.')}</li>
        <li>{t('Una hoja de trabajo para asignar responsables y acordar la siguiente revisión.', 'A worksheet to assign owners and agree on the next review.')}</li>
      </ul>
      <p className="diagnosis-note">{t('Completa tus datos para descargar vuestro plan en PDF.', 'Complete your details to download your PDF action plan.')}</p>
      <div className="diagnosis-lead-fields">
        <div><label htmlFor="diagnosis-name">{t('Nombre', 'Name')}</label><input id="diagnosis-name" name="name" autoComplete="name" required maxLength={120} /></div>
        <div><label htmlFor="diagnosis-company">{t('Empresa', 'Company')}</label><input id="diagnosis-company" name="company" autoComplete="organization" required maxLength={160} /></div>
        <div><label htmlFor="diagnosis-email">{t('Email profesional', 'Work email')}</label><input id="diagnosis-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
      </div>
      <label className="diagnosis-permission"><input type="checkbox" name="permission" required /><span>{t('Quiero compartir mis datos y este diagnóstico con TenBeltz para que me contacte sobre el resultado.', 'I want to share my details and this diagnosis with TenBeltz for follow-up about the result.')} <a href={en ? '/en/politicas' : '/politicas'} target="_blank" rel="noopener noreferrer">{t('Privacidad (nueva pestaña)', 'Privacy (new tab)')}</a></span></label>
      <p className="diagnosis-note">{t('Sin suscripción a newsletter. El PDF se descarga aquí; no se envía por email.', 'No newsletter subscription. Your PDF downloads here; it is not emailed.')}</p>
      <div className="diagnosis-actions"><button type="submit" className="button" disabled={busy}>{busy ? t('Preparando informe…', 'Preparing report…') : t('Descargar mi plan de mejora', 'Download my improvement plan')} ↓</button></div>
    </form>
    <details className="diagnosis-method"><summary>{t('Cómo se calcula la nota', 'How the score is calculated')}</summary><p>{t('Autoevaluación orientativa basada en tus respuestas, no una auditoría ni certificación. La fase no puntúa. Las otras nueve preguntas valen 0, 1 o 2 puntos: nota = 1 + puntos / 2. La nota no demuestra aptitud para producción.', 'An indicative self-assessment based on your answers, not an audit or certification. Stage is not scored. The other nine questions earn 0, 1 or 2 points: score = 1 + points / 2. The score does not establish production readiness.')}</p></details>
    <div className="diagnosis-actions"><a href={en ? '/en#contact-section' : '/#contact-section'} className="text-link">{t('Hablar sobre el resultado', 'Discuss the result')} ↗</a></div>{error && <p role="alert">{error}</p>}<button type="button" className="diagnosis-back" disabled={busy} onClick={() => { setFinished(false); move(0); }}>{t('Revisar mis respuestas', 'Review my answers')}</button></>}
    </div>
  </section>;
}
