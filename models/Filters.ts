import { z } from 'zod'

export type Filters = z.TypeOf<typeof filtersSchema>

export const filtersSchema = z.object({
    motions: z.array(z.string()),
    charges: z.array(z.string()),
    chargeCategories: z.array(z.string()),
    chargeLevels: z.array(z.string()),
})
