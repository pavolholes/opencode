import { expect, test } from "bun:test"
import { authResumePath, authResumeTarget, authResumeUrl, clearAuthResume } from "./auth-resume"

test("auth resume keeps the current route and does not forward an auth token", () => {
  const resume = new URL(authResumeUrl("https://opencode.example/session/ses_1?auth_token=secret&theme=dark#message")!)
  const target = new URL(resume.searchParams.get("return")!)

  expect(resume.pathname).toBe(authResumePath)
  expect(target.pathname).toBe("/session/ses_1")
  expect(target.searchParams.get("theme")).toBe("dark")
  expect(target.searchParams.get("__opencode_auth_retry")).toBe("1")
  expect(target.searchParams.has("auth_token")).toBe(false)
  expect(target.hash).toBe("#message")
})

test("auth resume only returns to a same-origin URL", () => {
  expect(
    authResumeTarget("https://opencode.example/__opencode_reauth?return=https%3A%2F%2Fevil.example%2F"),
  ).toBe("https://opencode.example/")
  expect(
    authResumeTarget("https://opencode.example/__opencode_reauth?return=https%3A%2F%2Fuser%40opencode.example%2F"),
  ).toBe("https://opencode.example/")
})

test("clearing auth resume preserves the rest of the URL", () => {
  expect(clearAuthResume("https://opencode.example/session/ses_1?theme=dark&__opencode_auth_retry=1#message")).toBe(
    "/session/ses_1?theme=dark#message",
  )
})
