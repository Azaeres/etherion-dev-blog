import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import GithubSlugger from 'github-slugger'
import { escape } from './htmlEscaper.mjs'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'

const slugger = new GithubSlugger()

// TODO: refactor into contentlayer once compute over all docs is enabled
export async function getAllTags() {
  const tagCount = {}
  // Iterate through each post, putting all found tags into `tags`
  allBlogs.forEach((file) => {
    if (file.tags && file.draft !== true) {
      file.tags.forEach((tag) => {
        // const formattedTag = slugger.slug(tag)
        if (tag in tagCount) {
          tagCount[tag] += 1
        } else {
          tagCount[tag] = 1
        }
      })
    }
  })

  return tagCount
}

const generateRssItem = (post) => `
  <item>
    <guid>${siteMetadata.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${siteMetadata.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (posts, page = 'feed.xml') => {
  return `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(siteMetadata.title)}</title>
      <link>${siteMetadata.siteUrl}/blog</link>
      <description>${escape(siteMetadata.description)}</description>
      <language>${siteMetadata.language}</language>
      <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
      <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
  `
}

async function generate() {
  // RSS for blog post
  if (allBlogs.length > 0) {
    console.log('generate allBlogs > ');
    const rss = generateRss(allBlogs)
    writeFileSync('./public/feed.xml', rss)
  }

  // RSS for tags
  // TODO: use AllTags from contentlayer when computed docs is ready
  if (allBlogs.length > 0) {
    const tags = await getAllTags()
    console.log(' > tags:', tags);
    for (const tag of Object.keys(tags)) {
      const filteredPosts = allBlogs.filter(
        (post) => {
          // const mappedTags = post.tags.map((t) => {
          //   const slug = slugger.slug(t);
          //   console.log(' > t: slug:', t, slug);
          //   return slug
          // })
          // console.log(' > mappedTags:', mappedTags);
          // const findTag = slugger.slug(tag)
          // console.log(' > findTag:', findTag);
          return post.draft !== true && post.tags.includes(tag)
        }
      )
      // console.log('-  > filteredPosts, tag:', filteredPosts, tag);
      const rss = generateRss(filteredPosts, `tags/${tag}/feed.xml`)
      const rssPath = path.join('public', 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, 'feed.xml'), rss)
    }
  }
}

generate()
