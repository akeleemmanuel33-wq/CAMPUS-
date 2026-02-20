// =============================================
// CAMPUS - UI Utilities
// Navbar with hamburger, footer, toast, dropdown
// =============================================

import { supabase } from './supabase.js'
import { getSession, logOut } from './auth.js'

// ─── Build Navbar ────────────────────────────
export async function buildNav(activePage = '') {
  const session = await getSession()
  const nav = document.getElementById('navbar')
  if (!nav) return

  nav.innerHTML = `
    <a href="index.html" class="navbar-brand">
      <div class="navbar-logo">📚</div>
      <span class="navbar-name">Campus</span>
    </a>

    <div class="navbar-links">
      <a href="index.html"   class="nav-link ${activePage === 'home'    ? 'active' : ''}">Explore</a>
      ${session ? `<a href="upload.html"  class="nav-link ${activePage === 'upload'  ? 'active' : ''}">Upload</a>`  : ''}
      ${session ? `<a href="profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}">Profile</a>` : ''}
    </div>

    <div class="navbar-actions desktop-actions">
      ${session ? `
        <div class="user-pill">
          <div class="user-avatar" id="nav-avatar">?</div>
          <span class="user-name" id="nav-username">Loading...</span>
        </div>
        <button class="btn btn-ghost btn-sm" id="logout-btn">Logout</button>
      ` : `
        <a href="login.html"  class="nav-link">Log In</a>
        <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
      `}
    </div>

    <button class="hamburger" id="hamburger-btn" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  `

  // Remove old drawer/overlay if exists
  document.getElementById('mobile-drawer')?.remove()
  document.getElementById('drawer-overlay')?.remove()

  const overlay = document.createElement('div')
  overlay.id = 'drawer-overlay'
  document.body.appendChild(overlay)

  const drawer = document.createElement('div')
  drawer.id = 'mobile-drawer'
  drawer.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-brand">
        <div class="navbar-logo" style="width:32px;height:32px;font-size:16px;">📚</div>
        <span class="navbar-name" style="font-size:18px;">Campus</span>
      </div>
      <button class="drawer-close" id="drawer-close">✕</button>
    </div>

    ${session ? `
      <div class="drawer-user">
        <div class="drawer-avatar" id="drawer-avatar">?</div>
        <div>
          <p class="drawer-user-name" id="drawer-username">Loading...</p>
          <p class="drawer-user-uni"  id="drawer-user-uni">—</p>
        </div>
      </div>
      <div class="drawer-divider"></div>
    ` : ''}

    <nav class="drawer-nav">
      <a href="index.html"   class="drawer-link ${activePage === 'home'    ? 'active' : ''}"><span class="drawer-link-icon">🔍</span> Explore PDFs</a>
      ${session ? `
      <a href="upload.html"  class="drawer-link ${activePage === 'upload'  ? 'active' : ''}"><span class="drawer-link-icon">📤</span> Upload PDF</a>
      <a href="profile.html" class="drawer-link ${activePage === 'profile' ? 'active' : ''}"><span class="drawer-link-icon">👤</span> My Profile</a>
      ` : ''}
    </nav>

    <div class="drawer-divider"></div>

    <div class="drawer-actions">
      ${session ? `
        <button class="btn btn-ghost btn-full" id="drawer-logout">↪️ &nbsp;Logout</button>
      ` : `
        <a href="login.html"  class="btn btn-ghost btn-full">Log In</a>
        <a href="signup.html" class="btn btn-primary btn-full" style="margin-top:10px;">🎓 Create Account</a>
      `}
    </div>
  `
  document.body.appendChild(drawer)

  const hamburger = document.getElementById('hamburger-btn')

  function openDrawer() {
    drawer.classList.add('open')
    overlay.classList.add('show')
    document.body.style.overflow = 'hidden'
    hamburger.classList.add('open')
  }
  function closeDrawer() {
    drawer.classList.remove('open')
    overlay.classList.remove('show')
    document.body.style.overflow = ''
    hamburger.classList.remove('open')
  }

  hamburger.addEventListener('click', openDrawer)
  document.getElementById('drawer-close').addEventListener('click', closeDrawer)
  overlay.addEventListener('click', closeDrawer)
  drawer.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer))

  // Populate user info
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, universities(name, short_name)')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      const firstName = profile.full_name.split(' ')[0]
      const initials  = profile.full_name.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('')
      const uniName   = profile.universities
        ? `${profile.universities.name} (${profile.universities.short_name})`
        : 'University not set'

      const el = (id) => document.getElementById(id)
      if (el('nav-username'))    el('nav-username').textContent    = firstName
      if (el('nav-avatar'))      el('nav-avatar').textContent      = initials
      if (el('drawer-username')) el('drawer-username').textContent = profile.full_name
      if (el('drawer-avatar'))   el('drawer-avatar').textContent   = initials
      if (el('drawer-user-uni')) el('drawer-user-uni').textContent = uniName
    }

    document.getElementById('logout-btn')?.addEventListener('click', logOut)
    document.getElementById('drawer-logout')?.addEventListener('click', logOut)
  }
}

// ─── Build Footer ────────────────────────────
export function buildFooter() {
  const footer = document.getElementById('footer')
  if (!footer) return
  footer.innerHTML = `
    <div class="footer-brand">
      <div class="navbar-logo" style="width:28px;height:28px;font-size:14px;">📚</div>
      <span class="navbar-name" style="font-size:18px;">Campus</span>
    </div>
    <p class="footer-text">Nigeria's student PDF sharing platform &nbsp;·&nbsp; Built for students, by students 🇳🇬</p>
  `
}

// ─── Toast ───────────────────────────────────
let toastTimer = null
export function toast(msg, type = 'success') {
  let el = document.getElementById('toast')
  if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el) }
  el.textContent = msg
  el.className = `show ${type}`
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { el.className = '' }, 3200)
}

// ─── University Dropdown ──────────────────────
export async function buildUniDropdown(inputId, dropdownId, hiddenId) {
  const { data: unis } = await supabase
    .from('universities').select('id, name, short_name, type').order('type').order('name')
  if (!unis) return

  const input    = document.getElementById(inputId)
  const dropdown = document.getElementById(dropdownId)
  const hidden   = document.getElementById(hiddenId)
  if (!input || !dropdown || !hidden) return

  function render(filter = '') {
    const filtered = unis.filter(u =>
      u.name.toLowerCase().includes(filter.toLowerCase()) ||
      u.short_name?.toLowerCase().includes(filter.toLowerCase())
    )
    const groups = { Federal: [], State: [], Private: [] }
    filtered.forEach(u => groups[u.type]?.push(u))
    dropdown.innerHTML = ''

    Object.entries(groups).forEach(([type, items]) => {
      if (!items.length) return
      const label = document.createElement('div')
      label.className = 'uni-group-label'
      label.textContent = `${type} Universities`
      dropdown.appendChild(label)
      items.forEach(u => {
        const opt = document.createElement('div')
        opt.className = 'uni-option'
        opt.innerHTML = `<span>${u.name}</span><span style="font-size:11px;color:var(--text-dim)">${u.short_name || ''}</span>`
        opt.addEventListener('click', () => {
          input.value  = `${u.name} (${u.short_name})`
          hidden.value = u.id
          dropdown.classList.remove('open')
        })
        dropdown.appendChild(opt)
      })
    })
    dropdown.classList.toggle('open', filtered.length > 0 && document.activeElement === input)
  }

  input.addEventListener('input',  () => render(input.value))
  input.addEventListener('focus',  () => render(input.value))
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.remove('open')
  })
  render()
}

// ─── Helpers ─────────────────────────────────
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}
export function formatSize(mb) {
  if (!mb) return '—'
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(mb * 1024).toFixed(0)} KB`
}
export function uniBadgeClass(type) {
  return { Federal: 'badge-federal', State: 'badge-state', Private: 'badge-private' }[type] || 'badge-federal'
}
