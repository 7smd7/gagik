# SEO & Metadata Configuration

This project includes comprehensive SEO and metadata management capabilities powered by Next.js and Payload CMS.

## Features

### 1. **Dynamic Page Metadata**

Every page can have custom SEO settings configured in Payload CMS:

- Meta Title
- Meta Description
- Keywords
- Custom Open Graph Image
- Robots directives (noindex/nofollow)

### 2. **Automatic OG Image Generation**

- Pages without custom OG images automatically get dynamically generated images
- Located at: `src/app/(frontend)/[locale]/opengraph-image.tsx`
- Generates 1200x630px images optimized for social sharing
- Customizable design with page title and branding

### 3. **Global Site Settings**

Centralized configuration in Payload CMS (`site-settings` global):

- Site name and description
- Default OG image
- Social media links
- Analytics tracking (Google Analytics, Microsoft Clarity)
- Custom scripts
- Structured data (Schema.org)

### 4. **Multi-language Support**

- All metadata supports localization (en, hy, ru)
- Automatic canonical URLs
- hreflang tags for language alternates

### 5. **Analytics Integration**

- Microsoft Clarity tracking
- Google Analytics 4
- Custom script injection

### 6. **Structured Data (Schema.org)**

Automatic JSON-LD generation for SEO:

- Person/Organization/LocalBusiness types
- Social media profiles
- Contact information

## Configuration

### Environment Variables

Add to your `.env` file:

```env
NEXT_PUBLIC_SITE_URL=https://gagikharutyunyan.com
```

### Setting Up Site Settings

1. Log into Payload CMS admin panel
2. Navigate to **Globals** > **Site Settings**
3. Configure:
   - **General**: Site name, URL, description
   - **SEO Defaults**: Default OG image, Twitter handle
   - **Social Links**: Add your social media profiles
   - **Analytics**: Add tracking IDs
   - **Structured Data**: Configure organization type and contact info

### Setting Up Page SEO

1. Edit any page in Payload CMS
2. Scroll to **SEO Settings** section
3. Configure:
   - Custom meta title (optional, defaults to page title)
   - Meta description
   - Keywords
   - Custom OG image (optional, auto-generated if not provided)
   - Robots settings

## Technical Details

### Files Structure

```
src/
├── app/(frontend)/
│   └── [locale]/
│       ├── layout.tsx              # Metadata generation & analytics
│       ├── page.tsx                # Page-specific metadata
│       └── opengraph-image.tsx     # Dynamic OG image generator
├── collections/
│   └── Pages.ts                    # SEO fields definition
├── globals/
│   └── SiteSettings.ts             # Site-wide settings
└── components/common/
    ├── Analytics.tsx               # Analytics tracking component
    └── StructuredData.tsx          # Schema.org structured data
```

### Metadata Priority

1. Page-specific SEO fields (if set)
2. Page default fields (title)
3. Global site settings (defaults)

### OG Image Generation

Dynamic images are generated at runtime using Next.js `ImageResponse` API:

- **URL**: `/{locale}/opengraph-image`
- **Size**: 1200x630px
- **Format**: PNG
- **Cacheable**: Yes (Edge runtime)

To customize the design, edit:

```typescript
src / app / frontend / [locale] / opengraph - image.tsx
```

## Best Practices

### Meta Titles

- Keep under 60 characters
- Include primary keywords
- Brand name at the end

### Meta Descriptions

- 150-160 characters optimal
- Compelling call-to-action
- Include relevant keywords naturally

### OG Images

- 1200x630px recommended
- File size under 300KB
- Include text that's readable on mobile
- Use high contrast

### Keywords

- 5-10 relevant keywords
- Comma-separated
- Focus on long-tail keywords

## Social Media Preview

### Open Graph (Facebook, LinkedIn, WhatsApp)

- Title: `og:title`
- Description: `og:description`
- Image: `og:image` (1200x630px)
- Type: `website`
- Locale: Automatic based on current language

### Twitter Cards

- Card type: `summary_large_image`
- Same image and content as Open Graph
- Optional: Add Twitter handle in Site Settings

### Telegram

- Uses Open Graph tags
- Falls back to Twitter tags

## Testing

### Preview Your Meta Tags

Use these tools to test:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Test Structured Data

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

## Troubleshooting

### Images not showing in social previews

1. Ensure image is publicly accessible
2. Check image size (max 5MB for most platforms)
3. Clear platform cache (use debugging tools)
4. Verify `NEXT_PUBLIC_SITE_URL` is set correctly

### Analytics not tracking

1. Verify tracking IDs are correct
2. Check browser console for errors
3. Ensure ad blockers are disabled for testing
4. Wait 24-48 hours for data to appear

### Metadata not updating

1. Clear Next.js cache: `rm -rf .next`
2. Regenerate types: `npm run generate:types`
3. Restart dev server
4. Check Payload CMS for saved changes

## Migration

If you have existing pages, you'll need to:

1. Run `npm run generate:types` to update TypeScript types
2. Configure Site Settings in Payload CMS
3. Optionally add SEO settings to existing pages
4. Default metadata will be used for pages without custom settings

## Additional Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search/docs)
