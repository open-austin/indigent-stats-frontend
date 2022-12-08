import type { NextApiRequest, NextApiResponse } from 'next'
import { combinedDataSchema } from '../../models/schemas'
import { groupBy } from '../../lib/array'

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
    const file = await fetch(COMBINED_CHARGES_URL)
    const json = await file.json()

    const charges = combinedDataSchema.safeParse(json.results)

    if (charges.success) {
        const payload = groupBy(charges.data)((a) => a.case_number.toString())

        res.status(200).json(payload)
    } else {
        console.log('Parse Error:\n', charges.error.issues)
        res.status(203).json(JSON.stringify(charges.error.issues))
    }
}

const COMBINED_CHARGES_URL =
    'https://github.com/open-austin/indigent-stats-frontend/raw/main/data/combined.json'
