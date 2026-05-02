/**
 * Trim description to SEO-friendly length
 * @param description - Original description
 * @param maxLength - Maximum length (default: 160)
 * @returns Trimmed description
 */
export function trimDescription(description: string, maxLength: number = 160): string {
    if (!description) return '';

    // 1. Remove HTML tags
    const plainText = description
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // 2. Trim length
    if (plainText.length <= maxLength) {
        return plainText;
    }

    return `${plainText.substring(0, maxLength - 3).trim()}...`;
}

/**
 * Format canonical URL
 * @param siteUrl - Base site URL
 * @param locale - Current locale
 * @param path - Path without locale
 * @returns Formatted canonical URL
 */
export function formatCanonicalUrl(siteUrl: string, locale: string, path: string): string {
    // Remove trailing slash from siteUrl
    const baseUrl = siteUrl.replace(/\/$/, '');

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Remove trailing slash from path (except for root)
    const finalPath = cleanPath !== '/' ? cleanPath.replace(/\/$/, '') : cleanPath;

    return `${baseUrl}/${locale}${finalPath}`;
}

/**
 * Format image URL (convert relative to absolute)
 * @param image - Image path (relative or absolute)
 * @param siteUrl - Base site URL
 * @returns Absolute image URL
 */
export function formatImageUrl(image: string, siteUrl: string): string {
    if (!image) return '';

    // If already absolute URL
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }

    // Remove trailing slash from siteUrl
    const baseUrl = siteUrl.replace(/\/$/, '');

    // Ensure image path starts with /
    const imagePath = image.startsWith('/') ? image : `/${image}`;

    return `${baseUrl}${imagePath}`;
}

/**
 * Validate and sanitize image URL
 * @param image - Image URL to validate
 * @param siteUrl - Base site URL
 * @param fallbackImage - Fallback image if validation fails
 * @returns Valid image URL
 */
export function validateImageUrl(
    image: string | undefined,
    siteUrl: string,
    fallbackImage: string
): string {
    if (!image) {
        return formatImageUrl(fallbackImage, siteUrl);
    }

    try {
        // If relative path, convert to absolute
        const absoluteUrl = formatImageUrl(image, siteUrl);

        // Basic URL validation
        new URL(absoluteUrl);

        return absoluteUrl;
    } catch {
        // If invalid, return fallback
        return formatImageUrl(fallbackImage, siteUrl);
    }
}
