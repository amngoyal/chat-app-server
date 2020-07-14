const users = [];

const addUsers = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const userExists = users.find(user => user.name === name && user.room === room);

    if (userExists) {
        return { error: "Username is taken" };
    }

    const newUser = { id, name, room };

    users.push(newUser);

    return newUser;
}

const removeUsers = (id) => {

    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex !== -1) {
        return users.splice(userIndex, 1)[0];
    }

}

const getUser = (id) => users.find(user => user.id === id);

const getUsersInRoom = (room) => users.filter(user => user.room === room);

module.exports = {addUsers, removeUsers, getUser, getUsersInRoom}