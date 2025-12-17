import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Header as HeaderType } from '@/payload-types'
import HeaderClient from './HeaderClient'

export default async function Header() {
  const payload = await getPayload({ config: configPromise })

  const header = (await payload.findGlobal({ slug: 'header', depth: 1 })) as HeaderType

  const navItems = (header?.navItems ?? []).map((item) => ({
    label: item.label || '',
    link: item.link || '#',
  }))

  return <HeaderClient navItems={navItems} />
}
