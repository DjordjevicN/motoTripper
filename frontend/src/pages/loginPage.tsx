import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { LogIn } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { useAppBootstrap } from '@/lib/api'
import { useCurrentAppUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const LoginPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const { pushToast } = useToast()
  const { authUser, isLoading } = useAuth()
  const { data } = useAppBootstrap()
  const resolvedUser = useCurrentAppUser(data?.users ?? [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setIsSubmitting(false)

    if (error) {
      pushToast({
        tone: 'error',
        title: 'Could not sign in',
        description: error.message,
      })
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['app-bootstrap'] })

    pushToast({
      tone: 'success',
      title: 'Signed in',
      description: 'Your rider session is active again.',
    })

    const nextPath = searchParams.get('next')
    navigate(nextPath || '/profile', { replace: true })
  }

  if (!isLoading && authUser) {
    return <Navigate to={resolvedUser ? `/profile/${resolvedUser.id}` : '/'} replace />
  }

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-40px)] max-w-[1600px] items-center py-8">
      <section className="grid w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-gradient-to-br from-primary/18 via-background to-background p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            MotoTripper access
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Sign in and keep your rider trust working for you
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Your rider profile, trust tier, saved urgent stops, and contribution
            history all live here.
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
            <div>
              <h2 className="text-2xl font-semibold">Welcome back</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the mock account fields below or replace them with any values.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
              />
            </label>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <LogIn className="size-4" />
              {isSubmitting ? 'Signing in...' : 'Log in'}
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <Link to="/reset-password" className="text-primary hover:opacity-80">
                Forgot password?
              </Link>
              <Link to="/signup" className="text-primary hover:opacity-80">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
