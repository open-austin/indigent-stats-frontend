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

export const upsertAtMap = <A, B>(
    r: Record<string, A>,
    k: string,
    f: (a: A) => B,
    d: A
): Record<string, A | B> => {
    if (Object.hasOwn(r, k)) {
        return Object.assign({}, r, { [k]: f(r[k]) })
    }
    const out: Record<string, A> = Object.assign({}, r)
    out[k] = d
    return out
}
