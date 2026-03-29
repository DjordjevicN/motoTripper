import { useState } from 'react'
import { ChevronLeft, Globe, MapPinned, Phone, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import HostFormSection from '@/components/host/HostFormSection'
import { Button } from '@/components/ui/button'
import Pill from '@/components/ui/pill'
import Tag from '@/components/ui/tag'
import type { CommunityPropertyDraft } from '@/types'

const defaultDraft: CommunityPropertyDraft = {
  propertyName: '',
  location: '',
  websiteUrl: '',
  phone: '',
  parkingNotes: '',
  summary: '',
  coveredParking: false,
  lateCheckIn: true,
  hasRiderPhotoProof: false,
}

const CommunityPropertyOnboardingPage = () => {
  const [draft, setDraft] = useState(defaultDraft)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = <K extends keyof CommunityPropertyDraft>(
    key: K,
    value: CommunityPropertyDraft[K],
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
  }

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">
      <div className="mb-6">
        <Link
          to="/profile/rider-current"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to profile
        </Link>
      </div>

      <section className="space-y-6">
        <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] sm:p-8">
          <Pill>Community-posted listing</Pill>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Add a place you stayed, even if the owner is not on the platform yet
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Riders can help the network by submitting places they have personally
            used. These are clearly marked as community-posted so they never
            conflict with official owner listings.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <HostFormSection
              title="Basic listing details"
              description="Share enough information for another rider to understand what the place is and how to contact it directly."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Property name</span>
                  <input
                    value={draft.propertyName}
                    onChange={(event) => handleChange('propertyName', event.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <input
                    value={draft.location}
                    onChange={(event) => handleChange('location', event.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Website</span>
                  <input
                    value={draft.websiteUrl}
                    onChange={(event) => handleChange('websiteUrl', event.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <input
                    value={draft.phone}
                    onChange={(event) => handleChange('phone', event.target.value)}
                    className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm text-muted-foreground">Why riders should know about it</span>
                <textarea
                  value={draft.summary}
                  onChange={(event) => handleChange('summary', event.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                />
              </label>
            </HostFormSection>

            <HostFormSection
              title="Parking notes"
              description="Be specific about what you personally experienced, especially if the place is not officially onboarded."
            >
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Parking notes</span>
                <textarea
                  value={draft.parkingNotes}
                  onChange={(event) => handleChange('parkingNotes', event.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
                />
              </label>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ['coveredParking', 'Covered parking'],
                  ['lateCheckIn', 'Late check-in possible'],
                  ['hasRiderPhotoProof', 'You have rider photo proof'],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={draft[key as keyof CommunityPropertyDraft] as boolean}
                      onChange={(event) =>
                        handleChange(
                          key as keyof CommunityPropertyDraft,
                          event.target.checked as CommunityPropertyDraft[keyof CommunityPropertyDraft],
                        )
                      }
                      className="size-4 rounded border-border/70"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </HostFormSection>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[1.75rem] border border-amber-500/25 bg-amber-500/10 p-5">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-amber-300" />
                <h2 className="text-xl font-semibold">Why this is different</h2>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-100/90">
                <li>It is clearly labeled as community-posted.</li>
                <li>It does not pretend to be an official host listing.</li>
                <li>It can link out to the property’s own website and phone.</li>
                <li>It can later become official if the owner joins the platform.</li>
              </ul>
            </section>

            <section className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
              <h2 className="text-xl font-semibold">Preview label</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag className="border-violet-500/35 bg-violet-500/10 text-violet-300">
                  Community posted
                </Tag>
                {draft.coveredParking ? (
                  <Tag className="border-sky-500/35 bg-sky-500/10 text-sky-300">
                    Covered parking
                  </Tag>
                ) : null}
              </div>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPinned className="size-4 text-primary" />
                  {draft.location || 'Set the location'}
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  {draft.websiteUrl || 'Add website link'}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" />
                  {draft.phone || 'Add property phone'}
                </p>
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full">
                  Save community listing draft
                </Button>
              </div>

              {submitted ? (
                <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  Mock community-posted listing saved. Next later step could be moderation,
                  duplicate checking, and inviting the owner to claim it officially.
                </p>
              ) : null}
            </section>
          </aside>
        </form>
      </section>
    </main>
  )
}

export default CommunityPropertyOnboardingPage
