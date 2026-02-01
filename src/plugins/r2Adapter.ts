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
}) {
  const { bucket, endpoint, accessKeyId, secretAccessKey } = opts

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
        data.url = `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`
        return data
      },
      async handleDelete({ filename }: { filename: string }) {
        if (!filename) return
        await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: filename }))
      },
      async generateURL({ filename }: { filename: string }) {
        if (!filename) return null
        // Return a public URL (assumes bucket allows access). If private, could use signed URL instead.
        try {
          // try signed url (short lived) to be safe
          const command = new GetObjectCommand({ Bucket: bucket, Key: filename })
          const url = await getSignedUrl(client, command, { expiresIn: 3600 })
          return url
        } catch (e) {
          return `${endpoint.replace(/\/$/, '')}/${bucket}/${filename}`
        }
      },
      // staticHandler: proxy the object through the server
      async staticHandler(req: any, args: any) {
        const filename = (args && (args.filename || args.params?.filename)) || req.params?.filename
        if (!filename) return
        const command = new GetObjectCommand({ Bucket: bucket, Key: filename })
        const res = await client.send(command)
        return res.Body
      },
    }
  }
}

export default createR2AdapterFactory
