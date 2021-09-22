export default function TrusredRoute({ day, month, year }: any ) {
    if (!day) {
        throw 'day is required'
    } else if (!month) {
        throw 'month is required'
    } else if (!year) {
        throw 'year is required'
    }

    /**
     * Check if day, month and year are valid numbers
     * (01) '557' -> Valid
     * (02) '247' -> Valid
     * (03) '55s' -> Not Valid
     * 
     * it's dose not matter if the typeof data was a String or number
     * unless it's able to be converted to a Number
     */
    switch (true) {
        case isNaN(Number(day)):
            throw 'day is not a valid number'
        case isNaN(Number(month)):
            throw 'month is not a valid number'
        case isNaN(Number(year)):
            throw 'year is not a valid number'
        default:
            break;
    }

    /**
     * check that day is in Range 1:31
     */
    if (day < 0) {
        throw "day cannot be smaller than 1"
    } else if (day > 31) {
        throw "day cannot be bigger than 31"
    }

    /**
     * check that month is in Range 1:12
     */
    if (month < 0) {
        throw "month cannot be smaller than 1"
    } else if (month > 12) {
        throw "month cannot be bigger than 12"
    }


    if (month !== 2) {
        /**
         * Check if day is in this month range
         */
        const this_month_length = month_length(month)
        if (month_length(month) < day) {
            throw `${month} max length is ${this_month_length} you sent ${day}`
        }

    } else if (month === 2) {
        /**
         * Feb special case
         * if year % 4 = 1 then Feb is 28
         * if year % 4 = 0 then Feb is 29
         */ 
        let feb;
        if ((year % 4 ) === 1) {
            feb = 28
        } else {
            feb = 29
        }


        if (feb < day) {
            throw `feb's lenght in year ${year} is ${feb}`
        }
    }


    return `${year}-${month < 10 ? `0${month}`: month }-${day < 10 ? `0${day}`: day }`
}

const month_length = function(month: any) {
    /**
     * Check month max length 30 or 31
     * if 12 % 2 = 0 then month length is 31
     * if 12 % 2 = 1 then month length is 30
     */

    if ((month % 2) === 0) {
        return 31
    } else {
        return 30
    }
}


