import type { Media } from '@/payload-types'

export interface SeriesImage {
  image: (number | null) | Media
  title?: string | null
  description?: string | null
  date?: string | null
  location?: string | null
  archiveNumber?: string | null
}

export interface Series {
  id: string
  name: string
  cover: (number | null) | Media
  startDate?: string | null
  endDate?: string | null
  images: SeriesImage[]
}
