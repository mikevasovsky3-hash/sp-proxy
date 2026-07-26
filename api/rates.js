import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.headers['x-vercel-cron'] === '1') {
        try {
            const response = await fetch('https://api-v2.sp-today.com/api-dashboard', {
                headers: { 'X-API-Key': '4cdaa702ba85d7e625f341163a901529' }
            });
            const data = await response.json();
            await kv.set('latest_rates', data);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    try {
        const data = await kv.get('latest_rates');
        return res.status(200).json(data || { error: 'No data yet' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
}
