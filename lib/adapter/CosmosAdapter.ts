import { Kysely, DialectAdapterBase } from "kysely"

export class CosmosAdapter extends DialectAdapterBase {
    get supportsTransactionalDdl(): boolean {
      return true
    }
  
    get supportsReturning(): boolean {
      return true
    }
  
    async acquireMigrationLock(db: Kysely<any>): Promise<void> {
      // nothing to do here either
    }
  
    async releaseMigrationLock(): Promise<void> {
      // Nothing to do here. `pg_advisory_xact_lock` is automatically released at the
      // end of the transaction and since `supportsTransactionalDdl` true, we know
      // the `db` instance passed to acquireMigrationLock is actually a transaction.
    }
  }
