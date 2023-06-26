import { CosmosClient } from '@azure/cosmos'
import { Kysely, sql } from 'kysely'
import { NextApiRequest, NextApiResponse } from 'next'
import { CosmosDialect } from '../../lib/adapter/CosmosDialect'
import { Database } from '../../lib/schema'

const db = new Kysely<Database>({
    // PostgresDialect requires the Cursor dependency
    dialect: new CosmosDialect({
        client: new CosmosClient({
            endpoint: process.env.COSMOSDB_ENDPOINT!,
            key: process.env.COSMOSDB_KEY!,
        }),
        database: 'cases-json-db',
        container: 'clean-cases',
    }),
    // MysqlDialect doesn't require any special configuration
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const result = await db
        .selectFrom('c')
        .select(sql`count(1)`.as('count'))
        .execute()
    res.status(200).json({ result })
}
