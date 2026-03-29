import { useState } from 'react'
import { MailCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

const ResetPasswordPage = () => {
  const { pushToast } = useToast()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    })

    setIsSubmitting(false)

    if (error) {
      pushToast({
        tone: 'error',
        title: 'Could not send reset email',
        description: error.message,
      })
      return
    }

    setSent(true)
    pushToast({
      tone: 'success',
      title: 'Reset email sent',
      description: `Password reset instructions were sent to ${email.trim()}.`,
    })
  }

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-40px)] max-w-[1600px] items-center py-8">
      <section className="mx-auto w-full max-w-2xl rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Password reset
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Get back on the road quickly
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Enter your email and we’ll simulate sending a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
              />
            </label>

          <Button type="submit" disabled={isSubmitting}>
            <MailCheck className="size-4" />
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </Button>

          {sent ? (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              Reset instructions sent to {email || 'your email'}.
            </p>
          ) : null}

          <div className="text-sm text-muted-foreground">
            Remembered it?{' '}
            <Link to="/login" className="text-primary hover:opacity-80">
              Back to login
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}

export default ResetPasswordPage
