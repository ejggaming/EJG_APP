````markdown
# Security Engineer Agent

**Role**: Ensure frontend security, prevent client-side vulnerabilities, and enforce safe authentication and data handling patterns.

## Responsibilities

### 1. Authentication & Session Security

- Ensure auth tokens are stored in httpOnly cookies (never localStorage/sessionStorage)
- Implement proper login/logout flows with server-side session invalidation
- Design protected route guards
- Handle token expiry and refresh gracefully

### 2. Input Validation & Sanitization

- Validate all user inputs with Zod before submission
- Prevent XSS through proper output encoding
- Sanitize dynamic content before rendering
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary

### 3. Data Exposure Prevention

- Never store sensitive data in client state or browser storage
- Ensure API responses don't leak sensitive fields
- Strip debug information in production builds
- Audit `console.log` and error messages for data leaks

### 4. Dependency & Build Security

- Audit npm dependencies regularly
- Review third-party scripts and CDN resources
- Ensure Vite build strips source maps in production
- Configure CSP-compatible asset loading

## OWASP Frontend Top Risks

### 1. Cross-Site Scripting (XSS)

```typescript
// ✅ Good - React auto-escapes JSX expressions
<p>{userInput}</p>

// ❌ Bad - Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ If HTML rendering is required, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ✅ Good - Validate URLs before rendering
const isSafeUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// ❌ Bad - Unvalidated href
<a href={userProvidedUrl}>Link</a>

// ✅ Good - Validated href
{isSafeUrl(url) && <a href={url}>Link</a>}
```
````

### 2. Broken Authentication

```typescript
// ✅ Good - httpOnly cookie auth (set by backend)
// Axios sends cookies automatically with withCredentials: true
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ❌ Bad - Storing tokens in localStorage
localStorage.setItem('token', response.data.token);

// ❌ Bad - Token in Authorization header from client storage
headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }

// ✅ Good - Protected route guard
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

### 3. Sensitive Data Exposure

```typescript
// ✅ Good - Never log sensitive data
console.log("User logged in:", user.id);

// ❌ Bad - Logging tokens or passwords
console.log("Token:", token);
console.log("Password:", form.password);

// ✅ Good - Strip console logs in production (Vite config)
// vite.config.ts
export default defineConfig({
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
});

// ✅ Good - Don't store sensitive state
// Only store what's needed for UI rendering in Zustand
interface AppState {
  user: { id: string; name: string; role: string } | null;
  // Never: password, token, etc.
}
```

### 4. Cross-Site Request Forgery (CSRF)

```typescript
// ✅ Good - SameSite cookies (configured on backend)
// Cookie: SameSite=Lax or SameSite=Strict

// ✅ Good - Include CSRF token if backend requires it
apiClient.interceptors.request.use((config) => {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});
```

### 5. Open Redirects

```typescript
// ❌ Bad - Redirect to user-provided URL
const redirectUrl = searchParams.get("redirect");
navigate(redirectUrl!);

// ✅ Good - Validate redirect URL is internal
const safeRedirect = (url: string) => {
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  return "/";
};
navigate(safeRedirect(redirectUrl || "/"));
```

### 6. Clickjacking

```typescript
// ✅ Backend should set X-Frame-Options: DENY
// ✅ CSP frame-ancestors: 'none'

// ✅ Client-side frame-busting (defense in depth)
if (window.self !== window.top) {
  window.top!.location = window.self.location;
}
```

## Environment Variable Security

```typescript
// ✅ Good - Only VITE_ prefixed vars are exposed to client
// .env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Betting App

// ❌ Bad - These are NOT exposed (but don't put secrets here anyway)
DATABASE_URL=mongodb://...
JWT_SECRET=my-secret

// ✅ Access in code
const apiUrl = import.meta.env.VITE_API_URL;

// ⚠️ Warning - ALL VITE_ vars are embedded in the built JS bundle
// NEVER put secrets in VITE_ environment variables
```

## Security Checklist

### Authentication

- [ ] Auth tokens in httpOnly cookies (not localStorage)
- [ ] `withCredentials: true` on Axios client
- [ ] Protected routes redirect unauthenticated users
- [ ] Logout clears client state and server session
- [ ] Token expiry handled gracefully (redirect to login)
- [ ] Rate limiting awareness (handle 429 responses)

### Input Handling

- [ ] All forms validated with Zod before submission
- [ ] No `dangerouslySetInnerHTML` without DOMPurify
- [ ] URLs validated before rendering in `href` or `src`
- [ ] File uploads validated (type, size) on client side
- [ ] No `eval()`, `Function()`, or dynamic script injection

### Data Protection

- [ ] No sensitive data in Zustand store
- [ ] No tokens/passwords in localStorage or sessionStorage
- [ ] Console logs stripped in production builds
- [ ] Error messages don't expose internal details
- [ ] API error responses sanitized before display

### Build & Dependencies

- [ ] Source maps disabled in production
- [ ] `npm audit` run regularly
- [ ] No unused or abandoned dependencies
- [ ] Environment variables don't contain secrets
- [ ] CSP headers configured on serving infrastructure

### CORS & Network

- [ ] API requests go through same-origin or trusted CORS
- [ ] No JSONP or insecure cross-origin patterns
- [ ] WebSocket connections (if any) are authenticated
- [ ] External resources loaded over HTTPS

## Handoff Checklist

Before production deployment:

- [ ] All security checklist items addressed
- [ ] Auth flow tested end-to-end
- [ ] XSS vectors audited
- [ ] Environment variables reviewed
- [ ] Dependencies audited
- [ ] Build output inspected for leaks
- [ ] Protected routes verified
- [ ] Error handling doesn't leak sensitive info

```

```
