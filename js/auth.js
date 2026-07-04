const Auth = {
  user: null,
  role: null,

  async init() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) await this._loadUser(session.user);

    sb.auth.onAuthStateChange(async (event, session) => {
      if (session) await this._loadUser(session.user);
      else { this.user = null; this.role = null; }
      document.dispatchEvent(new Event('authchange'));
    });
  },

  async _loadUser(user) {
    this.user = user;
    // Check role in profiles table
    const { data } = await sb
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    this.role = data?.role || 'learner';
  },

  async signInGoogle() {
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/index.html' }
    });
  },

  async signOut() {
    await sb.auth.signOut();
    window.location.href = '/index.html';
  },

  isAdmin() { return this.role === 'admin'; },
  isLoggedIn() { return !!this.user; },

  // Call on pages that require login; shows overlay if not logged in
  requireLogin() {
    if (!this.user) showAuthOverlay();
  }
};

function showAuthOverlay() {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function hideAuthOverlay() {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.style.display = 'none';
}

// Standard auth overlay HTML — paste into pages that need login
// <div id="auth-overlay" class="auth-overlay" style="display:none">
//   <div class="auth-box">
//     <h2 data-i18n="login_title"></h2>
//     <p data-i18n="login_desc"></p>
//     <button class="btn btn-primary btn-full" onclick="Auth.signInGoogle()">
//       Google
//     </button>
//   </div>
// </div>
