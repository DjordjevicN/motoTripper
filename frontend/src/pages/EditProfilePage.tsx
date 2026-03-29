import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Save } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@/components/auth/useAuth'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { updateUserProfile, useAppBootstrap } from '@/lib/api'
import { useCurrentAppUser } from '@/lib/auth'
import type {
  ExperienceLevel,
  MotorcycleType,
  PreferredStopStyle,
  RidingStyle,
  TypicalTripType,
  User,
} from '@/types'

const ridingStyles: RidingStyle[] = [
  'touring',
  'sport',
  'adventure',
  'commuter',
  'mixed',
]

const experienceLevels: ExperienceLevel[] = [
  'beginner',
  'intermediate',
  'experienced',
  'veteran',
]

const motorcycleTypes: MotorcycleType[] = [
  'sport',
  'naked',
  'touring',
  'adventure',
  'cruiser',
  'scooter',
  'other',
]

const tripTypes: TypicalTripType[] = [
  'day-rides',
  'weekend-trips',
  'multi-day-tours',
  'mixed',
]

const stopStyles: PreferredStopStyle[] = [
  'budget',
  'comfort',
  'secure-parking-first',
  'mixed',
]

type EditProfileForm = {
  email: string
  name: string
  location: string
  bio: string
  ridingStyle: RidingStyle
  experienceLevel: ExperienceLevel
  typicalTripType: TypicalTripType
  preferredStopStyle: PreferredStopStyle
  motorcycleBrand: string
  motorcycleModel: string
  motorcycleYear: string
  motorcycleType: MotorcycleType
  motorcycleEngineCc: string
}

const createFormState = (user: User): EditProfileForm => ({
  email: user.email ?? '',
  name: user.name,
  location: user.location ?? '',
  bio: user.bio ?? '',
  ridingStyle: user.ridingStyle ?? 'mixed',
  experienceLevel: user.experienceLevel ?? 'intermediate',
  typicalTripType: user.typicalTripType ?? 'mixed',
  preferredStopStyle: user.preferredStopStyle ?? 'mixed',
  motorcycleBrand: user.motorcycle?.brand ?? '',
  motorcycleModel: user.motorcycle?.model ?? '',
  motorcycleYear: user.motorcycle?.year?.toString() ?? '',
  motorcycleType: user.motorcycle?.type ?? 'other',
  motorcycleEngineCc: user.motorcycle?.engineCc?.toString() ?? '',
})

type EditProfileFormContentProps = {
  targetUserId: string
  user: User
}

