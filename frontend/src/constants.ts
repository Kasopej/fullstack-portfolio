export const isDevMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
export const manualAbortError = 'ManualAbort'
export const UNAUTHENTICATED_ROUTES: string[] = ['/', '/blog-posts', '/blog-posts/[postId]', '/projects', '/projects/[projectId]', '/dashboard/login']
