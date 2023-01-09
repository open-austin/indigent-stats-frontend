import { IFilters } from '../components/Filters'
import { Case } from '../models/Case'

export const filterSingleProperty = (
    data: Array<Case>,
    filter: keyof IFilters,
    filters: IFilters
) => {
    if (filters[filter] === 'All') {
        return data
    }

    return data.filter(
        (d) => d.filters && d.filters[filter]?.includes(filters[filter])
    )
}

// Filters data with multiple parameters
const multifilter = (data: Array<Case>, filters: IFilters) => {
    for (const filter in filters) {
        if (filter !== 'motions') {
            data = filterSingleProperty(data, filter as keyof IFilters, filters)
        }
    }

    return data
}

export default multifilter
