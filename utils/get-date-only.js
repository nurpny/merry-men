export default function getDateOnly (dateTimeStr) {
  // returns date of dateTime string in month/date/year

  return new Date(dateTimeStr).toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

