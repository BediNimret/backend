const map = new Map();

const setUser = (id, user) => {
  map.set(id, user);
};

const getUser = (id) => {
  return map.get(id) || null;
};

const deleteUser = (id) => {
  return map.delete(id);
};

module.exports = { setUser, getUser, deleteUser };
