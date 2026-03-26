import { useState } from 'react'
import { MailCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-40px)] max-w-none items-center py-8">
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
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
            />
          </label>

          <Button type="submit">
            <MailCheck className="size-4" />
            Send reset link
          </Button>

          {sent ? (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              Reset instructions sent to {email || 'your email'} in this mock flow.
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
