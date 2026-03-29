import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { mockCurrentUserId } from '@/data/users/mockUsers'

const SignUpPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate(`/profile/${mockCurrentUserId}/edit`)
  }

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-40px)] max-w-none items-center py-8">
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
                className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
              />
            </label>

            <Button type="submit" className="w-full">
              <UserPlus className="size-4" />
              Create account
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
