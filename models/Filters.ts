import { z } from 'zod'

export type Filters = z.TypeOf<typeof filtersSchema>

export const filtersSchema = z.object({
    motions: z.array(z.string()).optional(),
    charges: z.array(z.string()).optional(),
    chargeCategories: z.array(z.string()).optional(),
    chargeLevels: z.array(z.string()).optional(),
})
