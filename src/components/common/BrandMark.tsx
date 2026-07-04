import { Link } from 'react-router-dom'

import { APP_NAME } from '@/constants/app.constants'
import { ROUTES } from '@/constants/routes.constants'

export const BrandMark = () => (
  <Link
    to={ROUTES.home}
    className="group inline-flex items-center gap-3 rounded-xl"
    aria-label="الانتقال إلى الصفحة الرئيسية"
  >
    <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand-300/30 bg-brand-300/10 text-brand-200 transition group-hover:bg-brand-300/15">
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 3h10v4a5 5 0 0 1-10 0V3Z" />
        <path d="M7 5H4v2a4 4 0 0 0 4 4" />
        <path d="M17 5h3v2a4 4 0 0 1-4 4" />
        <path d="M12 12v5" />
        <path d="M8 21h8" />
        <path d="M9 17h6v4H9z" />
      </svg>
    </span>
    <span className="text-sm font-bold tracking-tight text-white sm:text-base">
      {APP_NAME}
    </span>
  </Link>
)
