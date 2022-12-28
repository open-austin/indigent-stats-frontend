import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path';
import { promises as fs } from 'fs';
import axios from 'axios'

const COMBINED_CHARGES_URL =
    'https://github.com/open-austin/indigent-stats-frontend/raw/main/data/cases_subset.json'

export const config = {
    api: {
        responseLimit: '100mb',
        bodyParser: {
            sizeLimit: '100mb',
        },
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const jsonDirectory = path.join(process.cwd(), 'data');
    // TODO: How to improve filtering performance for larger sample size?
    const fileContents = await fs.readFile(jsonDirectory + '/nested_cases.json', 'utf8');
    res.status(200).json(fileContents);
}
