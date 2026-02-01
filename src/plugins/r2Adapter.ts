import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import path from 'path'

export function createR2AdapterFactory(opts: {
  bucket: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  customDomain?: string
}) {
  const { bucket, endpoint, accessKeyId, secretAccessKey, customDomain } = opts

  const client = new S3Client({
    endpoint,
    region: 'auto',
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: false,
  })

  return function r2AdapterFactory({ collection, prefix }: { collection: any; prefix?: string }) {
    const prefixPath = prefix ? `${prefix}` : ''

    return {
      name: 'r2-adapter',
      fields: [],
      async onInit() {},
      clientUploads: false,
      // Upload buffer to R2
      async handleUpload({ file, data }: { file: any; data: any }) {
        const filename =
          typeof file.filename === 'string'
            ? file.filename
            : file.originalname || `file-${Date.now()}`
        const key = path.posix.join(prefixPath, filename)
        const Body = file.buffer || file.data || file
        const ContentType =
          file.mimeType || file.mimetype || data?.mimeType || 'application/octet-stream'

        await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body, ContentType }))

        data.filename = key
        // Don't set data.url - let Payload's afterRead hook generate it
        return data
      },
      async handleDelete({ filename }: { filename: string }) {
        if (!filename) return
        await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: filename }))
      },
      async generateURL({ filename }: { filename: string }) {
        if (!filename) return null
        // Use custom domain for permanent public URLs (no expiry, no bucket listing)
        if (customDomain) {
          return `${customDomain.replace(/\/$/, '')}/${filename}`
        }
        // If no custom domain, return null so Payload serves through its own API
        return null
      },
      // staticHandler: proxy the object through the server
      async staticHandler(req: any, { params }: any) {
        const filename = params?.filename || req.params?.filename
        if (!filename) return null
        
        try {
          const command = new GetObjectCommand({ Bucket: bucket, Key: filename })
          const response = await client.send(command)
          
          // Return the stream properly for Payload to handle
          return {
            Body: response.Body,
            ContentType: response.ContentType,
          }
        } catch (e) {
          console.error('Failed to fetch file from R2:', e)
          return null
        }
      },
    }
  }
}

export default createR2AdapterFactory
