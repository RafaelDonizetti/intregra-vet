const users = []

function userJoin(id, userName, room) {
    const user = { id, userName, room}
    users.push(user);
    return user
}

function getCurrentUser(id) {
    return users.find(user => user.id == id)
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1){
        return users.splice(index, 1)[0];
    }
}


module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
};