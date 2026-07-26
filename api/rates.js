let cachedData = null;
let lastFetchTime = 0;
const CACHE_TTL = 8 * 60 * 60 * 1000; // 8 часов (ровно 3 запроса в сутки)

export default async function handler(req, res) {
    const now = Date.now();
    
    if (!cachedData || (now - lastFetchTime) > CACHE_TTL) {
        try {
            const response = await fetch('https://api-v2.sp-today.com/', {
                headers: { 'X-API-Key': '4cdaa702ba85d7e625f341163a901529' }
            });
            cachedData = await response.json();
            lastFetchTime = now;
        } catch (error) {
            if (!cachedData) {
                return res.status(500).json({ error: 'Failed to fetch rates' });
            }
        }
    }

    return res.status(200).json(cachedData);
}
