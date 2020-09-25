/**
 * takes a collection and makes a key-value pair from the values of its
 * properties (default _id (key) and name (value))
 */
const getIdNamePair = (collection = [], id = '_id', name = 'name') => {
  const map = {};
  collection.forEach((col) => {
    const key = `${col[id]}`;
    map[key] = col[name];
  });
  return map;
};

export default getIdNamePair;
