export interface RichTextChild {
  text: string
}

export interface RichTextNode {
  type: string
  children?: RichTextChild[]
}

export interface RichTextContent {
  root: {
    children: RichTextNode[]
  }
}
