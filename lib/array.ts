export const groupBy =
    <A>(self: ReadonlyArray<A>) =>
    (f: (a: A) => string): Readonly<Record<string, Array<A>>> => {
        const out: Record<string, Array<A>> = {}
        for (const a of self) {
            const k = f(a)
            if (Object.hasOwn(out, k)) {
                out[k].push(a)
            } else {
                out[k] = [a]
            }
        }
        return out
    }
