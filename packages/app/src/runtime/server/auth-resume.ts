// This route must reach the reverse proxy, not Workbox's cached SPA fallback.
export const authResumePath = "/__opencode_reauth"

// Keep one retry marker in the URL until an API request succeeds, preventing redirect loops.
const authResumeMarker = "__opencode_auth_retry"

export function authResumeUrl(href: string) {
  const current = new URL(href)
  if (current.pathname === authResumePath || current.searchParams.has(authResumeMarker)) return

  current.searchParams.delete("auth_token")
  current.searchParams.set(authResumeMarker, "1")

  const resume = new URL(authResumePath, current.origin)
  resume.searchParams.set("return", current.href)
  return resume.href
}

export function authResumeTarget(href: string) {
  const current = new URL(href)
  if (current.pathname !== authResumePath) return

  const target = current.searchParams.get("return")
  if (!target) return new URL("/", current.origin).href

  try {
    const resume = new URL(target, current.origin)
    if (resume.origin !== current.origin || resume.username || resume.password || resume.pathname === authResumePath)
      return new URL("/", current.origin).href
    resume.searchParams.delete("auth_token")
    return resume.href
  } catch {
    return new URL("/", current.origin).href
  }
}

export function clearAuthResume(href: string) {
  const current = new URL(href)
  if (!current.searchParams.has(authResumeMarker)) return

  current.searchParams.delete(authResumeMarker)
  return `${current.pathname}${current.search}${current.hash}`
}
