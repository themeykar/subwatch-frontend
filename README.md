# SubWatch

Keeps track of your recurring subscriptions so you don't get blindsided by a renewal you forgot about.

I built this because I kept getting hit with charges for subscriptions I'd completely forgotten I signed up for. Turns out checking your bank statement every month isn't a great memory system. So I made something that just tells me what's coming up, without me having to go looking for it.

It's open to anyone. Sign up, add what you're paying for, and SubWatch flags anything renewing soon so you're not caught off guard.

## What it actually does

- Tracks all your subscriptions in one place — name, cost, billing cycle, renewal date
- Flags anything renewing within the next 7 days so it doesn't sneak past you
- Shows your total monthly and yearly spend, added up automatically
- Lets you pick your currency (₦, $, €, £) — just changes the symbol shown, doesn't do actual conversion
- Full auth, so your data is tied to your account and nobody else's

## Tech stack

**Frontend:** React + Vite + Tailwind CSS
**Backend:** Django + Django REST Framework + `djangorestframework-simplejwt` for auth
**Database:** PostgreSQL (SQLite locally if you don't want to bother with Postgres for dev)

Two separate repos. The frontend is a static React app that talks to the Django API over HTTP — they don't share code, just a URL.

## Quick Start

### Backend

```bash
git clone <subwatch-backend>
cd subwatch-backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and fill in the values — at minimum you'll want a `SECRET_KEY`. Generate one with:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

Then run migrations and start the server:

```bash
python3 manage.py migrate
python3 manage.py runserver
```

Backend runs at `http://localhost:8000`.

### Frontend

```bash
git clone <subwatch-frontend>
cd subwatch-frontend
npm install
```

Create a `.env` file with:

```
VITE_API_URL=http://localhost:8000
```

Then:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

Make sure the backend is actually running before you try to sign up or log in — the frontend can't do anything on its own, it just talks to the API.

## How auth works

JWT-based. You log in, get an access token and a refresh token. The access token is short-lived (a few minutes), so the frontend automatically refreshes it in the background when it expires. You shouldn't ever notice this happening — if you do, that's a bug, not a feature.

## Known limitations

Being upfront about what this isn't, so nobody's surprised:

- **No real currency conversion.** Picking a different currency just changes the symbol next to your numbers. If you enter 5000 and switch to dollars, it shows $5000, not a converted amount. This is a display preference, not a forex calculator.

- **No email or push notifications yet.** Renewal warnings only show up when you actually open the dashboard. If you don't check the app, you won't get warned. Scheduled email reminders are on the list, not built yet.

- **One device, one login at a time, no password reset flow yet.** If you forget your password, there's currently no self-service way to reset it.

- **No multi-currency accounts.** You can track subscriptions in different currencies but the totals will just be added together as raw numbers — it won't separate them out or convert them for you.

None of these are hidden gotchas. They're just not built yet.

## Why I made this public

Mostly because I think other people have the exact same problem I did — forgetting what they're paying for until it's too late. If it's useful to you too, great. If you find a bug, that's expected at this stage — feel free to open an issue.

## License

MIT. Do whatever you want with it.