/**
 * Compress an image file to a max width/height and given quality.
 * Returns a base64 data URL.
 */
export function compressImage(file, maxSize = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          } else {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable Chinese format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${year}年${parseInt(month)}月${parseInt(day)}日`
}

/**
 * Format a date to relative age if a birthdate is provided.
 * e.g. "3个月大" or "1岁2个月"
 */
export function formatAge(dateStr, birthDateStr) {
  if (!dateStr || !birthDateStr) return null
  const date = new Date(dateStr)
  const birth = new Date(birthDateStr)
  if (date < birth) return null

  let years = date.getFullYear() - birth.getFullYear()
  let months = date.getMonth() - birth.getMonth()
  let days = date.getDate() - birth.getDate()

  if (days < 0) {
    months--
    days += new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  if (years === 0 && months === 0) return `${days}天`
  if (years === 0) return months === 1 ? `1个月` : `${months}个月`
  if (months === 0) return `${years}岁`
  return `${years}岁${months}个月`
}
