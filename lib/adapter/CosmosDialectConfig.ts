import { CosmosClient } from '@azure/cosmos'
import { DatabaseConnection } from 'kysely'

export interface CosmosDialectConfig {
    /**
     * A Cosmos Pool instance or a function that returns one.
     *
     * If a function is provided, it's called once when the first query is executed.
     *
     * https://node-Cosmos.com/api/pool
     */
    database: string
    container: string
    client: CosmosClient | (() => CosmosClient)
    /**
     * Called once for each created connection.
     */
    onCreateConnection?: (connection: DatabaseConnection) => Promise<void>
  }
  
  export interface CosmosPoolClient {
    query<R>(
      sql: string,
      parameters: ReadonlyArray<unknown>
    ): Promise<CosmosQueryResult<R>>
    query<R>(cursor: CosmosCursor<R>): CosmosCursor<R>
    release(): void
  }
  
  export interface CosmosCursor<T> {
    read(rowsCount: number): Promise<T[]>
    close(): Promise<void>
  }
  
  export type CosmosCursorConstructor = new <T>(
    sql: string,
    parameters: unknown[]
  ) => CosmosCursor<T>
  
  export interface CosmosQueryResult<R> {
    command: 'UPDATE' | 'DELETE' | 'INSERT' | 'SELECT'
    rowCount: number
    rows: R[]
  }
  
  export interface CosmosStream<T> {
    [Symbol.asyncIterator](): AsyncIterableIterator<T>
  }