const EditProfileFormContent = ({
  targetUserId,
  user,
}: EditProfileFormContentProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const [form, setForm] = useState<EditProfileForm>(() => createFormState(user))

  const handleChange = <K extends keyof EditProfileForm>(
    key: K,
    value: EditProfileForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const saveProfileMutation = useMutation({
    mutationFn: () =>
      updateUserProfile(targetUserId, {
        email: form.email.trim(),
        name: form.name.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        ridingStyle: form.ridingStyle,
        experienceLevel: form.experienceLevel,
        typicalTripType: form.typicalTripType,
        preferredStopStyle: form.preferredStopStyle,
        motorcycle: {
          brand: form.motorcycleBrand.trim(),
          model: form.motorcycleModel.trim(),
          year: form.motorcycleYear ? Number(form.motorcycleYear) : undefined,
          type: form.motorcycleType,
          engineCc: form.motorcycleEngineCc
            ? Number(form.motorcycleEngineCc)
            : undefined,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['app-bootstrap'] })
      pushToast({
        tone: 'success',
        title: 'Profile saved',
        description: 'Your rider profile and email were updated successfully.',
      })
    },
    onError: (error) => {
      pushToast({
        tone: 'error',
        title: 'Could not save profile',
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while saving your profile.',
      })
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveProfileMutation.mutate()
  }

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/profile/${targetUserId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to profile
        </Link>

        <Button variant="outline" onClick={() => navigate('/')}>
          Go home
        </Button>
      </div>

      <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.4)] backdrop-blur sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Edit rider profile
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Keep your rider identity current
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Update your core rider details, motorcycle setup, and account email
            from one place.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 xl:grid-cols-2">
          <section className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background/50 p-5">
            <h2 className="text-xl font-semibold">Basics</h2>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Name</span>
              <input
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Location</span>
              <input
                value={form.location}
                onChange={(event) => handleChange('location', event.target.value)}
                className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Bio</span>
              <textarea
                value={form.bio}
                onChange={(event) => handleChange('bio', event.target.value)}
                rows={5}
                className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
              />
            </label>
          </section>

          <section className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background/50 p-5">
            <h2 className="text-xl font-semibold">Rider identity</h2>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Riding style</span>
              <select
                value={form.ridingStyle}
                onChange={(event) =>
                  handleChange('ridingStyle', event.target.value as RidingStyle)
                }
                className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
              >
                {ridingStyles.map((option) => (
                  <option key={option} value={option}>
                    {option.replaceAll('-', ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Experience level</span>
              <select
                value={form.experienceLevel}
                onChange={(event) =>
                  handleChange(
                    'experienceLevel',
                    event.target.value as ExperienceLevel,
                  )
                }
                className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
              >
                {experienceLevels.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Typical trip type</span>
              <select
                value={form.typicalTripType}
                onChange={(event) =>
                  handleChange(
                    'typicalTripType',
                    event.target.value as TypicalTripType,
                  )
                }
                className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
              >
                {tripTypes.map((option) => (
                  <option key={option} value={option}>
                    {option.replaceAll('-', ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">
                Preferred stop style
              </span>
              <select
                value={form.preferredStopStyle}
                onChange={(event) =>
                  handleChange(
                    'preferredStopStyle',
                    event.target.value as PreferredStopStyle,
                  )
                }
                className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
              >
                {stopStyles.map((option) => (
                  <option key={option} value={option}>
                    {option.replaceAll('-', ' ')}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="space-y-4 rounded-[1.75rem] border border-border/70 bg-background/50 p-5 xl:col-span-2">
            <h2 className="text-xl font-semibold">Motorcycle</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Brand</span>
                <input
                  value={form.motorcycleBrand}
                  onChange={(event) =>
                    handleChange('motorcycleBrand', event.target.value)
                  }
                  className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Model</span>
                <input
                  value={form.motorcycleModel}
                  onChange={(event) =>
                    handleChange('motorcycleModel', event.target.value)
                  }
                  className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Year</span>
                <input
                  value={form.motorcycleYear}
                  onChange={(event) =>
                    handleChange('motorcycleYear', event.target.value)
                  }
                  className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Bike type</span>
                <select
                  value={form.motorcycleType}
                  onChange={(event) =>
                    handleChange(
                      'motorcycleType',
                      event.target.value as MotorcycleType,
                    )
                  }
                  className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
                >
                  {motorcycleTypes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Engine cc</span>
                <input
                  value={form.motorcycleEngineCc}
                  onChange={(event) =>
                    handleChange('motorcycleEngineCc', event.target.value)
                  }
                  className="w-full rounded-xl border border-border/70 bg-card px-4 py-3"
                />
              </label>
            </div>
          </section>

          <div className="xl:col-span-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Email, rider identity, and motorcycle details are now saved to the platform backend.
            </p>
            <Button type="submit" disabled={saveProfileMutation.isPending}>
              <Save className="size-4" />
              {saveProfileMutation.isPending ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </form>
      </section>
    </main>
  )
}

const EditProfilePage = () => {
  const { authUser } = useAuth()
  const { userId } = useParams()
  const { data, isLoading } = useAppBootstrap()
  const currentUser = useCurrentAppUser(data?.users ?? [])
  const targetUserId = userId ?? currentUser?.id ?? ''
  const user = useMemo(
    () =>
      data?.users.find((item) => item.id === targetUserId) ??
      currentUser ??
      null,
    [currentUser, data?.users, targetUserId],
  )

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">
        Loading profile editor...
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!authUser || !currentUser) {
    return <Navigate to="/login" replace />
  }

  if (targetUserId !== currentUser.id) {
    return <Navigate to={`/profile/${targetUserId}`} replace />
  }

  return (
    <EditProfileFormContent
      key={user.id}
      targetUserId={targetUserId}
      user={user}
    />
  )
}

export default EditProfilePage
