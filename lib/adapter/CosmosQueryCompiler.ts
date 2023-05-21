import { DefaultQueryCompiler } from 'kysely'

const ID_WRAP_REGEX = /"/g

export class CosmosQueryCompiler extends DefaultQueryCompiler {
  protected override sanitizeIdentifier(identifier: string): string {
    return identifier.replace(ID_WRAP_REGEX, '""')
  }
}
