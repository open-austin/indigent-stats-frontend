// https://vercel.com/guides/how-to-add-vercel-environment-variables
// https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/README.md

import { CosmosClient } from '@azure/cosmos'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        responseLimit: '500mb',
    },
}

const client = new CosmosClient({
    endpoint: process.env.COSMOSDB_ENDPOINT ?? 'COSMOSDB_ENDPOINT_MISSING',
    key: process.env.COSMOSDB_KEY ?? 'COSMOSDB_KEY_MISSING',
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { sql, secret } = req.query

    if (secret !== process.env.NEXT_PUBLIC_COSMOSDB_SECRET) {
        return res.status(401).json({ error: 'Secret did not match' })
    }

    if (sql === '' || typeof sql === 'object' || !sql) {
        return res.status(401).json({ error: 'Query string was empty' })
    }

    try {
        const { resources: data } = await doQuery(sql)

        return res.status(200).json({ data })
    } catch (err) {
        console.log('Failed to query CosmosDB', JSON.stringify(err))

        res.status(500).json(JSON.stringify(err))
    }
}

async function doQuery(query: string) {
    return client
        .database('nested-cases-db')
        .container('nested-cases')
        .items.query(query)
        .fetchAll()
}
