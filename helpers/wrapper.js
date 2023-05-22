
const response = (res, status, message = '', data, code) => {

    if (status === 'fail') {
        return res.status(code).json({
            status: 'fail',
            data: data,
            message: message,

        })
    }
    return res.status(code).json({
        status,
        data,
        message,
        
    })
}

const data = (data) => ({err: null, data})
const error = (err) => ({err, data: null})

module.exports = {
    response,
    data,
    error
}