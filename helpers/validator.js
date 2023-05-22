const joi = require('joi')
const wrapper = require('./wrapper')

const validatePayload = (schema, payload) => {
    const {value, error} = schema.validate(payload)
    console.log( 'value: ' ,value, 'error : ', error);
    if(error){ 
        return wrapper.error(error)
    }
    return wrapper.data(value)

}

module.exports = {
    validatePayload
}