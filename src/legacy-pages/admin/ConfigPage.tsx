// src/pages/admin/ConfigPage.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  TestTube,
  Globe,
  Mail,
  MessageSquare,
  CreditCard,
  Brain,
  AlertOctagon,
} from "lucide-react";

type IntegrationStatus = {
  configured: boolean;
  testing?: boolean;
  error?: string;
};

export default function ConfigPage() {
  const configStatus = useQuery(api.system.getConfigStatus);
  const testIntegration = useMutation(api.system.testIntegration);

  const [integrationStatus, setIntegrationStatus] = useState<{
    twilio: IntegrationStatus;
    stripe: IntegrationStatus;
    resend: IntegrationStatus;
    gemini: IntegrationStatus;
  }>({
    twilio: { configured: false },
    stripe: { configured: false },
    resend: { configured: false },
    gemini: { configured: false },
  });

  useEffect(() => {
    if (configStatus?.integrations) {
      setIntegrationStatus({
        twilio: { configured: configStatus.integrations.twilio },
        stripe: { configured: configStatus.integrations.stripe },
        resend: { configured: configStatus.integrations.resend },
        gemini: { configured: configStatus.integrations.gemini },
      });
    }
  }, [configStatus]);

  const handleTestIntegration = async (integration: "twilio" | "stripe" | "resend" | "gemini") => {
    setIntegrationStatus((prev) => ({
      ...prev,
      [integration]: { ...prev[integration], testing: true, error: undefined },
    }));

    try {
      const result = await testIntegration({ integration });
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration]: {
          configured: result.success,
          testing: false,
          error: result.error,
        },
      }));
    } catch (error: any) {
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration]: {
          configured: false,
          testing: false,
          error: error.message,
        },
      }));
    }
  };

  const handleReloadConfig = () => {
    window.location.reload();
  };

  const getEnvironmentLabel = () => {
    const env = configStatus?.environment || "unknown";
    const labels: Record<string, { label: string; color: string }> = {
      development: { label: "Development", color: "bg-green-500" },
      staging: { label: "Staging", color: "bg-yellow-500" },
      production: { label: "Production", color: "bg-red-500" },
      unknown: { label: "Unknown", color: "bg-gray-500" },
    };
    return labels[env] || labels.unknown;
  };

  const envInfo = getEnvironmentLabel();

  if (!configStatus) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-elite-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-800 rounded-sm flex items-center justify-center">
            <Settings className="w-5 h-5 text-elite-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
            <p className="text-sm text-slate-500">
              Monitor integrations, validate configuration, and test API connections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Environment Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-sm border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${envInfo.color}`} />
            <span className="text-xs font-medium text-white">{envInfo.label}</span>
          </div>

          {/* Config Status Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border ${
              configStatus.valid
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {configStatus.valid ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-xs font-medium ${
                configStatus.valid ? "text-green-700" : "text-red-700"
              }`}
            >
              {configStatus.valid ? "Config Valid" : "Config Invalid"}
            </span>
          </div>

          {/* Reload Button */}
          <button
            onClick={handleReloadConfig}
            className="flex items-center gap-2 px-4 py-2 bg-elite-600 text-white rounded-sm hover:bg-elite-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Reload</span>
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {!configStatus.valid && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-2">Configuration Errors</h3>
              <ul className="space-y-1">
                {configStatus.errors?.map((error, idx) => (
                  <li key={idx} className="text-sm text-red-700">
                    • {error}
                  </li>
                ))}
                {configStatus.missing?.map((missing, idx) => (
                  <li key={`missing-${idx}`} className="text-sm text-red-700">
                    • Missing: {missing}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {configStatus.warnings && configStatus.warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">Warnings</h3>
              <ul className="space-y-1">
                {configStatus.warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-yellow-700">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Twilio */}
        <IntegrationCard
          name="Twilio"
          description="SMS and voice integration for lead capture"
          icon={MessageSquare}
          status={integrationStatus.twilio}
          onTest={() => handleTestIntegration("twilio")}
          configured={configStatus.integrations?.twilio}
        />

        {/* Stripe */}
        <IntegrationCard
          name="Stripe"
          description="Payment processing and invoicing"
          icon={CreditCard}
          status={integrationStatus.stripe}
          onTest={() => handleTestIntegration("stripe")}
          configured={configStatus.integrations?.stripe}
        />

        {/* Resend */}
        <IntegrationCard
          name="Resend"
          description="Transactional email service"
          icon={Mail}
          status={integrationStatus.resend}
          onTest={() => handleTestIntegration("resend")}
          configured={configStatus.integrations?.resend}
        />

        {/* Gemini */}
        <IntegrationCard
          name="Gemini"
          description="AI content generation and copilot"
          icon={Brain}
          status={integrationStatus.gemini}
          onTest={() => handleTestIntegration("gemini")}
          configured={configStatus.integrations?.gemini}
        />
      </div>

      {/* Configuration Details */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Configuration Details</h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Environment</dt>
              <dd className="mt-1 text-sm text-slate-900">{configStatus.environment}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {configStatus.valid ? (
                  <span className="text-green-600 font-medium">Valid</span>
                ) : (
                  <span className="text-red-600 font-medium">Invalid</span>
                )}
              </dd>
            </div>
            {configStatus.lastValidated && (
              <div>
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Validated
                </dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(configStatus.lastValidated).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: any;
  status: IntegrationStatus;
  onTest: () => void;
  configured: boolean;
}

function IntegrationCard({
  name,
  description,
  icon: Icon,
  status,
  onTest,
  configured,
}: IntegrationCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-sm flex items-center justify-center ${
              configured ? "bg-green-100" : "bg-slate-100"
            }`}
          >
            <Icon className={`w-5 h-5 ${configured ? "text-green-600" : "text-slate-500"}`} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{name}</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>

        {configured ? (
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
        )}
      </div>

      {status.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
          <p className="text-xs text-red-700">{status.error}</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={onTest}
          disabled={status.testing || !configured}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status.testing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <TestTube className="w-4 h-4" />
              Test Connection
            </>
          )}
        </button>

        {configured && !status.testing && !status.error && (
          <span className="text-xs text-green-600 font-medium">Connected</span>
        )}
      </div>
    </div>
  );
}
