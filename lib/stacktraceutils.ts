import { isObject, isString } from './objectutils'

export function extendStackTrace(err: unknown, stackError: Error): unknown {
  if (isStackHolder(err) && stackError.stack) {
    // Remove the first line that just says `Error`.
    const stackExtension = stackError.stack.split('\n').slice(1).join('\n')

    err.stack += `\n${stackExtension}`
    return err
  }

  return err
}

interface StackHolder {
  stack: string
}

function isStackHolder(obj: unknown): obj is StackHolder {
  return isObject(obj) && isString(obj.stack)
}
