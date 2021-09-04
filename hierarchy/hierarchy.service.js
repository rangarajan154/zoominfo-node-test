const {getHierarchyItemById} = require("../db/db.service");

async function getHierarchyForId(id) {
    try {
        const hierarchy = [];
        let item = await getHierarchyItemById(id);
        while (item.level !== 1 && item.parentMemberId) {
            try {
                item = await getHierarchyItemById(item.parentMemberId);
            } catch (ex) {
                console.log("Exception in [getHierarchyForId] inner", ex);
                break;
            }
            hierarchy.unshift(item.name);
        }
        return hierarchy.join(" -> ").trim();
    } catch (ex) {
        console.log("Exception in [getHierarchyForId]", ex);
        return "NOT_FOUND";
    }
}

async function checkHierarchyForId(id, parentId) {
    const idToSearch = +id;
    if (idToSearch === parentId) {
        return {isFound: true, isPresent: true};
    }
    let isFound = false;
    let isPresent = true;

    try {
        const {level: loggedInUserLevel} = await getHierarchyItemById(parentId);
        let item = await getHierarchyItemById(idToSearch);
        while (item.level > loggedInUserLevel && item.parentMemberId) {
            if (item.parentMemberId === parentId) {
                isFound = true;
                break;
            }
            item = await getHierarchyItemById(item.parentMemberId);
        }
    } catch (ex) {
        console.log("Exception in [checkHierarchyForId]", ex);
        isPresent = false;
    }
    return {isFound, isPresent};

}

module.exports = {
    getHierarchyForId,
    checkHierarchyForId
}
