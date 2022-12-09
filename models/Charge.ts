import { z } from 'zod'

export type Charge = z.TypeOf<typeof chargeSchema>

export const chargeSchema = z.array(
    z.object({
        charge_id: z.number(),
        charge_name: z.string(),
        num_counts: z.number(),
        charge_date: z.string().optional(),
        is_primary_charge: z.boolean(),
        level: z.string(),
        statute: z.string(),
        statute_chapter: z.string().optional(),
        statute_section: z.string().optional(),
        charge_desc: z.string(),
        offense_category_desc: z.string(),
        offense_type_desc: z.string(),
    })
)
