import { CosmosClient } from '@azure/cosmos'

let instance: CosmosClient | null = null

export function getCosmosClient() {
    if (!instance) {
        // Create a new instance if one doesn't already exist
        instance = new CosmosClient({
            endpoint:
                process.env.COSMOSDB_ENDPOINT ?? 'COSMOSDB_ENDPOINT_MISSING',
            key: process.env.COSMOSDB_KEY ?? 'COSMOSDB_KEY_MISSING',
        })
    }

    return instance
}
