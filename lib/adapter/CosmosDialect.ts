import { 
    Kysely,
    Dialect,
    DialectAdapter,
    Driver,
    DatabaseIntrospector,
    QueryCompiler,
} from 'kysely'
import { CosmosDialectConfig } from './CosmosDialectConfig'
import { CosmosAdapter } from './CosmosAdapter'
import { CosmosDriver } from './CosmosDriver'
import { CosmosIntrospector } from './CosmosIntrospector'
import { CosmosQueryCompiler } from './CosmosQueryCompiler'

export class CosmosDialect implements Dialect {
    readonly #config: CosmosDialectConfig
  
    constructor(config: CosmosDialectConfig) {
      this.#config = config
    }
  
    createDriver(): Driver {
      return new CosmosDriver(this.#config)
    }
  
    createQueryCompiler(): QueryCompiler {
      return new CosmosQueryCompiler()
    }
  
    createAdapter(): DialectAdapter {
      return new CosmosAdapter()
    }
  
    createIntrospector(db: Kysely<any>): DatabaseIntrospector {
      return new CosmosIntrospector(db)
    }
  }
