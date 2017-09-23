import * as frontend from './frontend'
import * as requests from './requests'
import * as responses from './responses'

const sum = {...frontend, ...requests, ...responses}
const dict = {}

for (let key in sum)
    if (typeof sum[key] === 'number')
        dict[sum[key]] = key

export default dict