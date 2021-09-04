const _ = require('lodash');
const service = require("../hierarchy/hierarchy.service");

module.exports = async function (req, res, next) {
    try {
        console.log(`[checkHierarchy] getMemberById, id: ${req.params.id}`);
        const {locals: {account = {}} = {}} = res;
        const {id: loggedInUserId} = account;
        const {isFound, isPresent} = await service.checkHierarchyForId(req.params.id, loggedInUserId);
        if (!isPresent) {
            throw {status: 404, message: 'not found'};
        }
        if (!isFound) {
            throw {status: 403, message: 'not allowed'};
        }
        next();
    } catch (err) {
        const errMessage = _.get(err, 'message', 'error occurred');
        const errCode = _.get(err, 'status', 500);
        res.status(errCode).json({message: 'error occurred', error: errMessage});
    }
}
