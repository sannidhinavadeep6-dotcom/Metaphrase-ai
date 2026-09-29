/**
 * Google OAuth 2.0 & Google Identity Services Helper
 */

export function getGoogleClientId() {
  return (
    import.meta.env.VITE_GOOGLE_CLIENT_ID || 
    localStorage.getItem('metaphrase_google_client_id') || 
    ''
  );
}

export function setGoogleClientId(id) {
  if (id && id.trim()) {
    localStorage.setItem('metaphrase_google_client_id', id.trim());
  } else {
    localStorage.removeItem('metaphrase_google_client_id');
  }
}

/**
 * Builds Google OAuth 2.0 Authorization URL that forces account selection
 */
export function getGoogleOAuthRedirectUrl(clientId) {
  const redirectUri = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: 'openid email profile',
    prompt: 'select_account',
    include_granted_scopes: 'true'
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Initiates Google Sign-In with Account Selection
 * Supports Google Identity Services (GSI) Popup and Full Page Redirect
 */
export function triggerGoogleSignIn({
  clientId,
  mode = 'popup', // 'popup' | 'redirect'
  onSuccess,
  onError,
  onRequireClientId
}) {
  const activeClientId = clientId || getGoogleClientId();

  if (!activeClientId) {
    if (onRequireClientId) {
      onRequireClientId();
    } else if (onError) {
      onError(new Error('MISSING_CLIENT_ID'));
    }
    return;
  }

  // If redirect mode is requested or GSI is unavailable
  if (mode === 'redirect' || !window.google?.accounts?.oauth2) {
    const authUrl = getGoogleOAuthRedirectUrl(activeClientId);
    window.location.href = authUrl;
    return;
  }

  // Use Google Identity Services Popup with prompt: 'select_account'
  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: activeClientId,
      scope: 'openid email profile',
      prompt: 'select_account',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          if (onError) onError(new Error(tokenResponse.error_description || tokenResponse.error));
          return;
        }

        try {
          // Fetch Google User Profile
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          });
          const profile = await res.json();
          if (profile && profile.email) {
            if (onSuccess) onSuccess(profile);
          } else {
            throw new Error('Failed to retrieve Google profile data.');
          }
        } catch (fetchErr) {
          if (onError) onError(fetchErr);
        }
      }
    });

    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (err) {
    console.warn('Error launching Google Identity popup, attempting redirect:', err);
    const authUrl = getGoogleOAuthRedirectUrl(activeClientId);
    window.location.href = authUrl;
  }
}
