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
            // TODO: update this to use production container
            .database('cases-json-db')
            .container('clean-cases')
            .items.query(QUERY)
            .fetchAll()

        return res.status(200).json(resources)
    } catch (err) {
        console.log('Failed to query CosmosDB', JSON.stringify(err))

        res.status(500).json(JSON.stringify(err))
    }
}

const QUERY = `
SELECT a.charge_category, a.attorney_type, COUNT(a) AS count
  FROM (
    SELECT c.attorney_type, charge["charge_category"] AS charge_category FROM c
    JOIN charge IN c["charges"]
    WHERE
        charge["charge_category"] != null AND
        (c.attorney_type = "Retained" OR
        c.attorney_type = "Court Appointed")
  ) a
  GROUP BY a.attorney_type, a.charge_category
`
