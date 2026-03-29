import {
  Bike,
  ChevronLeft,
  LogOut,
  MapPin,
  ShieldCheck,
  Star,
  Waypoints,
} from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@/components/auth/useAuth'
import ProfileStatCard from '@/components/profile/ProfileStatCard'
import { useToast } from '@/components/ui/use-toast'
import Pill from '@/components/ui/pill'
import Tag from '@/components/ui/tag'
import { useAppBootstrap } from '@/lib/api'
import { useCurrentAppUser } from '@/lib/auth'
import {
  formatContributionDate,
  getContributionSupportText,
  getTrustDescription,
  getUserProfileSummary,
} from '@/lib/profile'
import { getAllPropertyReviews } from '@/lib/reviews'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { signOut } = useAuth()
  const { pushToast } = useToast()
  const { data, isLoading, isError } = useAppBootstrap()
  const properties = data?.properties ?? []
  const users = data?.users ?? []
  const currentUser = useCurrentAppUser(users)
  const targetUserId = userId ?? currentUser?.id
  const allReviews = getAllPropertyReviews(properties)
  const profileSummary = getUserProfileSummary(
    targetUserId ?? '',
    users,
    allReviews,
    properties,
  )

  if (isLoading) {
    return <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-none py-8">Loading rider profile...</main>
  }

  if (isError) {
    return <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-none py-8">Could not load rider profile.</main>
  }

  if (!targetUserId) {
    return <Navigate to="/login" replace />
  }

  if (!profileSummary) {
    return <Navigate to="/" replace />
  }

  const { user, trustSummary, recentContributions, savedProperties, savedUrgentStops, recentViewedProperties } =
    profileSummary
  const resolvedUser = user

  const identityRows = [
    ['Riding style', resolvedUser.ridingStyle ?? 'Not set'],
    ['Experience', resolvedUser.experienceLevel ?? 'Not set'],
    ['Typical trips', resolvedUser.typicalTripType ?? 'Not set'],
    ['Preferred stops', resolvedUser.preferredStopStyle ?? 'Not set'],
  ]

  const motorcycle = resolvedUser.motorcycle

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-none py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to home
        </Link>
      </div>

      <section className="space-y-6">
        <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.4)] backdrop-blur sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <img
                src={resolvedUser.avatar}
                alt={resolvedUser.name}
                className="size-28 rounded-[1.75rem] border border-border/70 object-cover shadow-sm"
              />

              <div className="min-w-0 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className={trustSummary.badgeVariant}>
                    {trustSummary.trustLabel}
                  </Tag>
                  <Pill variant="secondary">Trust score {trustSummary.trustScore}</Pill>
                  {resolvedUser.level ? <Pill>{resolvedUser.level}</Pill> : null}
                </div>

                <div>
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {resolvedUser.name}
                  </h1>
                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {resolvedUser.location ?? 'Location not set'}
                  </p>
                </div>

                {resolvedUser.bio ? (
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {resolvedUser.bio}
                  </p>
                ) : null}

                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {getTrustDescription(trustSummary.trustTier)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <ProfileStatCard
                label="Helpful votes"
                value={resolvedUser.helpfulVotesReceived}
                supportingText="Community validation from riders who found these reviews useful."
              />
              <ProfileStatCard
                label="Parking confirmations"
                value={resolvedUser.parkingConfirmationCount}
                supportingText="Directly strengthens parking trust across the platform."
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Waypoints className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">Rider identity</h2>
            </div>

            <div className="space-y-3">
              {identityRows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl bg-background/60 px-4 py-3"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium capitalize text-foreground">
                    {String(value).replaceAll('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Bike className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">Motorcycle</h2>
            </div>

            {motorcycle ? (
              <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.5rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-background/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                    Current ride
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {motorcycle.brand}
                  </p>
                  <p className="mt-1 text-lg text-muted-foreground">
                    {motorcycle.model}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="mt-2 text-xl font-semibold">
                      {motorcycle.year ?? 'Unknown'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Bike type</p>
                    <p className="mt-2 text-xl font-semibold capitalize">
                      {motorcycle.type ?? 'Other'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Engine</p>
                    <p className="mt-2 text-xl font-semibold">
                      {motorcycle.engineCc ? `${motorcycle.engineCc} cc` : 'Unknown'}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Member since</p>
                    <p className="mt-2 text-xl font-semibold">
                      {resolvedUser.memberSince ?? 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No motorcycle details added yet.</p>
            )}
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Trust and contribution</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {getContributionSupportText(
                  resolvedUser.reviewCount,
                  resolvedUser.parkingConfirmationCount,
                  resolvedUser.helpfulVotesReceived,
                )}
              </p>
            </div>
            <Tag className={trustSummary.badgeVariant}>
              {trustSummary.trustLabel}
            </Tag>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <ProfileStatCard label="Trust score" value={trustSummary.trustScore} />
            <ProfileStatCard label="Reviews" value={resolvedUser.reviewCount} />
            <ProfileStatCard
              label="Parking confirmations"
              value={resolvedUser.parkingConfirmationCount}
            />
            <ProfileStatCard
              label="Photos added"
              value={resolvedUser.photoContributionCount}
            />
            <ProfileStatCard
              label="Helpful votes"
              value={resolvedUser.helpfulVotesReceived}
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">Recent contributions</h2>
            </div>

            <div className="space-y-3">
              {recentContributions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.propertyTitle} · {item.propertyLocation}
                      </p>
                    </div>
                    <Pill variant="secondary">
                      {formatContributionDate(item.createdAt)}
                    </Pill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <div className="space-y-6">
            {currentUser && user.id === currentUser.id ? (
              <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
                <h2 className="text-xl font-semibold">Profile actions</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Update your motorcycle, riding style, and practical trip preferences.
                </p>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/profile/${user.id}/edit`}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Edit profile
                    </Link>
                    <Link
                      to="/community/onboarding"
                      className="inline-flex h-10 items-center justify-center rounded-md border border-border/70 bg-background px-5 text-sm font-medium transition-opacity hover:opacity-90"
                    >
                      Add community-posted stay
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await signOut()
                        pushToast({
                          tone: 'success',
                          title: 'Logged out',
                          description: 'Your rider session has been closed.',
                        })
                        navigate('/login', { replace: true })
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-rose-500/25 bg-rose-500/10 px-5 text-sm font-medium text-rose-200 transition-opacity hover:opacity-90"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                </div>
              </article>
            ) : null}

            <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Star className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Saved stays</h2>
              </div>
              <div className="space-y-3">
                {savedProperties.map((property) => (
                  <Link
                    key={property.id}
                    to={`/properties/${property.id}`}
                    className="block rounded-2xl border border-border/70 bg-background/60 p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <p className="font-medium">{property.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.locationLabel}
                    </p>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
              <h2 className="text-xl font-semibold">Useful right now</h2>
              <div className="mt-4 space-y-3">
                {savedUrgentStops.map((property) => (
                  <Link
                    key={property.id}
                    to={`/properties/${property.id}`}
                    className="block rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <p className="font-medium">{property.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Saved urgent stop · {property.locationLabel}
                    </p>
                  </Link>
                ))}

                {recentViewedProperties.map((property) => (
                  <Link
                    key={property.id}
                    to={`/properties/${property.id}`}
                    className="block rounded-2xl border border-border/70 bg-background/60 p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <p className="font-medium">{property.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Recently viewed · {property.locationLabel}
                    </p>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  )
}

export default ProfilePage
