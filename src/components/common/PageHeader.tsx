interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
}

export const PageHeader = ({
  description,
  eyebrow,
  title,
}: PageHeaderProps) => (
  <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-12">
    <p className="mb-3 text-xs font-bold tracking-[0.18em] text-brand-300 sm:text-sm">
      {eyebrow}
    </p>
    <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
      {title}
    </h1>
    <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-7 text-slate-300 sm:text-base lg:text-lg">
      {description}
    </p>
  </header>
)
