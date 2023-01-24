/**
 * Insert or replace a key/value pair in a `ReadonlyRecord`.
 *
 * @example
 * const ob = ({ a: 1, b: 2 })
 * equal(upsertAt(ob, "a", 5), { a: 5, b: 2 });
 * equal(upsertAt(ob, "c", 5), { a: 1, b: 2, c: 5 });
 */
export const upsertAt = <A>(
    r: Record<string, A>,
    k: string,
    a: A
): Record<string, A> => {
    if (Object.hasOwn(r, k) && r[k] === a) {
        return r
    }
    const out: Record<string, A> = Object.assign({}, r)
    out[k] = a
    return out
}

/**
 * Insert or replace a key/value pair in a `ReadonlyRecord`,
 * while applying a map function to an existing value.
 *
 * @example
 * const ob = ({ a: 1, b: 2 })
 * equal(upsertAt(ob, "a", 5), { a: 5, b: 2 });
 * equal(upsertAt(ob, "c", 5), { a: 1, b: 2, c: 5 });
 */
export const upsertAtMap = <A, B>(
    rec: Record<string, A>,
    key: string,
    fun: (a: A) => B,
    val: A
): Record<string, A | B> => {
    if (Object.hasOwn(rec, key)) {
        return Object.assign({}, rec, { [key]: fun(rec[key]) })
    }
    const out: Record<string, A> = Object.assign({}, rec)
    out[key] = val
    return out
}

/**
 * Map a `Record` passing the keys to the iterating function.
 *
 * @example
 * const f = (k: string, n: number) => `${k.toUpperCase()}-${n}`;
 * assert.deepStrictEqual(mapWithIndex(f)({ a: 3, b: 5 }), { a: "A-3", b: "B-5" });
 */
export function mapWithIndex<A, B>(
    r: Record<string, A>,
    f: (k: string, a: A) => B
): Record<string, B> {
    const out: Record<string, B> = {}
    for (const k in r) {
        if (has.call(r, k)) {
            out[k] = f(k, r[k])
        }
    }
    return out
}

export const has = Object.prototype.hasOwnProperty
