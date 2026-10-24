# Browlicious custom CMS deployment

This is a self-hosted CMS written for Browlicious. It does not rely on WordPress, a hosted CMS, third-party authentication, or a cloud database. Blog records are stored in a private JSON data file, and uploaded media is stored in a private Docker volume. The application exposes only its public website through Nginx.

## Local use

1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env` and keep `CMS_ALLOWED_IPS=127.0.0.1,::1`.
3. Run `node server.js` in this folder.
4. Open `http://127.0.0.1:8003/admin` to create articles.
5. Public articles appear at `http://127.0.0.1:8003/blog` after they are published.

## Password-protected CMS access

The CMS uses a password login and a signed, HTTP-only session cookie. This works from changing home, mobile, or office networks.

Set both secrets before deploying:

- `CMS_ADMIN_PASSWORD`: a long, unique publishing password.
- `CMS_AUTH_SECRET`: a random secret of at least 32 characters used only to sign sessions.

The session is valid for 12 hours, is `HttpOnly`, `Secure` in production, and `SameSite=Strict`. `CMS_ALLOWED_IPS` is retained only as a local/legacy fallback when both password variables are absent.

## Vercel deployment

For the Vercel production site, add these environment variables in **Project Settings → Environment Variables**:

- `CMS_ADMIN_PASSWORD`: your chosen long publishing password.
- `CMS_AUTH_SECRET`: a random 32+ character signing secret.

Set both for **Production** (and Preview only if you use the editor on preview deployments), then redeploy. Keep both values private; never commit them to the repository.

## VPS deployment

1. Create an Ubuntu VPS and point your domain A record to its public IP.
2. Install Docker Engine, Docker Compose plugin and Nginx.
3. Copy the project to `/opt/browlicious-pmu` and create `.env` from `.env.example`.
4. Set `APP_URL=https://your-domain.com` and replace the sample IP with your office's fixed IP.
5. Run `docker compose up -d --build`.
6. Configure Nginx to proxy `https://your-domain.com` to `http://127.0.0.1:8003` and set `X-Forwarded-For`.
7. Set `TRUST_PROXY=true` only after step 6. Add a TLS certificate with Certbot.
8. Visit `/admin` from the approved office connection and publish a test draft.

Example Nginx location:

```nginx
location / {
    proxy_pass http://127.0.0.1:8003;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Backups

Back up both Docker volumes daily: `cms_data` contains the articles and `cms_uploads` contains cover images. Before upgrades, create an offline copy of both volumes and test restoring them on another machine. Keep `.env` private and outside Git.
