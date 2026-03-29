import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { UserPlus } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { createUser, useAppBootstrap } from '@/lib/api'
import { useCurrentAppUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const SignUpPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const { authUser, isLoading } = useAuth()
  const { data } = useAppBootstrap()
  const resolvedUser = useCurrentAppUser(data?.users ?? [])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedName = name.trim()

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: normalizedName,
        },
      },
    })

    if (error) {
      setIsSubmitting(false)
      pushToast({
        tone: 'error',
        title: 'Could not create account',
        description: error.message,
      })
      return
    }

    try {
      const response = await createUser({
        email: normalizedEmail,
        name: normalizedName,
      })

      await queryClient.invalidateQueries({ queryKey: ['app-bootstrap'] })

      pushToast({
        tone: 'success',
        title: 'Account created',
        description: signUpData.session
          ? 'Your rider account is ready. Complete your profile next.'
          : 'Check your email to verify the account, then sign in to continue.',
      })

      if (signUpData.session) {
        navigate(`/profile/${response.item.id}/edit`, { replace: true })
        return
      }

      navigate('/login', { replace: true })
    } catch (createUserError) {
      pushToast({
        tone: 'error',
        title: 'Account created but profile setup failed',
        description:
          createUserError instanceof Error
            ? createUserError.message
            : 'Supabase account exists, but the rider profile could not be prepared.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoading && authUser) {
    return <Navigate to={resolvedUser ? `/profile/${resolvedUser.id}` : '/'} replace />
  }

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-40px)] max-w-[1600px] items-center py-8">
      <section className="grid w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="bg-gradient-to-br from-amber-500/16 via-background to-background p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
            Join the rider network
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Build a profile riders can trust
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Start with the basics, then add your motorcycle, riding style, and
            contribution history as you use the platform.
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
            <div>
              <h2 className="text-2xl font-semibold">Create your account</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This is a mock signup flow for now.
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
              />
            </label>

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
                autoComplete="new-password"
                className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
              />
            </label>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <UserPlus className="size-4" />
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>

            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:opacity-80">
                Log in
              </Link>
            </p>

            <p className="text-sm text-muted-foreground">
              By creating an account, you agree to follow the platform{' '}
              <Link to="/rules" className="text-primary hover:opacity-80">
                rules and trust guidelines
              </Link>
              .
            </p>

            <div className="rounded-[1.5rem] border border-border/70 bg-background/55 p-4 text-sm text-muted-foreground">
              Listing a property instead?
              <Link to="/host/onboarding" className="ml-2 text-primary hover:opacity-80">
                Start host onboarding
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}

export default SignUpPage
