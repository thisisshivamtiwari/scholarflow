import { Link } from 'react-router-dom'

export const NotFoundApp = () => {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This screen is not part of the demo or the URL is invalid.
      </p>
      <Link
        to="/app"
        className="mt-6 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        Back to app home
      </Link>
    </div>
  )
}
