# Voice Upload + Whisper Transcription — Implementation TODO

> Feature: user records a voice note → uploaded to object storage → transcribed via Whisper → transcript stored on the `recordings` row for downstream report generation.

## Context — what already exists

The DB layer is already built for this feature. `apps/server/src/db/schemas/recordings.ts` defines:

- `s3Key`, `mimeType`, `durationMs`, `uploadStatus` — upload side
- `transcriptModel`, `transcriptStatus`, `transcriptAttempts`, `transcriptError`, `language`, `content` — transcription side
- partial index `recording_transcript_status_idx` on `('idle','pending','failed')` — designed for a requeue/sweep of pending or failed jobs

`jobStatus` enum (`enums.ts`): `idle | pending | finished | failed`. A `recording` is 1:1 with a `reflection` (unique per reflection); a `reflection` is 1 per (user, date).

**Conclusion:** the schema author designed for **async, retryable, S3-backed transcription**. This TODO builds the pipeline that schema anticipates.

### Missing (all of it)
S3 storage, OpenAI/Whisper wiring, config/env module, Recordings module, job runner, `expo-audio` in mobile, upload/poll client.

---

## Architecture decisions

| # | Decision | Chosen | Alternative |
|---|----------|--------|-------------|
| 1 | Transcription engine | **OpenAI Whisper API** (`whisper-1` / `gpt-4o-transcribe`) — one HTTP call, no infra; `transcriptModel` records which model | self-host `whisper.cpp` (no per-min cost, GPU/CPU ops) |
| 2 | Job execution | **BullMQ + Redis worker** — matches `pending`/`failed`/`transcriptAttempts` retry semantics | inline transcription in confirm request (blocks 5–30s, no retry) |
| 3 | Upload path | **Presigned S3 PUT** — mobile uploads direct to storage, server never proxies bytes; matches `s3Key` + `uploadStatus` | multipart through NestJS (simpler client, server handles bytes) |
| 4 | Storage target | AWS S3 **or** Cloudflare R2 / MinIO (S3-compatible, cheaper) — `@aws-sdk/client-s3` works with all via endpoint | — |

Swap sections below if a decision changes.

---

## Phase 0 — Infra & config
- [ ] Add `OPENAI_API_KEY`, `S3_*` (bucket, region, access key, secret, endpoint), `REDIS_URL` to env + `.env.example`
- [ ] Add Redis service to `apps/server/docker-compose.yaml` (BullMQ backend)
- [ ] Create `ConfigModule` (`@nestjs/config` + zod validation) — fail fast on missing env, mirror the throw pattern in `db/database.ts`
- [ ] Pick S3 target and set endpoint accordingly

## Phase 1 — Storage service
- [ ] Add `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`
- [ ] `StorageModule` / `StorageService`: `getPresignedPutUrl(key, mime)`, `getObjectStream(key)`
- [ ] Key convention: `recordings/{userId}/{reflectionId}/{recordingId}.{ext}`

## Phase 2 — Recordings module (upload)
- [ ] `RecordingsModule` (controller + service), register in `app.module.ts`
- [ ] `POST /reflections/:date/recording` (auth via `@Session`): upsert `reflection` for (userId, date) → insert `recording` row (`uploadStatus: 'pending'`) → return `{ recordingId, uploadUrl }`
- [ ] `POST /recordings/:id/confirm`: set `uploadStatus: 'finished'` → enqueue transcription job
- [ ] Ownership guard: recording → reflection → userId must match session
- [ ] DTOs + zod validation (mime whitelist: `audio/m4a`, `audio/mp4`, `audio/webm`; `durationMs`)

## Phase 3 — Transcription worker
- [ ] Add `bullmq` + `ioredis`, `QueueModule` (queue `transcription`)
- [ ] Add `openai` SDK; `TranscriptionService.transcribe(recordingId)`:
  - [ ] set `transcriptStatus: 'pending'`, bump `transcriptAttempts`
  - [ ] fetch audio from S3 → OpenAI `audio.transcriptions.create({ model, file })`
  - [ ] on success: write `content`, `language`, `transcriptModel`, `transcriptStatus: 'finished'`
  - [ ] on error: `transcriptStatus: 'failed'`, store `transcriptError`
- [ ] Worker retry policy: cap at `transcriptAttempts` (e.g. 3), backoff; use the partial index `recording_transcript_status_idx` to sweep/requeue stuck `failed`/`pending`
- [ ] `GET /recordings/:id` → status + transcript for client polling

## Phase 4 — Mobile (Expo)
- [ ] `pnpm add expo-audio expo-file-system` in `apps/mobile`
- [ ] Mic permission (config plugin in `app.json` + runtime request)
- [ ] Wire `src/app/record.tsx`: record → stop → get local file + `durationMs`
- [ ] API client (fetch/react-query) with better-auth bearer token
- [ ] Upload flow: create recording → presigned PUT to S3 → confirm → poll `GET /recordings/:id` until `finished`/`failed`
- [ ] UI states: recording / uploading / transcribing / done (show transcript) / failed (retry)

## Phase 5 — Hardening & tests
- [ ] Enforce max duration + file size before presign
- [ ] Idempotent confirm (double-tap safe)
- [ ] e2e test (`test/`): upload → confirm → job → transcript, with S3 + OpenAI mocked
- [ ] Handle orphan recordings (uploaded, never confirmed) — sweep job

---

## Out of scope
Transcript → **report** generation (the `reports` table LLM analysis) is a separate downstream feature. This TODO stops at storing `content` on the recording.
