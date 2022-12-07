import path from 'path'
import { promises as fs } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import ChargeEvent from '../../models/ChargeEvent'
import Charge, { RawCharge } from '../../models/Charge'

const COMBINED_CHARGES_URL = 'https://github.com/open-austin/indigent-stats-frontend/raw/main/data/combined.json'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
}

const combinedItems = (arr = []) => {
    const res = arr.reduce(
        (
            acc: Array<RawCharge & { count: number, events: Array<ChargeEvent> }>,
            obj: RawCharge & { count: number, events: Array<ChargeEvent> }
        ) => {
            let found = false
            for (let i = 0; i < acc.length; i++) {
                if (acc[i].case_number === obj.case_number) {
                    found = true
                    acc[i].count++
                    const e = new ChargeEvent(obj)
                    acc[i].events.push(e)
                }
            }
            if (!found) {
                obj.count = 1
                const event = new ChargeEvent(obj)
                obj.events = [event]
                acc.push(obj)
            }
            return acc
        },
        []
    )
    return res
}

// TODO: Host JSON externally
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    
    // const jsonDirectory = path.join(process.cwd(), 'data')

    // const fileContents = await fs.readFile(
    //     jsonDirectory + '/combined.json',
    //     'utf8'
    // )

    const file = await fetch(COMBINED_CHARGES_URL)
    const json = await file.json()

    // let data = JSON.parse(fileContents)
    const results = combinedItems(json?.results)

    const charges: Array<Charge> = []
    results.forEach((result: RawCharge) => {
        const charge = new Charge(result)
        charges.push(charge)
    })

    res.status(200).json(JSON.stringify(charges))
}
