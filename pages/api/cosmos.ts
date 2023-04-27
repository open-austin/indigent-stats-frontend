// https://vercel.com/guides/how-to-add-vercel-environment-variables
// https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/README.md

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
    const { sql, secret, container, db } = req.query

    if (secret !== process.env.NEXT_PUBLIC_COSMOSDB_SECRET) {
        return res.status(401).json({ error: 'Secret did not match' })
    }

    if (sql === '' || typeof sql === 'object' || !sql) {
        return res.status(401).json({ error: 'Query string was empty' })
    }

    if (container === '' || typeof container === 'object') {
        return res.status(401).json({
            error: 'Invalid param "container", expected string or undefined',
        })
    }

    if (db === '' || typeof db === 'object') {
        return res.status(401).json({
            error: 'Invalid param "db", expected string or undefined',
        })
    }

    try {
        const { resources: data } = await doQuery(sql, container, db)

        return res.status(200).json({ data })
    } catch (err) {
        console.log('Failed to query CosmosDB', JSON.stringify(err))

        res.status(500).json(JSON.stringify(err))
    }
}

async function doQuery(
    query: string,
    container: string = 'nested-cases',
    db: string = 'nested-cases-db'
) {
    return client
        .database(db)
        .container(container)
        .items.query(query)
        .fetchAll()
}
