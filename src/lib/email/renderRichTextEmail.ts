import type { RichTextContent, RichTextNode, RichTextChild } from '@/types/richtext'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const renderNode = (node: RichTextNode) => {
  const text = (node.children || [])
    .map((child: RichTextChild) => escapeHtml(child.text))
    .join('')
    .trim()

  if (!text) return ''

  if (node.type?.includes('heading')) {
    return `<h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 600;">${text}</h2>`
  }

  return `<p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6;">${text}</p>`
}

export function renderRichTextEmail(content?: RichTextContent | string | null) {
  if (!content) return ''

  if (typeof content === 'string') {
    return `<p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6;">${escapeHtml(content)}</p>`
  }

  if (content.root?.children) {
    return content.root.children.map(renderNode).join('')
  }

  return ''
}
