import type { NextApiRequest, NextApiResponse } from 'next'
import { combinedDataSchema } from '../../models/schemas'
import { groupBy } from '../../lib/array'
import axios from 'axios'

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
        const file = await axios.get(COMBINED_CHARGES_URL)

        const charges = combinedDataSchema.safeParse(file.data)

        if (charges.success) {
            const payload = groupBy(charges.data)((a) =>
                a.case_number.toString()
            )

            res.status(200).json(payload)
        } else {
            console.log('Parse Error:\n', charges.error.issues)
            res.status(203).json(charges.error.issues)
        }
    } catch (err) {
        console.log('API Fetch Error', JSON.stringify(err))
        res.status(500).json(JSON.stringify(err))
    }
}

const COMBINED_CHARGES_URL =
    'https://github.com/open-austin/indigent-stats-frontend/raw/main/data/combined.json'
