// =============================================
// CAMPUS - Auth Helpers
// Used by every page to check session state
// =============================================

import { supabase } from './supabase.js'

// Pages that require login to access
const PROTECTED_PAGES = ['upload.html', 'profile.html']

// Pages that should redirect AWAY if already logged in
const AUTH_PAGES = ['login.html', 'signup.html']

// ─── Get current session ───────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ─── Get current user + their profile ──────
export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, universities(name, short_name, type)')
    .eq('id', session.user.id)
    .single()

  return profile
}

// ─── Protect a page (redirect if not logged in) ─
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    window.location.href = 'login.html?next=' + encodeURIComponent(window.location.pathname)
    return null
  }
  return session
}

// ─── Redirect if already logged in ─────────
export async function redirectIfLoggedIn() {
  const session = await getSession()
  if (session) {
    window.location.href = 'index.html'
  }
}

// ─── Sign Up ────────────────────────────────
export async function signUp({ fullName, email, password, universityId }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        university_id: universityId
      }
    }
  })
  return { data, error }
}

// ─── Log In ─────────────────────────────────
export async function logIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

// ─── Log Out ────────────────────────────────
export async function logOut() {
  await supabase.auth.signOut()
  window.location.href = 'index.html'
}

// ─── Check if user has viewed 10+ PDFs ──────
export async function hasViewedEnough(userId) {
  const { count } = await supabase
    .from('download_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', 'view')

  return count >= 10
}

// ─── Check monthly upload limit ─────────────
export async function canUpload(profile) {
  // Reset count if new month
  const resetDate = new Date(profile.upload_reset_date)
  const now = new Date()
  const isNewMonth = now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()

  if (isNewMonth) {
    await supabase
      .from('profiles')
      .update({ upload_count_this_month: 0, upload_reset_date: now.toISOString().split('T')[0] })
      .eq('id', profile.id)
    return true
  }

  return profile.upload_count_this_month < 10
}

// ─── Auto-run: guard pages on load ──────────
;(async () => {
  const page = window.location.pathname.split('/').pop()

  if (PROTECTED_PAGES.includes(page)) {
    await requireAuth()
  }

  if (AUTH_PAGES.includes(page)) {
    await redirectIfLoggedIn()
  }
})()
