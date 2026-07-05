import { useState, type FormEvent } from 'react'

import { PageTransition } from '@/components/common/PageTransition'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface SetupAccessGateProps {
  onUnlock: (passcode: string) => boolean
}

export const SetupAccessGate = ({ onUnlock }: SetupAccessGateProps) => {
  const [passcode, setPasscode] = useState('')
  const [hasError, setHasError] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!onUnlock(passcode)) {
      setHasError(true)
    }
  }

  return (
    <PageTransition className="page-container grid min-h-[calc(100vh-5rem)] w-full place-items-center py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-brand-300/20 bg-brand-300/[0.08] text-brand-200">
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="16" height="11" x="4" y="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            دخول إعداد النتائج
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            أدخل رمز الدخول لتعديل النتائج.
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <Input
            name="setupPasscode"
            type="password"
            label="رمز الدخول"
            value={passcode}
            autoComplete="current-password"
            autoFocus
            aria-invalid={hasError}
            aria-describedby={hasError ? 'setup-passcode-error' : undefined}
            className={hasError ? 'border-red-400/60' : undefined}
            onChange={(event) => {
              setPasscode(event.target.value)
              setHasError(false)
            }}
          />

          {hasError && (
            <p
              id="setup-passcode-error"
              role="alert"
              className="text-sm font-bold text-red-300"
            >
              رمز الدخول غير صحيح
            </p>
          )}

          <Button type="submit" size="lg" fullWidth>
            دخول
          </Button>
        </form>
      </Card>
    </PageTransition>
  )
}
