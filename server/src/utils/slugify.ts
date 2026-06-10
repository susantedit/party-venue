/**
 * Converts any string to a lowercase, hyphenated, URL-safe slug.
 * Removes diacritics, strips non-alphanumeric characters,
 * collapses consecutive hyphens, and trims leading/trailing hyphens.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')   // Keep only letters, digits, spaces, hyphens
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');        // Trim leading/trailing hyphens
}
