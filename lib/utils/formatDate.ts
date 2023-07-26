import siteMetadata from '@/data/siteMetadata'

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles',
  }
  console.log('formatDate  > date:', date)
  console.log(' > siteMetadata.locale:', siteMetadata.locale)
  console.log(' > options:', options)
  const dateObj = new Date(date)
  const now = dateObj.toLocaleDateString(siteMetadata.locale, options)
  console.log(' > now:', now)

  return now
}

export default formatDate
