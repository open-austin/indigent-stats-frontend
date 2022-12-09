import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const COMBINED_CHARGES_URL =
    'https://github.com/open-austin/indigent-stats-frontend/raw/main/data/cases_subset.json'

export const config = {
    api: {
        responseLimit: '20mb',
        bodyParser: {
            sizeLimit: '20mb',
        },
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { status, data } = await axios.get(COMBINED_CHARGES_URL)

        // skipping schema validation for now
        if (status >= 200 && status < 300) {
            res.status(200).json(data)
        } else {
            res.status(203).json({ error: 'Fetch failed' })
        }
    } catch (err) {
        console.log('API Fetch Error', JSON.stringify(err))
        res.status(500).json(JSON.stringify(err))
    }
}
