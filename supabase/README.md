# Supabase database setup

This directory defines the single shared JSON document used for competition
data synchronization. The application uses Supabase when both environment
variables are configured and automatically uses `localStorage` otherwise.

## 1. Create a Supabase project

1. Open the [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project in the appropriate organization.
3. Choose the project name, database password, and region.
4. Wait for the project to finish provisioning.

## 2. Run the schema

1. Open the project in the Supabase Dashboard.
2. Open **SQL Editor**.
3. Create a new query.
4. Copy the complete contents of [`schema.sql`](./schema.sql) into the editor.
5. Run the query and confirm it completes successfully.

The script creates:

- `public.competition_snapshots`;
- the automatic `updated_at` trigger;
- a placeholder row with `slug = 'main'`;
- temporary public read/write grants and RLS policies.
- membership in the `supabase_realtime` publication when that publication
  exists.

The seed uses an empty JSON placeholder. On the first successful remote read,
the repository replaces it with validated default `CompetitionData`.
Re-running the script does not overwrite an existing `main` snapshot.

## 3. Copy the project credentials

Open the project's **Connect** dialog or **Settings → API Keys**:

1. Copy the Project URL.
2. Copy a client-safe **Publishable key**. A legacy `anon` key also works.
3. Never use a Secret key or legacy `service_role` key in this frontend.

The environment variable keeps the existing `ANON_KEY` name for compatibility,
but it may contain the newer publishable key.

Supabase documents current key types in its
[API key guide](https://supabase.com/docs/guides/getting-started/api-keys).

## 4. Create the local environment file

From the project root, copy the example file:

```powershell
Copy-Item .env.example .env
```

Then fill in:

```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Restart the Vite development server after changing environment variables.
The `.env` file is ignored by Git.

## 5. Enable Realtime

Supabase Postgres Changes only works when the table belongs to the
`supabase_realtime` publication.

The latest [`schema.sql`](./schema.sql) adds
`public.competition_snapshots` to that publication with an idempotent block.
If the schema was run before Realtime support was added, rerun the latest file.

Alternatively, in the Supabase Dashboard:

1. Open the project's database publication settings.
2. Open the `supabase_realtime` publication.
3. Enable `competition_snapshots`.

The official
[Postgres Changes guide](https://supabase.com/docs/guides/realtime/postgres-changes)
also documents the publication requirement.

## 6. Test synchronization

1. Start the application with valid Supabase environment variables.
2. Open it in two browser windows or on two devices using the same project.
3. Confirm both show `المزامنة المباشرة مفعّلة`.
4. In the first window, edit a family name or score and wait for saving to
   finish.
5. Confirm the second window updates without a page refresh.
6. Open the results screen in both windows and reveal a score in one window.
7. Confirm the score and calculated total update in the other window.

If saves work but live updates do not, verify the publication membership,
the public `SELECT` grant and policy, and the Realtime status shown by the app.

## Security warning

The current policies intentionally allow `anon` and `authenticated` clients to
read, insert, and update snapshots. This is convenient for controlled testing,
but anyone who can access the public client key can modify the shared data.

Before an untrusted or public production deployment, replace the temporary
write policies with authenticated-user, trusted-device, or server-controlled
authorization. Keep RLS enabled. See the official
[Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Current application behavior

When both Supabase environment variables are present, the Zustand store loads
and saves the shared `main` snapshot through Supabase. Every remote edit is also
cached locally. If configuration is missing, or a Supabase request fails, the
session continues with `localStorage` and keeps the in-memory data usable.

Authentication is not enabled yet. Supabase mode uses Postgres Changes for
live updates, while local mode continues to work without any network service.
