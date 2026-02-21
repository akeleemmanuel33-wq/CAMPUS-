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
      <img src="logo.png" class="navbar-logo">
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
        <img src="logo.png" class="navbar-logo" style="width:32px;height:32px;font-size:16px;">
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
      <a href="index.html"   class="drawer-link ${activePage === 'home'    ? 'active' : ''}"><span class="drawer-link-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M15 15L16.5 16.5" /> <path d="M16.9333 19.0252C16.3556 18.4475 16.3556 17.5109 16.9333 16.9333C17.5109 16.3556 18.4475 16.3556 19.0252 16.9333L21.0667 18.9748C21.6444 19.5525 21.6444 20.4891 21.0667 21.0667C20.4891 21.6444 19.5525 21.6444 18.9748 21.0667L16.9333 19.0252Z" /> <path d="M16.5 9.5C16.5 5.63401 13.366 2.5 9.5 2.5C5.63401 2.5 2.5 5.63401 2.5 9.5C2.5 13.366 5.63401 16.5 9.5 16.5C13.366 16.5 16.5 13.366 16.5 9.5Z" /> </svg></span> Explore PDFs</a>
      ${session ? `
      <a href="upload.html"  class="drawer-link ${activePage === 'upload'  ? 'active' : ''}"><span class="drawer-link-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" /> <path d="M12 13L12 21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5" /> </svg></span> Upload PDF</a>
      <a href="profile.html" class="drawer-link ${activePage === 'profile' ? 'active' : ''}"><span class="drawer-link-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.9548 21.8396 9.94704 21.5422 9" /> <path d="M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" /> <path d="M5.49994 19.5001L6.06034 18.5194C6.95055 16.9616 8.60727 16.0001 10.4016 16.0001H13.5983C15.3926 16.0001 17.0493 16.9616 17.9395 18.5194L18.4999 19.5001" /> <path d="M18.9737 2.02148C18.9795 1.99284 19.0205 1.99284 19.0263 2.02148C19.3302 3.50808 20.4919 4.66984 21.9785 4.97368C22.0072 4.97954 22.0072 5.02046 21.9785 5.02632C20.4919 5.33016 19.3302 6.49192 19.0263 7.97852C19.0205 8.00716 18.9795 8.00716 18.9737 7.97852C18.6698 6.49192 17.5081 5.33016 16.0215 5.02632C15.9928 5.02046 15.9928 4.97954 16.0215 4.97368C17.5081 4.66984 18.6698 3.50808 18.9737 2.02148Z" /> </svg></span> My Profile</a>
      <div class="drawer-divider" style="margin:8px 0;"></div>
      <button class="drawer-link" id="drawer-logout" style="width:100%;text-align:left;background:none;border:none;cursor:pointer;color:var(--red);"><span class="drawer-link-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M15.5 8.04045C15.4588 6.87972 15.3216 6.15451 14.8645 5.58671C14.2114 4.77536 13.0944 4.52064 10.8605 4.01121L9.85915 3.78286C6.4649 3.00882 4.76777 2.6218 3.63388 3.51317C2.5 4.40454 2.5 6.1257 2.5 9.56803V14.432C2.5 17.8743 2.5 19.5955 3.63388 20.4868C4.76777 21.3782 6.4649 20.9912 9.85915 20.2171L10.8605 19.9888C13.0944 19.4794 14.2114 19.2246 14.8645 18.4133C15.3216 17.8455 15.4588 17.1203 15.5 15.9595" /> <path d="M18.5 9.01172C18.5 9.01172 21.5 11.2212 21.5 12.0117C21.5 12.8023 18.5 15.0117 18.5 15.0117M21 12.0117H8.49998" /> </svg></span> Logout</button>
      ` : `
      <div class="drawer-divider" style="margin:8px 0;"></div>
      <a href="login.html"  class="drawer-link"><span class="drawer-link-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">
    <path d="M5.10772 14.3857L5.58594 7.91256C5.61875 7.46854 5.64642 7.05187 5.67232 6.66186C5.85017 3.98379 5.94481 2.55876 7.04807 2.10979C8.15132 1.66082 9.2022 2.61969 11.1771 4.42168C11.4647 4.68413 11.772 4.96446 12.1018 5.26093L16.9102 9.58273C18.2626 10.7983 18.9389 11.4062 18.9934 11.9885C19.0309 12.3882 18.9067 12.7862 18.6489 13.0924C18.2733 13.5385 17.3734 13.6473 15.5737 13.8647C14.8156 13.9563 14.4365 14.0021 14.2073 14.2038C14.0479 14.344 13.9376 14.5321 13.8925 14.7404C13.8277 15.0399 13.9707 15.3964 14.2567 16.1095L15.7394 19.8058C15.9107 20.2328 15.9963 20.4464 15.995 20.6429C15.9932 20.9078 15.8865 21.1609 15.6986 21.3462C15.5591 21.4837 15.3471 21.57 14.9232 21.7425C14.4993 21.915 14.2873 22.0013 14.0921 22C13.8292 21.9982 13.5778 21.8907 13.3939 21.7015C13.2574 21.561 13.1717 21.3475 13.0004 20.9204L11.5177 17.2241C11.2317 16.5111 11.0887 16.1545 10.8355 15.9844C10.6595 15.8662 10.4503 15.8081 10.239 15.8187C9.935 15.834 9.63074 16.0663 9.02224 16.5308C7.57763 17.6337 6.85532 18.1851 6.27746 18.1269C5.88085 18.0871 5.51701 17.8877 5.26831 17.574C4.90595 17.1169 4.9732 16.2065 5.10772 14.3857Z" />
</svg></span> Log In</a>
      <a href="signup.html" class="drawer-link" style="color:var(--green);"><span class="drawer-link-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <path d="M2 8C2 9.34178 10.0949 13 11.9861 13C13.8772 13 21.9722 9.34178 21.9722 8C21.9722 6.65822 13.8772 3 11.9861 3C10.0949 3 2 6.65822 2 8Z" /> <path d="M5.99414 11L6.23925 16.6299C6.24415 16.7426 6.25634 16.8555 6.28901 16.9635C6.38998 17.2973 6.57608 17.6006 6.86 17.8044C9.08146 19.3985 14.8901 19.3985 17.1115 17.8044C17.3956 17.6006 17.5816 17.2973 17.6826 16.9635C17.7152 16.8555 17.7274 16.7426 17.7324 16.6299L17.9774 11" /> <path d="M20.4734 9.5V16.5M20.4734 16.5C19.6814 17.9463 19.3312 18.7212 18.9755 20C18.8983 20.455 18.9596 20.6843 19.2732 20.8879C19.4006 20.9706 19.5537 21 19.7055 21H21.2259C21.3876 21 21.5507 20.9663 21.6838 20.8745C21.9753 20.6735 22.0503 20.453 21.9713 20C21.6595 18.8126 21.2623 18.0008 20.4734 16.5Z" /> </svg></span> Create Account</a>
      `}
    </nav>
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
      <img src="logo.png" class="navbar-logo" style="width:28px;height:28px;font-size:14px;">
      <span class="navbar-name" style="font-size:18px;">Campus</span>
    </div>
    <p class="footer-text">Nigeria's student PDF sharing platform &nbsp;·&nbsp; Built for students</p>
    <p class="footer-text"><strong>DevHemanuel</strong> - All copyright Reserved &copy 2026</p>
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
