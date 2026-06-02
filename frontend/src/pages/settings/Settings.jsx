/**
 * Settings — org-level configuration: CRM integration, LLM model, social connections.
 */
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Save, Plug, Bot, Share2, Key } from "lucide-react";

import { settingsApi } from "@/api/axios";
import Button from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

const GEMINI_MODELS = [
<<<<<<< HEAD
  { value: "gemini-2.0-flash",        label: "Gemini 2.0 Flash (rápido, bajo coste)" },
=======
  { value: "gemini-2.0-flash-lite",        label: "Gemini 2.0 Flash Lite (rápido, bajo coste)" },
>>>>>>> 298ebad (Actualizacion de datos)
  { value: "gemini-2.0-flash-thinking", label: "Gemini 2.0 Flash Thinking (razonamiento avanzado)" },
  { value: "gemini-2.0-flash",          label: "Gemini 2.0 Flash (contexto largo)" },
];

const SECTION = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
        <Icon size={16} className="text-primary-600" />
      </div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

const Field = ({ label, hint, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
    {children}
  </div>
);

export default function Settings() {
  const [form, setForm] = useState({
<<<<<<< HEAD
    llm: { model: "gemini-2.0-flash", temperature: 0.7, maxOutputTokens: 8192 },
=======
    llm: { model: "gemini-2.0-flash-lite", temperature: 0.7, maxOutputTokens: 8192 },
>>>>>>> 298ebad (Actualizacion de datos)
    crm: { provider: "none", apiKey: "", baseUrl: "" },
    socialConnections: [],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then((r) => r.data),
  });

  useEffect(() => {
    if (data) setForm((prev) => ({ ...prev, ...data }));
  }, [data]);

  const saveMut = useMutation({
    mutationFn: (d) => settingsApi.update(d),
    onSuccess: () => toast.success("Configuración guardada"),
    onError: () => toast.error("Error al guardar"),
  });

  const upd = (section, field) => (e) =>
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: e.target.value } }));

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-0.5">Ajusta integraciones, modelo de IA y conexiones sociales</p>
      </div>

      {/* LLM Settings */}
      <SECTION title="Modelo de IA (Gemini)" icon={Bot}>
        <Field label="Modelo" hint="El modelo de Gemini que se usará para generar todo el contenido.">
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={form.llm?.model}
            onChange={upd("llm", "model")}
          >
            {GEMINI_MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Temperatura" hint="0 = determinista, 1 = creativo">
            <input
              type="number" min={0} max={1} step={0.05}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.llm?.temperature ?? 0.7}
              onChange={upd("llm", "temperature")}
            />
          </Field>
          <Field label="Tokens de salida máximos">
            <input
              type="number" min={1024} max={65536} step={1024}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={form.llm?.maxOutputTokens ?? 8192}
              onChange={upd("llm", "maxOutputTokens")}
            />
          </Field>
        </div>
      </SECTION>

      {/* CRM Integration */}
      <SECTION title="Integración CRM" icon={Plug}>
        <Field label="Proveedor CRM">
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={form.crm?.provider ?? "none"}
            onChange={upd("crm", "provider")}
          >
            <option value="none">Sin CRM</option>
            <option value="hubspot">HubSpot</option>
            <option value="salesforce">Salesforce</option>
            <option value="pipedrive">Pipedrive</option>
            <option value="custom">API personalizada</option>
          </select>
        </Field>

        {form.crm?.provider !== "none" && (
          <>
            <Field label="API Key" hint="La clave se almacena cifrada.">
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-9 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form.crm?.apiKey ?? ""}
                  onChange={upd("crm", "apiKey")}
                  placeholder="••••••••••••"
                  autoComplete="off"
                />
              </div>
            </Field>
            {form.crm?.provider === "custom" && (
              <Field label="URL base de la API">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={form.crm?.baseUrl ?? ""}
                  onChange={upd("crm", "baseUrl")}
                  placeholder="https://api.mi-crm.com/v1"
                />
              </Field>
            )}
          </>
        )}
      </SECTION>

      {/* Social Connections */}
      <SECTION title="Conexiones sociales" icon={Share2}>
        <p className="text-sm text-gray-500 mb-4">
          Conecta tus redes para publicar contenido directamente desde la plataforma.
        </p>
        <div className="space-y-3">
          {[
            { id: "linkedin", label: "LinkedIn", color: "bg-blue-600" },
            { id: "twitter",  label: "Twitter / X", color: "bg-black" },
            { id: "instagram", label: "Instagram", color: "bg-pink-500" },
          ].map((net) => {
            const connected = (form.socialConnections ?? []).includes(net.id);
            return (
              <div key={net.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded ${net.color}`} />
                  <span className="text-sm font-medium text-gray-700">{net.label}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  connected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                }`}>
                  {connected ? "Conectado" : "No conectado"}
                </span>
              </div>
            );
          })}
          <p className="text-xs text-gray-400 mt-2">
            La autenticación OAuth se completará en el siguiente sprint.
          </p>
        </div>
      </SECTION>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          isLoading={saveMut.isPending}
          onClick={() => saveMut.mutate(form)}
          icon={<Save size={16} />}
        >
          Guardar configuración
        </Button>
      </div>
    </div>
  );
}
