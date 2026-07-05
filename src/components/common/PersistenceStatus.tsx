import { useAppStore } from '@/store/app.store'
import { cn } from '@/utils/cn'

interface PersistenceStatusProps {
  className?: string
}

const timeFormatter = new Intl.DateTimeFormat('ar-SA', {
  hour: '2-digit',
  minute: '2-digit',
})

export const PersistenceStatus = ({
  className,
}: PersistenceStatusProps) => {
  const isLoading = useAppStore((state) => state.isLoading)
  const isSaving = useAppStore((state) => state.isSaving)
  const syncError = useAppStore((state) => state.syncError)
  const lastSyncedAt = useAppStore((state) => state.lastSyncedAt)
  const persistenceMode = useAppStore((state) => state.persistenceMode)
  const realtimeStatus = useAppStore((state) => state.realtimeStatus)
  const lastRemoteUpdateAt = useAppStore(
    (state) => state.lastRemoteUpdateAt,
  )
  const hasRealtimeWarning =
    !syncError &&
    persistenceMode === 'supabase' &&
    realtimeStatus === 'error'

  const label = isLoading
    ? 'جاري تحميل البيانات...'
    : isSaving
      ? 'جاري الحفظ...'
      : syncError
        ? syncError
        : persistenceMode === 'local'
          ? 'الحفظ محلي'
          : realtimeStatus === 'error'
            ? 'تعذر تشغيل المزامنة المباشرة'
            : realtimeStatus === 'connecting'
              ? 'جاري تشغيل المزامنة المباشرة...'
              : realtimeStatus === 'connected'
                ? 'المزامنة المباشرة مفعّلة'
                : 'متصل بقاعدة البيانات'

  const statusTime = lastRemoteUpdateAt ?? lastSyncedAt
  const lastActivityLabel = statusTime
    ? `${lastRemoteUpdateAt ? 'آخر تحديث مستلم' : 'آخر حفظ'}: ${timeFormatter.format(statusTime)}`
    : undefined

  return (
    <div
      role="status"
      aria-live="polite"
      title={syncError ?? lastActivityLabel}
      className={cn(
        'inline-flex min-h-8 max-w-full items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold',
        syncError && 'border-red-300/20 bg-red-300/[0.07] text-red-200',
        hasRealtimeWarning &&
          'border-amber-300/20 bg-amber-300/[0.07] text-amber-200',
        !syncError &&
          !hasRealtimeWarning &&
          (isLoading || isSaving) &&
          'border-brand-300/20 bg-brand-300/[0.07] text-brand-200',
        !syncError &&
          !hasRealtimeWarning &&
          !isLoading &&
          !isSaving &&
          persistenceMode === 'supabase' &&
          'border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200',
        !syncError &&
          !hasRealtimeWarning &&
          !isLoading &&
          !isSaving &&
          persistenceMode === 'local' &&
          'border-white/10 bg-white/[0.05] text-slate-300',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'h-1.5 w-1.5 shrink-0 rounded-full',
          syncError && 'bg-red-300',
          hasRealtimeWarning && 'bg-amber-300',
          !syncError &&
            !hasRealtimeWarning &&
            (isLoading || isSaving) &&
            'animate-pulse bg-brand-300',
          !syncError &&
            !hasRealtimeWarning &&
            !isLoading &&
            !isSaving &&
            persistenceMode === 'supabase' &&
            'bg-emerald-300',
          !syncError &&
            !hasRealtimeWarning &&
            !isLoading &&
            !isSaving &&
            persistenceMode === 'local' &&
            'bg-slate-400',
        )}
      />
      <span className="truncate">{label}</span>
    </div>
  )
}
