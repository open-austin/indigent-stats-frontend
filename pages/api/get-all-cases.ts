import { NextApiRequest, NextApiResponse } from 'next'
import { getCosmosClient } from '../../lib/cosmosClient'

const client = getCosmosClient()

export const config = {
    api: {
        responseLimit: '100mb',
        bodyParser: {
            sizeLimit: '100mb',
        },
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { resources } = await client
            .database('nested-cases-db')
            .container('nested-cases')
            .items.query(COSMOS_QUERY)
            .fetchAll()

        return res.status(200).json(resources)
    } catch (err) {
        console.log('Failed to query CosmosDB', JSON.stringify(err))

        res.status(500).json(JSON.stringify(err))
    }
}

// TODO: Update cosmos query later
// currently getting data with 'null'
// NOTE: we may want to pass `LIMIT` as a query param
const COSMOS_QUERY = `
SELECT * FROM c
  WHERE NOT ARRAY_CONTAINS(c['charge_category'], null)
  ORDER BY c['earliest_charge_date'] DESC
  OFFSET 0 LIMIT 6000
`
