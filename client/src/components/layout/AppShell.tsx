import type { PropsWithChildren } from 'react'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen w-full bg-background pt-5 pb-8 flex justify-center">
      <div className="w-full max-w-[420px] flex flex-col gap-5 px-4">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-xl">Markets</h1>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">beta</span>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="text-center text-[11px] text-white/40">Powered by Polymarket</footer>
      </div>
    </div>
  )
}


