import { z } from 'zod'

// Note: we'd like to call this just `Event`, but cannot because
// that's a reserved word in JavaScript. C'est la vie.
export type CaseEvent = z.TypeOf<typeof caseEventSchema>

export const caseEventSchema = z.array(
    z.object({ event_date: z.string(), event_name: z.string() })
)
