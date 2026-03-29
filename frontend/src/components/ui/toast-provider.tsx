import { useCallback, useMemo, useState, type PropsWithChildren } from 'react'

import {
  ToastContext,
  type ToastItem,
  type ToastTone,
} from './toast-context'

const toneStyles: Record<ToastTone, string> = {
  success: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-100',
  error: 'border-rose-500/35 bg-rose-500/10 text-rose-100',
  info: 'border-sky-500/35 bg-sky-500/10 text-sky-100',
}

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const pushToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const toastId = Date.now() + Math.floor(Math.random() * 1000)

    setToasts((current) => [...current, { id: toastId, ...toast }])

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toastId))
    }, 3500)
  }, [])

  const value = useMemo(
    () => ({
      pushToast,
    }),
    [pushToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.5)] backdrop-blur ${toneStyles[toast.tone]}`}
          >
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description ? (
              <p className="mt-1 text-sm opacity-90">{toast.description}</p>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
