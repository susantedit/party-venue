/**
 * Builds a Cloudinary URL with automatic format (WebP) and quality optimization.
 * @param url   - The original Cloudinary secure_url
 * @param width - Optional width for responsive sizing
 */
export function cloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const transforms = ['f_auto', 'q_auto', ...(width ? [`w_${width}`] : [])].join(',');

  // Insert transforms after /upload/ in the Cloudinary URL
  return url.replace('/upload/', `/upload/${transforms}/`);
}
