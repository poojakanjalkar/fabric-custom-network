const { v4: uuidv4 } = require('uuid');

const requestInfo = async (req, _res, next) => {
    req.loggerInfo = { requestId: uuidv4() }
    next()
}

module.exports = {
    requestInfo
}