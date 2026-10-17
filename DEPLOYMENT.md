# Browlicious custom CMS deployment

This is a self-hosted CMS written for Browlicious. It does not rely on WordPress, a hosted CMS, third-party authentication, or a cloud database. Blog records are stored in a private JSON data file, and uploaded media is stored in a private Docker volume. The application exposes only its public website through Nginx.

## Local use

1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env` and keep `CMS_ALLOWED_IPS=127.0.0.1,::1`.
3. Run `node server.js` in this folder.
4. Open `http://127.0.0.1:8003/admin` to create articles.
5. Public articles appear at `http://127.0.0.1:8003/blog` after they are published.

## No-login protection

There is deliberately no password screen. Instead, every CMS write route is restricted to exact IP addresses in `CMS_ALLOWED_IPS`.

- Keep only `127.0.0.1,::1` for local-only administration.
- For an office with a fixed public IP, add that address: `CMS_ALLOWED_IPS=127.0.0.1,::1,203.0.113.25`.
- Do not use `0.0.0.0`, a range, or a dynamic IP address.
- Do not turn on `TRUST_PROXY=true` unless Nginx is the only service that can reach the Node app. The Docker configuration binds Node to `127.0.0.1` to enforce this.

If the office network has a changing IP address, this passwordless design is not suitable. Ask for a passwordless email-link option instead; never remove all access controls.

## Vercel deployment

For the Vercel production site, add the approved address in **Project Settings → Environment Variables**:

- Name: `CMS_ALLOWED_IPS`
- Value: a comma-separated list of approved public addresses, for example `122.183.51.220`
- Environments: **Production** (and Preview only if the editor must be used on preview deployments)

Redeploy after saving the variable. Vercel provides the visitor address through `X-Forwarded-For`; the CMS normalizes IPv4-mapped IPv6 values before checking the exact allowlist. Keep the variable private to the project settings rather than committing it to the repository.

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
