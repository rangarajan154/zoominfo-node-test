const service = require("./hierarchy.service");

async function getHierarchyForId({id: idToSearch}) {
    const id = +idToSearch;
    if (!id || id < 0 || parseInt(id, 10) !== id) {
        return res.status(400).send({error: "id should be a positive integer"});
    }

    const hierarchy = await service.getHierarchyForId(id);

    if (hierarchy === "NOT_FOUND") {
        throw {message: "id not found", status: 404}
    }
    if (!hierarchy) {
        throw {message: "hierarchy not found", status: 400};
    }

    return hierarchy;
}


module.exports = {
    getHierarchyForId
}
