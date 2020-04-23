const {isValidToUpdate} = require('../../src/utils/isValidToUpdate')

describe('isValidToUpdate', () => {
    it('should set false if the values is not included on the array of options', () => {
        const body = {
            name: 'juan'
        }
        const update = Object.keys(body)
        const options = ['name', 'email']

        expect(isValidToUpdate(update, options)).toBe(false)
    })
})