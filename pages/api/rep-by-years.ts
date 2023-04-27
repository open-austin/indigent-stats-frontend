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
        const { resources: data } = await client
            .database('nested-cases-db')
            .container('nested-cases')
            .items.query(REPRESENTATION_BY_YEAR_QUERY)
            .fetchAll()

        return res.status(200).json({ data })
    } catch (err) {
        console.log('Failed to query CosmosDB', JSON.stringify(err))

        res.status(500).json(JSON.stringify(err))
    }
}

const REPRESENTATION_BY_YEAR_QUERY = `
SELECT
  c.attorney_type,
  c.has_evidence_of_representation,
  DateTimePart("year", c.earliest_charge_date) AS year,
  COUNT(1) AS case_count
 FROM c
 WHERE
  IS_DEFINED(c.has_evidence_of_representation)
  AND DateTimePart("year", c.earliest_charge_date) > 2007
  AND (
       c.attorney_type = "Court Appointed"
    OR c.attorney_type = "Retained"
  )
 GROUP BY
  DateTimePart("year", c.earliest_charge_date),
  c.has_evidence_of_representation,
  c.attorney_type
`
