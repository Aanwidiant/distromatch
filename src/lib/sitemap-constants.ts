export const LIMIT = 1000;

export const PRIORITY_MAP: Record<string, number> = {
    '/': 1.0,
    '/features/dashboard': 0.8,
    '/features/task': 0.8,
    '/packages': 0.8,
    '/blogs': 0.7,
    '/about-us': 0.5,
    '/privacy-policy': 0.3,
};

export const STATIC_PATHS = Object.keys(PRIORITY_MAP);
