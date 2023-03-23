import { executeQuery } from "../database/database.js";

const countLists = async () => {
    let result = await executeQuery("SELECT COUNT(id) FROM shopping_lists;");
    return result.rows[0].count;
};

const create = async (name) => {
    await executeQuery("INSERT INTO shopping_lists (name) VALUES ($name);", { name: name });
};

const deactivateListById = async (id) => {
    await executeQuery("UPDATE shopping_lists SET active = false WHERE id = $id;", { id: id });
};

const deleteById = async (id) => {
    await executeQuery("DELETE FROM shopping_lists WHERE id = $id;", { id: id });
};

const findListById = async (id) => {
    let result = await executeQuery("SELECT * FROM shopping_lists WHERE id = $id AND active = true;", { id: id });
    return result.rows;
};

const findLists = async () => {
    let result = await executeQuery("SELECT * FROM shopping_lists WHERE active = true;");
    return result.rows;
};

export { countLists, create, deactivateListById, deleteById, findListById, findLists };