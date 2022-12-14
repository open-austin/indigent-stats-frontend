import { IFilters } from '../components/Filter'
import { Case } from '../models/Case'

const filterSingleProperty = (
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
    let filteredData =
        filters.motions !== 'All'
            ? data.filter((d) => d.filters?.motions?.includes(filters.motions))
            : data.filter((d) => !!d.filters?.motions?.length)

    for (const filter in filters) {
        if (filter !== 'motions') {
            filteredData = filterSingleProperty(
                filteredData,
                filter as keyof IFilters,
                filters
            )
        }
    }

    return filteredData.length
}

export default multifilter
