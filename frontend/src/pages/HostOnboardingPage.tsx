import { useState } from 'react'
import { ChevronLeft, Home, ShieldCheck, Upload } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import HostFormSection from '@/components/host/HostFormSection'
import HostStepCard from '@/components/host/HostStepCard'
import { Button } from '@/components/ui/button'
import Pill from '@/components/ui/pill'
import Tag from '@/components/ui/tag'
import type { HostOnboardingDraft } from '@/types'

const defaultDraft: HostOnboardingDraft = {
  propertyName: '',
  location: '',
  hostName: '',
  hostEmail: '',
  propertyType: 'guesthouse',
  unitCount: '3',
  nightlyPrice: '85',
  availableTonight: true,
  lateCheckIn: true,
  parkingType: 'covered-courtyard',
  parkingSpaces: '2',
  coveredParking: true,
  cameraCoverage: true,
  gatedAccess: true,
  trailerFriendly: false,
  motoWashStation: false,
  gearDryingArea: true,
  photoProofReady: true,
  summary: '',
  standoutFeatures: 'Secure courtyard, late check-in, drying corner',
}

const hostSteps = [
  {
    step: 'Step 1',
    title: 'Describe the stay',
    description: 'Basic property context, location, and how the stop works for tired riders.',
  },
  {
    step: 'Step 2',
    title: 'Explain the parking',
    description: 'This is the heart of host onboarding: where the bike goes, how it is protected, and what proof you can provide.',
  },
  {
    step: 'Step 3',
    title: 'Preview your rider pitch',
    description: 'Hosts do not buy trust here. They earn interest by clearly explaining the stay and preparing for rider confirmation later.',
  },
]

