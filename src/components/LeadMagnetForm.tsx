import React, { useEffect, useMemo, useState } from "react";
import Alert, { type AlertProps } from "./Alert";
import { ScrollReveal } from "./ScrollReveal";

type LeadMagnetField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "url" | "tel";
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

type LeadMagnet = {
  id: number;
  title: string;
  description?: string;
  fields: LeadMagnetField[];
  file_name?: string | null;
  file_size?: number | null;
  file_extension?: string | null;
  file_url?: string | null;
};

const API_BASE = "https://api.tenbeltz.com/communications";

function formatFileSize(value?: number | null) {
  if (!value) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function getPreviewLabel(extension?: string | null) {
  if (!extension) return "Recurso";
  return extension.toUpperCase();
}

function getPreviewKind(extension?: string | null) {
  const ext = extension?.toLowerCase();
  if (!ext) return "unknown";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["pdf"].includes(ext)) return "pdf";
  if (["ppt", "pptx"].includes(ext)) return "ppt";
  return "unknown";
}

export default function LeadMagnetForm({
  magnetId,
  downloadToken,
}: {
  magnetId: string;
  downloadToken?: string;
}) {
  const [leadMagnet, setLeadMagnet] = useState<LeadMagnet | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [email, setEmail] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`${API_BASE}/lead-magnets/${magnetId}/`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("No se pudo cargar el contenido.");
        }
        return response.json();
      })
      .then((data: LeadMagnet) => {
        if (isMounted) {
          setLeadMagnet(data);
          setFieldValues(
            (data.fields || []).reduce((acc, field) => {
              acc[field.key] = "";
              return acc;
            }, {} as Record<string, string>),
          );
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err.message || "Error al cargar el contenido.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [magnetId]);

  const fields = useMemo(() => leadMagnet?.fields || [], [leadMagnet]);
  const downloadUrl = downloadToken
    ? `${API_BASE}/lead-magnets/download/${downloadToken}/`
    : null;
  const isDownloadReady = Boolean(downloadToken);
  const previewKind = getPreviewKind(leadMagnet?.file_extension);

  const handleDownload = async () => {
    if (!downloadUrl) return;
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("No se pudo descargar el archivo.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = leadMagnet?.file_name || "contenido";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al descargar.";
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Error",
        message,
      });
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!leadMagnet) return;

    if (!acceptedPolicy) {
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Falta el consentimiento",
        message: "Debes aceptar las políticas para continuar.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/lead-magnets/${leadMagnet.id}/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          accepted_policy: acceptedPolicy,
          fields: fieldValues,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const rawMessage = data?.detail || data?.fields || "No se pudo enviar el formulario.";
        let message = "";
        if (typeof rawMessage === "string") {
          message = rawMessage;
        } else if (Array.isArray(rawMessage)) {
          message = rawMessage.join(" ");
        } else if (rawMessage && typeof rawMessage === "object") {
          message = Object.values(rawMessage).flat().join(" ");
        } else {
          message = "No se pudo enviar el formulario.";
        }
        throw new Error(message);
      }

      setAlert({
        id: Date.now(),
        type: "success",
        title: "Listo",
        message: "Te hemos enviado un enlace de descarga a tu email.",
      });
      setEmail("");
      setAcceptedPolicy(false);
      setFieldValues((prev) =>
        Object.keys(prev).reduce((acc, key) => {
          acc[key] = "";
          return acc;
        }, {} as Record<string, string>),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado.";
      setAlert({
        id: Date.now(),
        type: "error",
        title: "Error",
        message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-y-6">
        <ScrollReveal className="flex flex-col gap-y-4">
          <span className="text-sm font-semibold tracking-[0.2em] text-pheromone-purple/80">
            CONTENIDO GRATUITO
          </span>
          <h1 className="text-4xl font-extrabold lg:text-5xl">
            {loading ? "Cargando contenido..." : leadMagnet?.title || "Contenido premium"}
          </h1>
          <p className="text-lg text-slate-300">
            {leadMagnet?.description ||
              "Completa el formulario y recibe el material por email en minutos."}
          </p>
        </ScrollReveal>
        <ScrollReveal className="grid gap-4 md:grid-cols-2">
          {[
            "Acceso inmediato por email",
            "Contenido aplicable a IA en SaaS",
            "Guías y plantillas listas para usar",
            "Enfoque en producción y escalabilidad",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-lg border border-pheromone-purple/30 bg-[#0B0122CC]/80 px-4 py-3"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-pheromone-purple"></span>
              <span className="text-sm text-slate-300">{item}</span>
            </div>
          ))}
        </ScrollReveal>
      </div>

      <ScrollReveal className="flex flex-col h-full px-6 py-7 transition-all backdrop-blur-[1px] rounded-lg bg-[#0B0122CC]/80 gap-y-6 border border-pheromone-purple/30">
        <div>
          <h2 className="text-2xl font-semibold">
            {isDownloadReady ? "Tu acceso está verificado" : "Accede al contenido"}
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {isDownloadReady
              ? "Descarga el contenido desde el botón inferior. El enlace es personal y seguro."
              : "Completa el formulario y te enviaremos el acceso directo por email."}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-300">{error}</p>
        )}

        {leadMagnet?.file_name && (
          <div className="flex items-center gap-4 rounded-lg border border-pheromone-purple/20 bg-[#0B0122]/60 px-4 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pheromone-purple/20 text-sm font-semibold text-pheromone-purple">
              {getPreviewLabel(leadMagnet.file_extension)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{leadMagnet.file_name}</span>
              <span className="text-xs text-slate-400">{formatFileSize(leadMagnet.file_size)}</span>
            </div>
          </div>
        )}

        {isDownloadReady && leadMagnet?.file_url && (
          <div className="overflow-hidden rounded-xl border border-pheromone-purple/20 bg-black/30">
            {previewKind === "image" && (
              <img
                src={leadMagnet.file_url}
                alt={leadMagnet.title}
                className="w-full max-h-64 object-cover"
              />
            )}
            {previewKind === "video" && (
              <video controls className="w-full max-h-64 bg-black">
                <source src={leadMagnet.file_url} />
              </video>
            )}
            {previewKind === "pdf" && (
              <iframe
                src={leadMagnet.file_url}
                className="w-full h-72 bg-black"
                title="Preview PDF"
              />
            )}
            {previewKind === "ppt" && (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                  leadMagnet.file_url,
                )}`}
                className="w-full h-72 bg-black"
                title="Preview PPT"
              />
            )}
            {previewKind === "unknown" && (
              <div className="px-4 py-6 text-sm text-slate-400">
                Vista previa no disponible para este formato.
              </div>
            )}
          </div>
        )}

        {isDownloadReady ? (
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-pheromone-purple/20 bg-[#0B0122]/60 px-4 py-3 text-sm text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-pheromone-purple"></span>
              Enlace verificado. Descarga disponible para este email.
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="btn bg-pheromone-purple hover:bg-sapphire-siren text-white text-center font-semibold"
            >
              Descargar contenido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
            <label className="flex flex-col gap-y-2 text-sm font-semibold">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
                placeholder="tu@email.com"
              />
            </label>

            {fields.map((field) => (
              <label key={field.key} className="flex flex-col gap-y-2 text-sm font-semibold">
                {field.label}
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    required={Boolean(field.required)}
                    value={fieldValues[field.key] || ""}
                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                    className="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
                    placeholder={field.placeholder || ""}
                  />
                ) : field.type === "select" ? (
                  <select
                    required={Boolean(field.required)}
                    value={fieldValues[field.key] || ""}
                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                    className="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
                  >
                    <option value="">Selecciona una opción</option>
                    {(field.options || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    required={Boolean(field.required)}
                    value={fieldValues[field.key] || ""}
                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                    className="px-3 py-2 text-white transition-colors border rounded-md border-berry-blackmail bg-berry-blackmail focus:border-petal-plush focus-visible:outline-none"
                    placeholder={field.placeholder || ""}
                  />
                )}
              </label>
            ))}

            <label className="flex items-start gap-3 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={acceptedPolicy}
                onChange={(event) => setAcceptedPolicy(event.target.checked)}
                className="mt-1"
                required
              />
              <span>
                Acepto las políticas de uso y privacidad. Esta información se almacenará con fines comerciales para enviarte
                ofertas o contenido informativo y no se compartirá con terceros.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || submitting}
              className="btn bg-pheromone-purple hover:bg-sapphire-siren text-white text-center font-semibold disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Recibir contenido"}
            </button>
          </form>
        )}
      </ScrollReveal>

      {alert && <Alert {...alert} />}
    </div>
  );
}
