# DistroMatch

Decision Support System untuk membantu pengguna memilih distribusi Linux berdasarkan preferensi.

## Tech Stack

Project ini dibangun dengan ekosistem TypeScript modern:

- **Framework**: [Next.js 16](https://nextjs.org/) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Database ORM**: Drizzle ORM + Drizzle Kit
- **Database Driver**: `pg` (PostgreSQL)
- **API / Server Utility**: Hono
- **Validation**: Zod
- **Authentication / OAuth**: `@react-oauth/google`, `bcryptjs`
- **Email**: Nodemailer
- **Caching / Queue (opsional)**: ioredis
- **Storage (opsional)**: AWS S3 SDK (`@aws-sdk/client-s3`)
- **UI Utility**: Radix UI, shadcn, framer-motion, sonner, lucide-react

## Prerequisites

Pastikan environment lokal kamu sudah memiliki:

- **Node.js** version 20+ (v24.16.0)
- **pnpm** version 11.4.0
- **PostgreSQL** version 17.8-1
- (Opsional) **Redis** version 7.4.7 untuk caching
- (Opsional) **Object Storage** kompatibel untuk konfigurasi S3, contoh: Supabase, Cloudflare R2

Cek versi Node dan pnpm:

```bash
node -v
pnpm -v
```

Jika pnpm belum terpasang:

```bash
npm install -g pnpm
```

## Konfigurasi Environment

Gunakan file `.env.example` sebagai acuan.

### 1) Copy file env

```bash
cp .env.example .env.local
```

> Jika project kamu membaca `.env` (bukan `.env.local`), gunakan:
>
> ```bash
> cp .env.example .env
> ```

### 2) Isi variabel environment

Berikut isi variabel berdasarkan `.env.example`:

```env
NODE_ENV="YOUR_NODE_ENV"

# FRONTEND
NEXT_PUBLIC_FETCH_URL="YOUR_NEXT_FETCH_URL"
NEXT_PUBLIC_IMAGE_URL="YOUR_NEXT_PUBLIC_IMAGE_URL"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="YOUR_NEXT_PUBLIC_GOOGLE_CLIENT_ID"
NEXT_PUBLIC_SITE_URL="YOUR_NEXT_PUBLIC_SITE_URL"

# BACKEND
DATABASE_URL="YOUR_DATABASE_URL"

FRONTEND_URL="YOUR_FRONTEND_URL"

JWT_ACCESS_SECRET="YOUR_JWT_ACCESS_SECRET"
JWT_REFRESH_SECRET="YOUR_JWT_REFRESH_SECRET"
JWT_SECRET="YOUR_JWT_SECRET"

S3_BUCKET="YOUR_S3_BUCKET"
S3_REGION="YOUR_S3_REGION"
S3_ENDPOINT="YOUR_S3_ENDPOINT"
S3_ACCESS_KEY="YOUR_S3_ACCESS_KEY"
S3_SECRET_KEY="YOUR_S3_SECRET_KEY"

EMAIL_HOST="YOUR_EMAIL_HOST"
EMAIL_PORT="YOUR_EMAIL_PORT"
EMAIL_USER="YOUR_EMAIL_USER"
EMAIL_PASS="YOUR_EMAIL_PASS"
EMAIL_FROM="YOUR_EMAIL_FROM"
EMAIL_LOGO_URL="YOUR_EMAIL_LOGO_URL"

REDIS_USE_TLS="YOUR_REDIS_USE_TLS"
REDIS_HOST="YOUR_REDIS_HOST"
REDIS_PORT="YOUR_REDIS_PORT"
REDIS_PASSWORD="YOUR_REDIS_PASSWORD"
REDIS_DB="YOUR_REDIS_DB"
```

## Cara running local development

### 1) Clone repository

```bash
git clone https://github.com/Aanwidiant/distromatch.git
cd distromatch
```

### 2) Install dependencies

```bash
pnpm install
```

### 3) Siapkan environment file

Copy `.env.example` menjadi `.env.local` atau `.env`, lalu isi semua variabel yang dibutuhkan.

### 4) Setup database schema (Drizzle)

Berdasarkan script pada `package.json`, jalankan:

```bash
pnpm db:push
```

Script ini akan menjalankan:

- `drizzle-kit generate`
- `drizzle-kit push`

### 5) Jalankan development server

```bash
pnpm dev
```

Aplikasi akan berjalan di:

- **http://localhost:7001**

### 6) Setup akun admin (manual via database)

Setelah aplikasi berjalan, silakan daftar akun terlebih dahulu melalui aplikasi.  
Lalu ubah role user tersebut menjadi **admin** langsung di database (manual update), karena default role adalah **user** yang tidak bisa mengakses panel admin.

### 7) Input data penelitian melalui Admin Panel

Setelah role berhasil diubah menjadi admin, login kembali lalu akses **Admin Panel**.

Selanjutnya:

- Buka menu **Distro** dan masukkan data distro sesuai data penelitian yang disertakan.
- Buka menu **System Settings** dan masukkan parameter sistem sesuai data penelitian yang disertakan.

### 8) Build production (opsional)

```bash
pnpm build
pnpm start
```

## Available Scripts

Berikut script yang tersedia dari `package.json`:

- `pnpm dev` → menjalankan Next.js dev server di port 7001
- `pnpm build` → build production
- `pnpm start` → start production server
- `pnpm lint` → linting dengan ESLint
- `pnpm lint:fix` → auto-fix lint issues
- `pnpm format` → format code dengan Prettier
- `pnpm format:check` → validasi format code
- `pnpm db:push` → generate + push schema database via Drizzle

## Akses Production

Selain menjalankan secara lokal, kamu juga dapat mengakses sistem production melalui: **https://distromatch.tech**
