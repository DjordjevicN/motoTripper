export function AppPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-12 sm:px-10">
      <section className="w-full rounded-[2rem] border border-border/60 bg-card/85 p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
          /app
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Route placeholder
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          This route is here so the router setup is already doing real work. We
          can turn it into the first authenticated or feature page next.
        </p>
      </section>
    </main>
  )
}
