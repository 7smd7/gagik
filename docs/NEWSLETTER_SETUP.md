# Newsletter System - How to Use

## Current Setup ✅

The subscription system is fully working:

1. **Subscribers Collection**: Stores email addresses with locale and source tracking
2. **Subscribe API** (`/api/subscribe`): Adds emails to database
3. **Unsubscribe API** (`/api/unsubscribe`): Removes emails from database
4. **Resend Integration**: Configured in `payload.config.ts` with your API key and from address

## How It Works with Resend

### 1. **Collecting Subscribers** (Already Working)

- Users submit email via the contact form on your homepage
- Email is stored in `subscribers` collection with their locale preference
- Resend is NOT used for this step - it's just database storage

### 2. **Sending Newsletters** (Admin Broadcasts Page)

Use the **Broadcasts** collection in the admin panel (Marketing → Broadcasts).

**Fields:**

- `from`: optional, must be a verified Resend sender (leave empty to use `RESEND_FROM`).
- `subject`: email subject line.
- `content`: rich text editor (converted to HTML automatically).
- `locale`: filter by language (or All).
- `sendNow`: check and save to send.

**To send a newsletter:**

1. Create a new Broadcast
2. Fill `from`, `subject`, `content` and `locale`
3. Check **Send now** and save
4. The system will send to all matching subscribers

Every email automatically includes an unsubscribe footer link pointing to `/unsubscribe`.

```bash
curl -X POST https://yourdomain.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "New Works Available",
    "html": "<h1>Check out my latest work</h1><p>View the new series...</p>",
    "locale": "en"
  }'
```

**Parameters:**

- `subject`: Email subject line
- `html`: Full HTML email content
- `locale`: (optional) Filter by language - `en`, `hy`, or `ru`

### 3. **How Resend is Used**

The newsletter endpoint:

1. Fetches all subscribers from database (optionally filtered by locale)
2. Loops through each subscriber
3. Calls `payload.sendEmail()` which uses Resend under the hood
4. Resend delivers the emails

### 4. **For Sending News Updates**

**Option A: Use the Admin Broadcasts Page** (Recommended)

- Go to Marketing → Broadcasts
- Compose and send directly from admin

**Option B: Use the API Endpoint** (Alternative)

- POST to `/api/newsletter` with your HTML content
- Useful for automation tools (Postman, n8n, cron jobs)

**Option C: Use Resend Directly** (Alternative)
If you prefer not to use Payload's email adapter:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Fetch subscribers
const subscribers = await payload.find({ collection: 'subscribers' })

// Send with Resend
await resend.emails.send({
  from: 'Gagik <noreply@gagikharutyunyan.com>',
  to: subscribers.docs.map((s) => s.email),
  subject: 'New Works',
  html: '<p>Your content...</p>',
})
```

## Best Practices

1. **Test First**: Send to your own email first
2. **Batch Sending**: For large lists (>100), send in batches to avoid rate limits
3. **Unsubscribe Link**: Automatically appended by the broadcast system and handled by the /unsubscribe page.
4. **Track Opens/Clicks**: Resend provides analytics

## Environment Variables Required

Make sure these are set:

```env
RESEND_API_KEY=re_xxxxx
RESEND_FROM=noreply@gagikharutyunyan.com
```

## Next Steps

1. Test the newsletter endpoint with a sample email
2. Build a simple admin UI for composing newsletters (or use an external tool)
3. Add an unsubscribe page that calls `/api/unsubscribe`
4. Consider adding email templates for consistent branding
