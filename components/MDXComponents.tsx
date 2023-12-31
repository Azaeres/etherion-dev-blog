/* eslint-disable react/display-name */
import React, { lazy, Suspense } from 'react'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'
import { coreContent } from '@/lib/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import { MDXContentProps } from 'mdx-bundler/client'
import { Tweet } from 'react-tweet'

interface MDXLayout {
  layout: string
  content: Blog | Authors
  [key: string]: unknown
}

interface Wrapper {
  layout: string
  [key: string]: unknown
}

const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = lazy(() => import(`../layouts/${layout}`))
  return (
    <Suspense fallback={<>Loading...</>}>
      <Layout content={content} {...rest} />
    </Suspense>
  )
}

export const MDXComponents: MDXContentProps['components'] = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm,
  wrapper: Wrapper,
  Tweet,
}

export const MDXLayoutRenderer = ({ layout, content, ...rest }) => {
  const MDXLayout = useMDXComponent(content.body.code)
  const mainContent = coreContent(content)
  return <MDXLayout layout={layout} content={mainContent} components={MDXComponents} {...rest} />
}
