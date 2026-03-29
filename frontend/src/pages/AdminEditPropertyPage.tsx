import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Pencil, Trash2 } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import Tag from '@/components/ui/tag'
import { useToast } from '@/components/ui/use-toast'
import { deleteProperty, updateProperty, useAppBootstrap } from '@/lib/api'
import { useCurrentAppUser } from '@/lib/auth'
import type { PaidPromotionPlan, Property, User } from '@/types'

const EMPTY_USERS: User[] = []
const EMPTY_PROPERTIES: Property[] = []

type AdminEditPropertyFormProps = {
  property: Property
  actorUserId: string
}

const AdminEditPropertyForm = ({
  property,
  actorUserId,
}: AdminEditPropertyFormProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const [form, setForm] = useState({
    title: property.title,
    description: property.description,
    locationLabel: property.locationLabel,
    phone: property.phone,
    websiteUrl: property.websiteUrl ?? '',
    paidPromotionPlan: (property.paidPromotionPlan ?? null) as PaidPromotionPlan | null,
  })

  const invalidateApp = async () => {
    await queryClient.invalidateQueries({ queryKey: ['app-bootstrap'] })
  }

  const updatePropertyMutation = useMutation({
    mutationFn: () =>
      updateProperty(property.id, {
        actorUserId,
        ...form,
      }),
    onSuccess: async () => {
      await invalidateApp()
      pushToast({
        tone: 'success',
        title: 'Property updated',
        description: 'The host listing was updated successfully.',
      })
      navigate('/admin', { replace: true })
    },
    onError: (error) => {
      pushToast({
        tone: 'error',
        title: 'Could not update property',
        description: error instanceof Error ? error.message : 'Update failed.',
      })
    },
  })

  const deletePropertyMutation = useMutation({
    mutationFn: () => deleteProperty(property.id, actorUserId),
    onSuccess: async () => {
      await invalidateApp()
      pushToast({
        tone: 'success',
        title: 'Property deleted',
        description: 'The listing was removed from the platform.',
      })
      navigate('/admin', { replace: true })
    },
    onError: (error) => {
      pushToast({
        tone: 'error',
        title: 'Could not delete property',
        description: error instanceof Error ? error.message : 'Delete failed.',
      })
    },
  })

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <article className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] sm:p-8">
        <div className="flex items-center gap-2">
          <Pencil className="size-5 text-primary" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Host support edit
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Edit property setup for the host
            </h1>
          </div>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            updatePropertyMutation.mutate()
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Title</span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Location</span>
            <input
              value={form.locationLabel}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  locationLabel: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Paid promotion</span>
            <select
              value={form.paidPromotionPlan ?? ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  paidPromotionPlan:
                    event.target.value === ''
                      ? null
                      : (event.target.value as PaidPromotionPlan),
                }))
              }
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
            >
              <option value="">No paid placement</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Phone</span>
            <input
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({ ...current, phone: event.target.value }))
              }
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Website</span>
            <input
              value={form.websiteUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  websiteUrl: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-muted-foreground">Description</span>
            <textarea
              rows={8}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-3"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={updatePropertyMutation.isPending}>
              {updatePropertyMutation.isPending ? 'Saving...' : 'Save property'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </article>

      <article className="rounded-[2rem] border border-border/70 bg-card/85 p-6">
        <h2 className="text-xl font-semibold">Current listing info</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <p className="font-medium">{property.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {property.locationLabel}
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {property.id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Tag>{property.listingSource}</Tag>
            {property.hostUserId ? <Tag>Official host listing</Tag> : null}
            {property.submittedByUserId ? <Tag>Community posted</Tag> : null}
            {property.isPaidPromotionActive ? (
              <Tag className="border-amber-500/35 bg-amber-500/10 text-amber-300">
                Paid promo active
              </Tag>
            ) : null}
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-sm font-medium text-amber-200">
              Paid placement is admin-controlled.
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-100/80">
              If enabled, the property appears before non-paid stays whenever it
              still matches active filters, and it can be featured on the landing
              page as promo inventory.
            </p>
            {property.isPaidPromotionActive && property.paidPromotionUntil ? (
              <p className="mt-2 text-xs text-amber-200/80">
                Current placement runs until{' '}
                {new Date(property.paidPromotionUntil).toLocaleDateString()}.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-sm leading-6 text-rose-100/90">
              Use delete only if the listing is duplicate, abusive, or completely
              wrong. For normal host support, save edits instead.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => {
                if (window.confirm(`Delete ${property.title}?`)) {
                  deletePropertyMutation.mutate()
                }
              }}
              disabled={deletePropertyMutation.isPending}
            >
              <Trash2 className="size-4" />
              {deletePropertyMutation.isPending ? 'Deleting...' : 'Delete property'}
            </Button>
          </div>
        </div>
      </article>
    </section>
  )
}

const AdminEditPropertyPage = () => {
  const { propertyId } = useParams()
  const { data, isLoading, isError } = useAppBootstrap()
  const users = data?.users ?? EMPTY_USERS
  const properties = data?.properties ?? EMPTY_PROPERTIES
  const currentUser = useCurrentAppUser(users)
  const property = useMemo(
    () => properties.find((item) => item.id === propertyId) ?? null,
    [properties, propertyId],
  )

  if (isLoading) {
    return <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">Loading property editor...</main>
  }

  if (isError) {
    return <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">Could not load property editor.</main>
  }

  if (!currentUser || currentUser.platformRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  if (!property) {
    return <Navigate to="/admin" replace />
  }

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to admin
        </Link>
        <Tag className="border-amber-500/35 bg-amber-500/10 text-amber-300">
          Admin property editor
        </Tag>
      </div>

      <AdminEditPropertyForm property={property} actorUserId={currentUser.id} />
    </main>
  )
}

export default AdminEditPropertyPage
