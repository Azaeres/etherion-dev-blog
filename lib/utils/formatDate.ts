import siteMetadata from '@/data/siteMetadata'

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: siteMetadata.timeZone,
  }
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString(siteMetadata.locale, options)
}

export default formatDate
