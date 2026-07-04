import type { PresentationModeId, StageId } from '@/types/app.types'
import type { NavigationItem } from '@/types/navigation.types'

export const APP_NAME = 'منصة النتائج'
export const APP_DATA_SCHEMA_VERSION = 1
export const APP_STORAGE_KEY = 'competition-results-app'

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'الرئيسية', path: '/' },
  { label: 'إعداد العرض', path: '/stages' },
]

export interface SelectionOption<T extends string> {
  id: T
  title: string
  description: string
  badge: string
}

export const STAGE_OPTIONS: SelectionOption<StageId>[] = [
  {
    id: 'qualifiers',
    title: 'التصفيات',
    description: 'عرض النتائج الأولية وترتيب المشاركين في مرحلة التأهل.',
    badge: 'المرحلة الأولى',
  },
  {
    id: 'semifinal',
    title: 'نصف النهائي',
    description: 'تقديم المتأهلين والنتائج في المرحلة ما قبل الختامية.',
    badge: 'المرحلة الثانية',
  },
  {
    id: 'final',
    title: 'النهائي',
    description: 'لحظة الحسم وإعلان الترتيب النهائي للفائزين.',
    badge: 'المرحلة الختامية',
  },
]

export const MODE_OPTIONS: SelectionOption<PresentationModeId>[] = [
  {
    id: 'leaderboard',
    title: 'لوحة الترتيب',
    description: 'قائمة واضحة ومتدرجة لعرض ترتيب جميع المشاركين.',
    badge: 'عرض شامل',
  },
  {
    id: 'podium',
    title: 'منصة الفائزين',
    description: 'إعلان بصري مميز للمراكز الثلاثة الأولى.',
    badge: 'لحظة التتويج',
  },
  {
    id: 'live-score',
    title: 'النتائج المباشرة',
    description: 'مساحة مرنة لعرض الدرجات أثناء سير المنافسة.',
    badge: 'تحديث مستمر',
  },
]
