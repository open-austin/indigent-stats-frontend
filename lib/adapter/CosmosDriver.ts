import {
    DatabaseConnection,
    QueryResult,
    Driver, 
    TransactionSettings,
    CompiledQuery,
  } from 'kysely'
  import {
    CosmosCursorConstructor,
    CosmosDialectConfig,
  } from './CosmosDialectConfig.js'
import { extendStackTrace } from '../stacktraceutils.js'
import { freeze, isFunction } from '../objectutils.js'
import { CosmosClient, SqlParameter } from '@azure/cosmos'
  
  const PRIVATE_RELEASE_METHOD = Symbol()
  
  export class CosmosDriver implements Driver {
    readonly #config: CosmosDialectConfig
    readonly #connections = new WeakMap<CosmosClient, DatabaseConnection>()
    #client?: CosmosClient
  
    constructor(config: CosmosDialectConfig) {
      this.#config = freeze({ ...config })
    }
  
    async init(): Promise<void> {
        if (isFunction(this.#config.client)) {
            this.#client = this.#config.client()
        } else {
            this.#client = this.#config.client
        }
    }
  
    async acquireConnection(): Promise<DatabaseConnection> {
      let connection = this.#connections.get(this.#client!)
  
      if (!connection) {
        connection = new CosmosConnection(this.#client!, this.#config)
        this.#connections.set(this.#client!, connection)
  
        // The driver must take care of calling `onCreateConnection` when a new
        // connection is created. The `pg` module doesn't provide an async hook
        // for the connection creation. We need to call the method explicitly.
        if (this.#config?.onCreateConnection) {
          await this.#config.onCreateConnection(connection)
        }
      }
  
      return connection
    }
  
    async beginTransaction(
      connection: DatabaseConnection,
      settings: TransactionSettings
    ): Promise<void> {
      if (settings.isolationLevel) {
        await connection.executeQuery(
          CompiledQuery.raw(
            `start transaction isolation level ${settings.isolationLevel}`
          )
        )
      } else {
        await connection.executeQuery(CompiledQuery.raw('begin'))
      }
    }
  
    async commitTransaction(connection: DatabaseConnection): Promise<void> {
      await connection.executeQuery(CompiledQuery.raw('commit'))
    }
  
    async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
      await connection.executeQuery(CompiledQuery.raw('rollback'))
    }
  
    async releaseConnection(connection: CosmosConnection): Promise<void> {
      connection[PRIVATE_RELEASE_METHOD]()
    }
  
    async destroy(): Promise<void> {
      if (this.#client) {
        const pool = this.#client
        this.#client = undefined
        await pool.dispose()
      }
    }
  }
  
  interface CosmosConnectionOptions {
    database: string
    container: string
  }
  
  class CosmosConnection implements DatabaseConnection {
    #client: CosmosClient
    #options: CosmosConnectionOptions
  
    constructor(client: CosmosClient, options: CosmosConnectionOptions) {
      this.#client = client
      this.#options = options
    }
  
    async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
      try {
        const parameters = compiledQuery.parameters as SqlParameter[]
        const result = await this.#client.database(this.#options.database).container(this.#options.container).items.query<O>({
            query: compiledQuery.sql, 
            parameters: [...parameters],
        }).fetchAll()
  
        return {
          rows: result.resources ?? [],
        }
      } catch (err) {
        throw extendStackTrace(err, new Error())
      }
    }
  
    async *streamQuery<O>(
      compiledQuery: CompiledQuery,
      chunkSize: number
    ): AsyncIterableIterator<QueryResult<O>> {
      if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
        throw new Error('chunkSize must be a positive integer')
      }
  
      const parameters = compiledQuery.parameters as SqlParameter[]
      const cursor = this.#client.database(this.#options.database).container(this.#options.container).items.query<O>({
        query: compiledQuery.sql,
        parameters: [...parameters],
      }).getAsyncIterator()
      return cursor
    }
  
    [PRIVATE_RELEASE_METHOD](): void {
      this.#client.dispose()
    }
  }