const HostOnboardingPage = () => {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<HostOnboardingDraft>(defaultDraft)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = <K extends keyof HostOnboardingDraft>(
    key: K,
    value: HostOnboardingDraft[K],
  ) => {
    setSubmitted(false)
    setDraft((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    navigate('/host/dashboard?created=1')
  }

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">
      <div className="mb-6">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to landing
        </Link>
      </div>

      <section className="space-y-6">
        <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
            <div>
              <Pill>Host onboarding</Pill>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                List a rider-friendly property the right way
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                This host flow is built around one promise: riders should feel safe
                leaving the bike overnight. Your listing can stand out later by
                making parking details clear and earning trust through real rider
                confirmations.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-amber-500/25 bg-amber-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Important
              </p>
              <p className="mt-3 text-sm leading-7 text-amber-100/90">
                Verified Safe Parking is not purchased by hosts. This onboarding only
                helps you present strong parking conditions and prepare the stay for
                rider trust to be earned later.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-3">
          {hostSteps.map((item) => (
            <HostStepCard key={item.step} {...item} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-6">
            <HostFormSection
              title="Property basics"
              description="Start with the essentials that help riders understand where the stay is and what kind of stop it offers."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Property name</span>
                  <input
                    value={draft.propertyName}
                    onChange={(event) => handleChange('propertyName', event.target.value)}
                    placeholder="Example: Rider Courtyard Stay"
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <input
                    value={draft.location}
                    onChange={(event) => handleChange('location', event.target.value)}
                    placeholder="Belgrade, Serbia"
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Host name</span>
                  <input
                    value={draft.hostName}
                    onChange={(event) => handleChange('hostName', event.target.value)}
                    placeholder="Nikola"
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Host email</span>
                  <input
                    type="email"
                    value={draft.hostEmail}
                    onChange={(event) => handleChange('hostEmail', event.target.value)}
                    placeholder="host@example.com"
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Property type</span>
                  <select
                    value={draft.propertyType}
                    onChange={(event) =>
                      handleChange(
                        'propertyType',
                        event.target.value as HostOnboardingDraft['propertyType'],
                      )
                    }
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="guesthouse">Guesthouse</option>
                    <option value="motel">Motel</option>
                    <option value="cabin">Cabin</option>
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Nightly price</span>
                  <input
                    value={draft.nightlyPrice}
                    onChange={(event) => handleChange('nightlyPrice', event.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Units available</span>
                  <input
                    value={draft.unitCount}
                    onChange={(event) => handleChange('unitCount', event.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm text-muted-foreground">Short summary</span>
                <textarea
                  value={draft.summary}
                  onChange={(event) => handleChange('summary', event.target.value)}
                  rows={4}
                  placeholder="Describe why this stay works for riders, especially when they need to stop quickly."
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                />
              </label>
            </HostFormSection>

            <HostFormSection
              title="Parking and rider readiness"
              description="This is the most important part. Explain where the bike goes, how it is protected, and what practical support you offer."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Parking type</span>
                  <select
                    value={draft.parkingType}
                    onChange={(event) =>
                      handleChange(
                        'parkingType',
                        event.target.value as HostOnboardingDraft['parkingType'],
                      )
                    }
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  >
                    <option value="private-garage">Private garage</option>
                    <option value="covered-courtyard">Covered courtyard</option>
                    <option value="driveway">Driveway</option>
                    <option value="street">Street parking</option>
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Parking spaces</span>
                  <input
                    value={draft.parkingSpaces}
                    onChange={(event) => handleChange('parkingSpaces', event.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['availableTonight', 'Available tonight'],
                  ['lateCheckIn', 'Late check-in possible'],
                  ['coveredParking', 'Covered parking'],
                  ['cameraCoverage', 'Camera coverage'],
                  ['gatedAccess', 'Gated access'],
                  ['trailerFriendly', 'Trailer friendly'],
                  ['motoWashStation', 'Moto wash station'],
                  ['gearDryingArea', 'Gear drying area'],
                  ['photoProofReady', 'Parking photo proof ready'],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={draft[key as keyof HostOnboardingDraft] as boolean}
                      onChange={(event) =>
                        handleChange(
                          key as keyof HostOnboardingDraft,
                          event.target.checked as HostOnboardingDraft[keyof HostOnboardingDraft],
                        )
                      }
                      className="size-4 rounded border-border/70"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm text-muted-foreground">
                  Standout rider features
                </span>
                <textarea
                  value={draft.standoutFeatures}
                  onChange={(event) =>
                    handleChange('standoutFeatures', event.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                />
              </label>
            </HostFormSection>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)]">
              <div className="flex items-center gap-2">
                <Home className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Listing preview</h2>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
                <div className="flex flex-wrap gap-2">
                  {draft.coveredParking ? (
                    <Tag className="border-sky-500/35 bg-sky-500/10 text-sky-300">
                      Covered parking
                    </Tag>
                  ) : (
                    <Tag>Parking available</Tag>
                  )}
                  {draft.gatedAccess ? (
                    <Tag className="border-amber-500/35 bg-amber-500/10 text-amber-300">
                      Gated access
                    </Tag>
                  ) : null}
                  {draft.photoProofReady ? (
                    <Tag className="border-emerald-500/35 bg-emerald-500/10 text-emerald-300">
                      Parking photos ready
                    </Tag>
                  ) : null}
                  <Tag>{draft.unitCount} units</Tag>
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                  {draft.propertyName || 'Your rider-friendly property'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {draft.location || 'Set your location'}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {draft.summary ||
                    'Add a short rider-focused summary so guests immediately understand why your stop works for motorcycles.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {draft.standoutFeatures
                    .split(',')
                    .map((feature) => feature.trim())
                    .filter(Boolean)
                    .slice(0, 4)
                    .map((feature) => (
                      <Tag key={feature}>{feature}</Tag>
                    ))}
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-amber-500/25 bg-amber-500/10 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-amber-300" />
                <h2 className="text-xl font-semibold">How trust is earned</h2>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-100/90">
                <li>Riders later confirm whether parking actually felt safe.</li>
                <li>High-trust riders influence parking verification more strongly.</li>
                <li>Photo evidence helps properties earn stronger parking badges.</li>
                <li>Conflicting rider feedback prevents full verification.</li>
              </ul>
            </section>

            <section className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
              <div className="flex items-center gap-2">
                <Upload className="size-5 text-primary" />
                <h2 className="text-xl font-semibold">Submit mock listing</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This frontend flow does not publish yet. It simulates how a host
                would prepare a rider-focused listing before backend integration.
              </p>
              <div className="mt-5">
                <Button type="submit" className="w-full">
                  Save onboarding draft
                </Button>
              </div>
              {submitted ? (
                <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  Mock host onboarding saved. Next later step would be photo upload,
                  rider-facing preview, and review before publishing.
                </p>
              ) : null}
            </section>
          </aside>
        </form>
      </section>
    </main>
  )
}

export default HostOnboardingPage
