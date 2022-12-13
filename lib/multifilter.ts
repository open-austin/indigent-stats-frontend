import { IFilters } from '../components/Filter'
import { Case } from '../models/Case'

// Filters data with multiple parameters
const multifilter = (data: Array<Case>, filters: IFilters) => {
    return filters.motions !== 'All'
        ? data.filter((d) => d.filters?.motions?.includes(filters.motions))
              .length
        : data.reduce(
              (a, b) =>
                  a +
                  (b.filters?.motions?.length && b.filters?.motions?.length >= 1
                      ? 1
                      : 0),
              0
          )
}

export default multifilter
