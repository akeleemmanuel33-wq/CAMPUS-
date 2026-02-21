// =============================================
// CAMPUS - Auth Helpers
// =============================================

import { supabase } from './supabase.js'

const PROTECTED_PAGES = ['upload.html', 'profile.html']
const AUTH_PAGES      = ['login.html', 'signup.html']

// ─── Get current session ─────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ─── Get current user + profile ──────────────
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

// ─── Check if user is admin ───────────────────
export async function isAdmin(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()
  return data?.is_admin === true
}

// ─── Protect a page ───────────────────────────
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    window.location.href = 'login.html?next=' + encodeURIComponent(window.location.pathname)
    return null
  }
  return session
}

// ─── Redirect if already logged in ───────────
export async function redirectIfLoggedIn() {
  const session = await getSession()
  if (session) window.location.href = 'index.html'
}

// ─── Sign Up ──────────────────────────────────
export async function signUp({ fullName, email, password, universityId }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, university_id: universityId } }
  })
  return { data, error }
}

// ─── Log In ───────────────────────────────────
export async function logIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

// ─── Log Out ──────────────────────────────────
export async function logOut() {
  await supabase.auth.signOut()
  window.location.href = 'index.html'
}

// ─── Has viewed enough PDFs? ──────────────────
// Admins always bypass the 10-view rule
export async function hasViewedEnough(userId) {
  // Admin bypass
  const admin = await isAdmin(userId)
  if (admin) return true

  const { count } = await supabase
    .from('download_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', 'view')

  return count >= 5
}

// ─── Can upload? ──────────────────────────────
// Admins bypass the 10-view rule but still respect monthly limit
export async function canUpload(profile) {
  // Reset count if new month
  const resetDate  = new Date(profile.upload_reset_date)
  const now        = new Date()
  const isNewMonth = now.getMonth() !== resetDate.getMonth() ||
                     now.getFullYear() !== resetDate.getFullYear()

  if (isNewMonth) {
    await supabase
      .from('profiles')
      .update({
        upload_count_this_month: 0,
        upload_reset_date: now.toISOString().split('T')[0]
      })
      .eq('id', profile.id)
    return true
  }

  return profile.upload_count_this_month < 10
}

// ─── Auto-run: guard pages on load ───────────
;(async () => {
  const page = window.location.pathname.split('/').pop()
  if (PROTECTED_PAGES.includes(page)) await requireAuth()
  if (AUTH_PAGES.includes(page))      await redirectIfLoggedIn()
})()
