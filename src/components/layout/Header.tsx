import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Header as HeaderType } from '@/payload-types'
import HeaderClient from './HeaderClient'

interface HeaderProps {
  locale?: string
}

export default async function Header({ locale = 'en' }: HeaderProps) {
  const payload = await getPayload({ config: configPromise })

  const header = (await payload.findGlobal({
    slug: 'header',
    depth: 1,
    locale: locale as 'en' | 'hy' | 'ru',
  })) as HeaderType

  const navItems = (header?.navItems ?? []).map((item) => ({
    label: item.label || '',
    link: item.link || '#',
  }))

  return (
    <HeaderClient logo={header?.logo} name={header?.name} navItems={navItems} locale={locale} />
  )
}
