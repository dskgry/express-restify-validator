//@flow
/**
 * @author dskgry
 */

/**
 * Check if the given parameter is of type object and not null
 * @param toAssert the value to assert
 */
const isObject = (toAssert: any) => toAssert !== null && typeof toAssert === 'object';

module.exports = {
    isObject,
};
