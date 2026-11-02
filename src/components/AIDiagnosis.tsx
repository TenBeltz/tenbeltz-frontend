import { useEffect, useRef, useState, type FormEvent } from 'react';
import { sendContactForm } from '@/services/api';
import { answerLabel, diagnosisMessage, evaluate, isValidAnswer, questions, type DiagnosisLead, type DiagnosisLocale } from '../lib/diagnosis';
import './ai-diagnosis.css';

export default function AIDiagnosis({ lang = 'es' }: { lang?: string }) {
  const locale: DiagnosisLocale = lang === 'en' ? 'en' : 'es';
  const en = locale === 'en';
  const t = (es: string, english: string) => en ? english : es;
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const pending = useRef(false);
  const submitted = useRef('');
  const heading = useRef<HTMLHeadingElement>(null);
  const question = questions[step];
  const result = finished ? evaluate(answers) : null;
  const contactHref = en ? '/en#contact-section' : '/#contact-section';
  const serviceHref = `${en ? '/en' : ''}/services#service-${result?.nextStep === 'training' ? 'training' : result?.nextStep === 'implementation' ? 'implementation' : 'diagnosis'}`;

  function update(value: string) {
    setAnswers(current => current.map((answer, index) => index === step ? value : answer));
    setDownloaded(false);
  }
  function move(next: number) {
    setError('');
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidAnswer(question, answers[step])) return;
    if (step === questions.length - 1) {
      setFinished(true);
      requestAnimationFrame(() => heading.current?.focus());
    } else move(step + 1);
  }
  async function handleReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || !result) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lead: DiagnosisLead = { name: String(data.get('name') || '').trim(), company: String(data.get('company') || '').trim(), email: String(data.get('email') || '').trim() };
    if (!lead.name || !lead.company || !lead.email || data.get('permission') !== 'on') {
      setError(t('Completa los datos y confirma que quieres compartir tus respuestas.', 'Complete your details and confirm you want to share your answers.'));
      return;
    }
    pending.current = true;
    setBusy(true);
    setError('');
    setDownloaded(false);
    try {
      // Prepare the local PDF first. A failed asset download must not send a lead.
      const { buildDiagnosisReport } = await import('../lib/diagnosis-report');
      const doc = await buildDiagnosisReport(lead, answers, locale);
      const key = JSON.stringify({ lead, answers, locale });
      if (submitted.current !== key) {
        const response = await sendContactForm({ name: lead.name, email: lead.email, kind: 'diagnosis', message: `${t('Empresa', 'Company')}: ${lead.company}\n\n${diagnosisMessage(answers, locale)}` });
        if (!response.success) {
          setError(t('No hemos podido registrar la solicitud. Tus respuestas siguen aquí: inténtalo de nuevo o escríbenos a hello@tenbeltz.com.', 'We could not register the request. Your answers are still here: retry or email hello@tenbeltz.com.'));
          return;
        }
        submitted.current = key;
      }
      doc.save(en ? 'TenBeltz-business-AI-starting-point.pdf' : 'TenBeltz-primer-proceso-IA.pdf');
      setDownloaded(true);
    } catch {
      setError(t('No hemos podido preparar el PDF. Tus respuestas siguen aquí. Inténtalo de nuevo.', 'We could not prepare the PDF. Your answers are still here. Please retry.'));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return <section id="diagnostico-ia" className="diagnosis wrap home-section" aria-labelledby="diagnosis-title">
    <div className="diagnosis-intro">
      <span className="eyebrow">{t('Orientación de procesos', 'Workflow orientation')}</span>
      <h2 id="diagnosis-title">{t('Empieza por el trabajo de tu equipo.', 'Start with your team’s work.')}</h2>
      <p>{t('Diez preguntas para ordenar lo que os gustaría mejorar y preparar un siguiente paso. Puedes empezar aunque todavía no tengas un proyecto de IA.', 'Ten questions to organise what you would like to improve and prepare a next step. You can start even if you do not have an AI project yet.')}</p>
      <ul className="diagnosis-intro-list"><li>{t('Describe una necesidad y sus herramientas.', 'Describe a need and its tools.')}</li><li>{t('Revisa un resumen y las cuestiones por concretar.', 'Review a summary and the questions to clarify.')}</li><li>{t('Elige si quieres compartirlo y descargarlo en PDF.', 'Choose whether to share it and download a PDF.')}</li></ul>
      <p className="diagnosis-note">{t('Tus respuestas permanecen en esta página hasta que decidas compartirlas. No hace falta dejar datos para ver el resumen.', 'Your answers stay on this page until you choose to share them. You do not need to leave your details to see the summary.')}</p>
      <a className="text-link" href={contactHref}>{t('Prefiero hablar con el equipo', 'I would rather talk to the team')} ↗</a>
    </div>
    <div className="diagnosis-panel" aria-busy={busy}>
      {!result ? <form onSubmit={advance} className="diagnosis-question" data-diagnosis-step={question.id}>
        <div className="diagnosis-progress"><span>{t('Pregunta', 'Question')} {step + 1} / {questions.length}</span><span>{question.type === 'text' ? t('Opcional', 'Optional') : t('Una opción', 'One option')}</span></div>
        <progress max={questions.length} value={step + 1} aria-label={t('Progreso del cuestionario', 'Questionnaire progress')} />
        <h3 tabIndex={-1} ref={heading} id="diagnosis-question-title">{question.label[locale]}</h3>
        <p className="diagnosis-question-help" id="diagnosis-question-help">{question.help[locale]}</p>
        {question.type === 'choice' ? <fieldset disabled={!ready} aria-describedby="diagnosis-question-help"><legend className="sr-only">{question.label[locale]}</legend>{question.options.map(option => <label key={`${question.id}-${option.id}`} className={`diagnosis-option${answers[step] === option.id ? ' selected' : ''}`}><input type="radio" name={`diagnosis-${question.id}`} value={option.id} checked={answers[step] === option.id} onChange={() => update(option.id)} required /><span>{option.label[locale]}</span></label>)}</fieldset> : <div className="diagnosis-text-field"><label className="sr-only" htmlFor={`diagnosis-${question.id}`}>{question.label[locale]}</label><textarea id={`diagnosis-${question.id}`} name={question.id} value={answers[step]} onChange={event => update(event.target.value)} maxLength={question.maxLength} rows={4} disabled={!ready} aria-describedby="diagnosis-question-help diagnosis-character-count" /><span className="diagnosis-character-count" id="diagnosis-character-count">{answers[step].length} / {question.maxLength}</span></div>}
        <div className="diagnosis-actions"><button type="button" className="diagnosis-back" disabled={!ready || step === 0} onClick={() => move(step - 1)}>{t('Anterior', 'Back')}</button><button type="submit" className="button" disabled={!ready || !isValidAnswer(question, answers[step])}>{step === questions.length - 1 ? t('Ver mi resumen', 'See my summary') : question.type === 'text' && !answers[step].trim() ? t('Continuar sin completar', 'Continue without an answer') : t('Siguiente', 'Next')} →</button></div>
      </form> : <div className="diagnosis-result" data-diagnosis-result={result.nextStep}>
        <span className="eyebrow">{t('Tu punto de partida', 'Your starting point')}</span>
        <h3 ref={heading} tabIndex={-1}>{result.title[locale]}</h3>
        <p className="diagnosis-result-context">{result.description[locale]}</p>
        <dl className="diagnosis-summary">{[0, 2, 3, 8].map(index => <div key={questions[index].id}><dt>{questions[index].label[locale]}</dt><dd>{answerLabel(questions[index], answers[index], locale)}</dd></div>)}</dl>
        <div className="diagnosis-stage-route"><span className="eyebrow">{t('Siguiente conversación sugerida', 'Suggested next conversation')}</span><p className="diagnosis-route-title">{result.recommendation[locale]}</p><a className="text-link" href={serviceHref}>{t('Conocer esta forma de trabajar', 'Explore this way of working')} →</a></div>
        <h4>{t('Qué podéis preparar', 'What you can prepare')}</h4><ol className="diagnosis-priorities">{result.actions.map(action => <li key={action[locale]}>{action[locale]}</li>)}</ol>
        {result.clarify.length > 0 && <details className="diagnosis-clarify"><summary>{t('Cuestiones por concretar', 'Questions to clarify')} ({result.clarify.length})</summary><ul>{result.clarify.map(item => <li key={item[locale]}>{item[locale]}</li>)}</ul></details>}
        <details className="diagnosis-answers"><summary>{t('Revisar el resumen completo de respuestas', 'Review all your answers')}</summary><dl>{questions.map((item, index) => <div key={item.id}><dt>{item.label[locale]}</dt><dd>{answerLabel(item, answers[index], locale)}</dd></div>)}</dl></details>
        <p className="diagnosis-note">{t('Esta orientación organiza lo que has indicado. La viabilidad, el alcance y el presupuesto se estudian contigo; el tiempo declarado describe trabajo actual y no ahorro previsto.', 'This orientation organises what you have shared. Viability, scope and budget are reviewed with you; declared time describes current work, not expected savings.')}</p>
        <form className="diagnosis-lead" onSubmit={handleReport} aria-label={t('Compartir resumen y descargar PDF', 'Share your summary and download a PDF')}>
          <span className="eyebrow">{t('Llévalo a la próxima conversación', 'Bring it to the next conversation')}</span><h4>{t('Tu resumen de trabajo, en PDF.', 'Your workflow summary, as a PDF.')}</h4>
          <p>{t('Incluye tus respuestas, el siguiente paso sugerido y una hoja para preparar la revisión con tu equipo. Para descargarlo, comparte tus datos y respuestas con TenBeltz para que podamos comentarlo contigo.', 'Includes your answers, a suggested next step and a worksheet for a team review. To download it, share your details and answers with TenBeltz so we can discuss it with you.')}</p>
          <fieldset disabled={busy}><legend className="sr-only">{t('Datos de contacto y consentimiento', 'Contact details and consent')}</legend><div className="diagnosis-lead-fields">
            <div><label htmlFor="diagnosis-name">{t('Nombre', 'Name')}</label><input id="diagnosis-name" name="name" autoComplete="name" required maxLength={120} /></div>
            <div><label htmlFor="diagnosis-company">{t('Empresa', 'Company')}</label><input id="diagnosis-company" name="company" autoComplete="organization" required maxLength={160} /></div>
            <div><label htmlFor="diagnosis-email">{t('Email profesional', 'Work email')}</label><input id="diagnosis-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
          </div><label className="diagnosis-permission"><input type="checkbox" name="permission" required /><span>{t('Quiero compartir mis datos y estas respuestas con TenBeltz para que me contacte sobre el resultado.', 'I want to share my details and these answers with TenBeltz for follow-up about the result.')} <a href={en ? '/en/politicas' : '/politicas'} target="_blank" rel="noopener noreferrer">{t('Privacidad (nueva pestaña)', 'Privacy (new tab)')}</a></span></label><p className="diagnosis-note">{t('Sin suscripción a newsletter. El PDF se descarga aquí; no se envía por email.', 'No newsletter subscription. Your PDF downloads here; it is not emailed.')}</p><div className="diagnosis-actions"><button type="submit" className="button">{busy ? t('Preparando resumen…', 'Preparing summary…') : downloaded ? t('Descargar de nuevo', 'Download again') : t('Compartir y descargar PDF', 'Share and download PDF')} ↓</button></div></fieldset>
          <div aria-live="polite" aria-atomic="true">{downloaded && <p className="diagnosis-success">{t('Solicitud registrada. Tu PDF está preparado para descargar.', 'Request recorded. Your PDF is ready to download.')}</p>}</div>{error && <p role="alert" className="diagnosis-error">{error}</p>}
        </form>
        <div className="diagnosis-actions"><button type="button" className="diagnosis-back" disabled={busy} onClick={() => { setFinished(false); move(0); }}>{t('Editar mis respuestas', 'Edit my answers')}</button><a href={contactHref} className="text-link">{t('Hablemos de tu empresa', 'Let’s talk about your business')} ↗</a></div>
      </div>}
    </div>
  </section>;
}
