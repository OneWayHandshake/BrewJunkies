# Coffee Project Change Breakdown

## Overview
- Enforced authentication and ownership checks for image upload/retrieval and AI analysis.
- Added cookie parsing middleware so refresh/logout can read `refreshToken`.
- Updated server dependencies to include `cookie-parser` and its types.

## Detailed Changes

### 1) Image Uploads and Access Control
Files:
- `packages/server/src/routes/upload.routes.ts`
- `packages/server/src/controllers/upload.controller.ts`

Behavior changes:
- Uploads now require authentication; anonymous uploads are no longer allowed.
- Image retrieval (raw and base64) requires authentication and ownership.
- Uploaded images always store the authenticated user's `userId`.

What changed:
- `POST /api/upload` switched from optional auth to required auth.
- `GET /api/upload/:id` and `GET /api/upload/:id/base64` now enforce `req.user`
  and validate `image.userId === req.user.id`.
- Upload handler now rejects missing `req.user` before accepting any files.

Why it matters:
- Prevents leakage of private images via guessed IDs.
- Ensures image storage and retrieval are aligned with access expectations.

### 2) AI Analysis Authorization
Files:
- `packages/server/src/routes/analyze.routes.ts`
- `packages/server/src/controllers/analyze.controller.ts`

Behavior changes:
- Analysis now requires authentication.
- Analysis only runs on images owned by the authenticated user.
- Ownerless images are no longer analyzable.

What changed:
- `POST /api/analyze` switched from optional auth to required auth.
- Analysis controller now rejects unauthenticated requests and blocks
  non-owner or ownerless images.

Why it matters:
- Prevents users from analyzing another user's images.
- Aligns AI analysis with the new image access policy.

### 3) Cookie Parsing for Auth Refresh/Logout
Files:
- `packages/server/src/app.ts`

Behavior changes:
- Refresh/logout endpoints can now read `req.cookies`.

What changed:
- Added `cookie-parser` middleware to the Express app.

Why it matters:
- `refresh` and `logout` rely on `req.cookies.refreshToken`; without
  cookie parsing, these endpoints cannot work.

### 4) Dependency Updates
Files:
- `packages/server/package.json`

What changed:
- Added `cookie-parser` to dependencies.
- Added `@types/cookie-parser` to devDependencies.

Operational note:
- Run `npm install -w @coffee/server` to update `package-lock.json`.

## Security Impact
- Stronger access controls on all image flows.
- Eliminates unauthenticated image retrieval by ID.
- Prevents cross-user image analysis.

## API Contract Changes
- `POST /api/upload`: now requires auth.
- `GET /api/upload/:id`: now requires auth and only returns owner's image.
- `GET /api/upload/:id/base64`: now requires auth and only returns owner's image.
- `POST /api/analyze`: now requires auth.

## Known Follow-ups
- Decide how to handle existing `Image` rows with `userId = null`
  (backfill or delete).

## Tests
- Not run.
