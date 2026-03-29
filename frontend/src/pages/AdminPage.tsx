import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Ban,
  ChevronLeft,
  Pencil,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import Tag from '@/components/ui/tag'
import { useToast } from '@/components/ui/use-toast'
import {
  deleteProperty,
  deleteReview,
  deleteUser,
  updateProperty,
  updateUserModeration,
  useAppBootstrap,
} from '@/lib/api'
import { useCurrentAppUser } from '@/lib/auth'
import { getAllPropertyReviews } from '@/lib/reviews'
import type { PaidPromotionPlan, Property, User } from '@/types'

const EMPTY_USERS: User[] = []
const EMPTY_PROPERTIES: Property[] = []

const AdminPage = () => {
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const { data, isLoading, isError } = useAppBootstrap()
  const users = data?.users ?? EMPTY_USERS
  const properties = data?.properties ?? EMPTY_PROPERTIES
  const currentUser = useCurrentAppUser(users)
  const reviews = getAllPropertyReviews(properties)
  const [userSearch, setUserSearch] = useState('')
  const [propertySearch, setPropertySearch] = useState('')
  const [reviewSearch, setReviewSearch] = useState('')

  const invalidateApp = async () => {
    await queryClient.invalidateQueries({ queryKey: ['app-bootstrap'] })
  }

  const moderateUserMutation = useMutation({
    mutationFn: ({
      userId,
      isBanned,
      canLeaveReviews,
    }: {
      userId: string
      isBanned?: boolean
      canLeaveReviews?: boolean
    }) =>
      updateUserModeration(userId, {
        actorUserId: currentUser!.id,
        isBanned,
        canLeaveReviews,
      }),
    onSuccess: async () => {
      await invalidateApp()
      pushToast({
        tone: 'success',
        title: 'User updated',
        description: 'Moderation settings were updated successfully.',
      })
    },
    onError: (error) => {
      pushToast({
        tone: 'error',
        title: 'Could not update user',
        description: error instanceof Error ? error.message : 'Moderation failed.',
      })
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId, currentUser!.id),
    onSuccess: async () => {
      await invalidateApp()
      pushToast({
        tone: 'success',
        title: 'User deleted',
        description: 'The user and related content were removed.',
      })
    },
    onError: (error) => {
      pushToast({
        tone: 'error',
        title: 'Could not delete user',
        description: error instanceof Error ? error.message : 'Delete failed.',
      })
    },
  })

  const deletePropertyMutation = useMutation({
    mutationFn: (propertyId: string) => deleteProperty(propertyId, currentUser!.id),
    onSuccess: async () => {
      await invalidateApp()
      pushToast({
        tone: 'success',
        title: 'Property deleted',
        description: 'The listing was removed from the platform.',
      })
    },
    onError: (error) => {
      pushToast({
        tone: 'error',
        title: 'Could not delete property',
        description: error instanceof Error ? error.message : 'Delete failed.',
      })
    },
  })

  const updatePropertyMutation = useMutation({
    mutationFn: ({
      propertyId,
      paidPromotionPlan,
    }: {
      propertyId: string
      paidPromotionPlan: PaidPromotionPlan | null
    }) => {
      const property = properties.find((item) => item.id === propertyId)

      if (!property) {
        throw new Error('Property not found.')
      }

      return updateProperty(propertyId, {
        actorUserId: currentUser!.id,
        title: property.title,
        description: property.description,
        locationLabel: property.locationLabel,
        phone: property.phone,
        websiteUrl: property.websiteUrl,
        paidPromotionPlan,
      })
    },
    onSuccess: async () => {
      await invalidateApp()
      pushToast({
        tone: 'success',
        title: 'Promotion updated',
        description: 'Paid placement settings were saved successfully.',
      })
    },
    onError: (error) => {
      pushToast({
        tone: 'error',
        title: 'Could not update promotion',
        description: error instanceof Error ? error.message : 'Update failed.',
      })
    },
  })

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId, currentUser!.id),
    onSuccess: async () => {
      await invalidateApp()
      pushToast({
        tone: 'success',
        title: 'Review deleted',
        description: 'The review was removed successfully.',
      })
    },
    onError: (error) => {
      pushToast({
        tone: 'error',
        title: 'Could not delete review',
        description: error instanceof Error ? error.message : 'Delete failed.',
      })
    },
  })

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase()

    if (!query) {
      return users
    }

    return users.filter((user) =>
      [user.name, user.email ?? '', user.id]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [userSearch, users])

  const filteredProperties = useMemo(() => {
    const query = propertySearch.trim().toLowerCase()

    if (!query) {
      return properties
    }

    return properties.filter((property) =>
      [property.title, property.locationLabel, property.id]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [properties, propertySearch])

  const filteredReviews = useMemo(() => {
    const query = reviewSearch.trim().toLowerCase()

    if (!query) {
      return reviews
    }

    return reviews.filter((review) =>
      [review.id, review.title, review.content, review.userId, review.propertyId]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [reviewSearch, reviews])

  if (isLoading) {
    return <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">Loading admin dashboard...</main>
  }

  if (isError) {
    return <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">Could not load admin dashboard.</main>
  }

  if (!currentUser || currentUser.platformRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  const stats = {
    users: users.length,
    properties: properties.length,
    reviews: reviews.length,
    bannedUsers: users.filter((user) => user.isBanned).length,
    blockedReviewUsers: users.filter((user) => user.canLeaveReviews === false).length,
  }

  return (
    <main className="mx-auto min-h-screen w-[calc(100%-40px)] max-w-[1600px] py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/profile/${currentUser.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to profile
        </Link>
        <Tag className="border-amber-500/35 bg-amber-500/10 text-amber-300">
          Admin control center
        </Tag>
      </div>

      <section className="space-y-6">
        <section className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Platform oversight
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Manage riders, listings, and reviews from one place
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Search quickly, review behavior in a table, and moderate trust-critical
            activity without scanning long card lists.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:max-w-6xl">
          {[
            ['Users', stats.users],
            ['Properties', stats.properties],
            ['Reviews', stats.reviews],
            ['Banned users', stats.bannedUsers],
            ['Review-restricted', stats.blockedReviewUsers],
          ].map(([label, value]) => (
            <article
              key={label}
              className="rounded-[1.5rem] border border-border/70 bg-card/85 p-5 xl:min-w-0"
            >
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
            </article>
          ))}
        </section>

        <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search by rider name, email, or user ID.
                </p>
              </div>
            </div>

            <label className="flex min-w-[280px] items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search users by name, email, or ID"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/70">
            <table className="min-w-full divide-y divide-border/70 text-sm">
              <thead className="bg-background/70 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Reviews</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 bg-card/40">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                      {user.id}
                    </td>
                    <td className="px-4 py-4">
                      <Tag>{user.platformRole ?? 'rider'}</Tag>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.isBanned ? (
                          <Tag className="border-rose-500/35 bg-rose-500/10 text-rose-300">
                            Banned
                          </Tag>
                        ) : (
                          <Tag className="border-emerald-500/35 bg-emerald-500/10 text-emerald-300">
                            Active
                          </Tag>
                        )}
                        {user.canLeaveReviews === false ? (
                          <Tag className="border-amber-500/35 bg-amber-500/10 text-amber-300">
                            Reviews blocked
                          </Tag>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {user.reviewCount}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            moderateUserMutation.mutate({
                              userId: user.id,
                              isBanned: !user.isBanned,
                            })
                          }
                          disabled={user.id === currentUser.id}
                        >
                          <Ban className="size-4" />
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            moderateUserMutation.mutate({
                              userId: user.id,
                              canLeaveReviews: user.canLeaveReviews === false,
                            })
                          }
                          disabled={user.id === currentUser.id}
                        >
                          <Shield className="size-4" />
                          {user.canLeaveReviews === false
                            ? 'Allow reviews'
                            : 'Block reviews'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (window.confirm(`Delete ${user.name} and related content?`)) {
                              deleteUserMutation.mutate(user.id)
                            }
                          }}
                          disabled={user.id === currentUser.id}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">Properties</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Search by title, location, or property ID.
                  </p>
                </div>
              </div>
              <label className="flex min-w-[240px] items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={propertySearch}
                  onChange={(event) => setPropertySearch(event.target.value)}
                  placeholder="Search properties"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border/70">
              <table className="min-w-full divide-y divide-border/70 text-sm">
                <thead className="bg-background/70 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Promo</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 bg-card/40">
                  {filteredProperties.slice(0, 12).map((property) => (
                    <tr key={property.id}>
                      <td className="px-4 py-4">
                        <Link
                          to={`/properties/${property.id}`}
                          className="font-medium transition-opacity hover:opacity-80"
                        >
                          {property.title}
                        </Link>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {property.locationLabel}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Tag>{property.listingSource}</Tag>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                        {property.id}
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        {property.hostUserId ?? property.submittedByUserId ?? 'Unassigned'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <select
                            value={property.paidPromotionPlan ?? ''}
                            onChange={(event) =>
                              updatePropertyMutation.mutate({
                                propertyId: property.id,
                                paidPromotionPlan:
                                  event.target.value === ''
                                    ? null
                                    : (event.target.value as PaidPromotionPlan),
                              })
                            }
                            className="min-w-[148px] rounded-lg border border-border/70 bg-background px-3 py-2 text-xs"
                            disabled={updatePropertyMutation.isPending}
                          >
                            <option value="">No promo</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                          </select>
                          {property.isPaidPromotionActive &&
                          property.paidPromotionUntil ? (
                            <p className="text-[11px] text-amber-300">
                              Until{' '}
                              {new Date(
                                property.paidPromotionUntil,
                              ).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-[11px] text-muted-foreground">
                              Not promoted
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/admin/properties/${property.id}/edit`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border/70 bg-background px-3 text-sm font-medium transition-opacity hover:opacity-90"
                          >
                            <Pencil className="size-4" />
                            Edit
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (window.confirm(`Delete ${property.title}?`)) {
                                deletePropertyMutation.mutate(property.id)
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-border/70 bg-card/85 p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold">Reviews</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Search by review ID, rider ID, property ID, or text.
                    </p>
                  </div>
                </div>
                <label className="flex min-w-[240px] items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                  <Search className="size-4 text-muted-foreground" />
                  <input
                    value={reviewSearch}
                    onChange={(event) => setReviewSearch(event.target.value)}
                    placeholder="Search reviews"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </label>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border/70">
                <table className="min-w-full divide-y divide-border/70 text-sm">
                  <thead className="bg-background/70 text-left text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Review</th>
                      <th className="px-4 py-3 font-medium">User / Property</th>
                      <th className="px-4 py-3 font-medium">Scores</th>
                      <th className="px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70 bg-card/40">
                    {filteredReviews.slice(0, 12).map((review) => (
                      <tr key={review.id} className="align-top">
                        <td className="px-4 py-4">
                          <div className="font-medium">
                            {review.title || 'Untitled review'}
                          </div>
                          <div className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                            {review.content}
                          </div>
                          <div className="mt-2 font-mono text-[11px] text-muted-foreground">
                            {review.id}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs text-muted-foreground">
                          <div>User: {review.userId}</div>
                          <div className="mt-1">Property: {review.propertyId}</div>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          <div>{review.rating}/5 overall</div>
                          <div className="mt-1">{review.parkingSafetyRating}/5 parking</div>
                        </td>
                        <td className="px-4 py-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (window.confirm('Delete this review?')) {
                                deleteReviewMutation.mutate(review.id)
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default AdminPage
