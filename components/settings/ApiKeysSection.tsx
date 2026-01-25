"use client"

import * as React from "react"
import { Key, Eye, EyeOff, Check, X, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type AIProvider = "openai" | "anthropic" | "openrouter"

type ApiKeyStatus = Record<AIProvider, boolean>

type ProviderConfig = {
  name: string
  label: string
  placeholder: string
  description: string
  url: string
}

const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  openai: {
    name: "openai",
    label: "OpenAI",
    placeholder: "sk-...",
    description: "For GPT-4, GPT-3.5, and other OpenAI models",
    url: "https://platform.openai.com/api-keys",
  },
  anthropic: {
    name: "anthropic",
    label: "Anthropic",
    placeholder: "sk-ant-...",
    description: "For Claude models (Claude 3.5 Sonnet, etc.)",
    url: "https://console.anthropic.com/settings/keys",
  },
  openrouter: {
    name: "openrouter",
    label: "OpenRouter",
    placeholder: "sk-or-...",
    description: "Access multiple AI models through one API",
    url: "https://openrouter.ai/keys",
  },
}

type ApiKeysSectionProps = {
  className?: string
}

export function ApiKeysSection({ className }: ApiKeysSectionProps) {
  const [configured, setConfigured] = React.useState<ApiKeyStatus>({
    openai: false,
    anthropic: false,
    openrouter: false,
  })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch API key status on mount
  React.useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/user/api-keys")
      if (!response.ok) {
        throw new Error("Failed to fetch API key status")
      }
      const data = await response.json()
      setConfigured(data.configured)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load API keys")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold">API Keys (BYOK)</h2>
          <p className="text-sm text-muted-foreground">
            Bring Your Own Key: Use your own API keys for AI features
          </p>
        </div>

        {/* Security Notice */}
        <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="size-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Security Notice
              </p>
              <p className="text-xs text-orange-800 dark:text-orange-200">
                Your API keys are encrypted with AES-256-GCM before storage. They are never sent
                to our servers in plaintext and are only decrypted server-side when making AI API
                calls.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Object.keys(PROVIDERS).map((key) => (
              <div key={key} className="rounded-lg border p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(PROVIDERS).map(([key, provider]) => (
              <ProviderCard
                key={key}
                provider={key as AIProvider}
                config={provider}
                isConfigured={configured[key as AIProvider]}
                onUpdate={() => fetchStatus()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type ProviderCardProps = {
  provider: AIProvider
  config: ProviderConfig
  isConfigured: boolean
  onUpdate: () => void
}

function ProviderCard({ provider, config, isConfigured, onUpdate }: ProviderCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [apiKey, setApiKey] = React.useState("")
  const [showKey, setShowKey] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("API key cannot be empty")
      return
    }

    setError(null)
    setSaving(true)

    try {
      const response = await fetch("/api/user/api-keys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: apiKey.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save API key")
      }

      setApiKey("")
      setIsEditing(false)
      setShowKey(false)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save API key")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Remove ${config.label} API key?`)) {
      return
    }

    setError(null)
    setDeleting(true)

    try {
      const response = await fetch(`/api/user/api-keys?provider=${provider}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete API key")
      }

      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete API key")
    } finally {
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    setApiKey("")
    setIsEditing(false)
    setShowKey(false)
    setError(null)
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Key className="size-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{config.label}</h3>
              {isConfigured && !isEditing && (
                <Badge variant="secondary" className="text-xs">
                  <Check className="size-3 mr-1" />
                  Configured
                </Badge>
              )}
              {!isConfigured && !isEditing && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  <X className="size-3 mr-1" />
                  Not Set
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {!isEditing && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              {isConfigured ? "Update" : "Add Key"}
            </Button>
            {isConfigured && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="text-destructive hover:text-destructive"
              >
                {deleting ? "Removing..." : "Remove"}
              </Button>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <Label htmlFor={`${provider}-key`}>API Key</Label>
            <div className="relative">
              <Input
                id={`${provider}-key`}
                type={showKey ? "text" : "password"}
                placeholder={config.placeholder}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
              >
                {showKey ? (
                  <EyeOff className="size-4 text-muted-foreground" />
                ) : (
                  <Eye className="size-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a
                href={config.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {config.label}
              </a>
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Key"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
