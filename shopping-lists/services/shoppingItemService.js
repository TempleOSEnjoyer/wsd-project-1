import { executeQuery } from "../database/database.js";

const collect = async (shopping_list_id, item_id) => {
    await executeQuery("UPDATE shopping_list_items SET collected = true WHERE id = $item_id AND shopping_list_id = $shopping_list_id;",
    { item_id: item_id, shopping_list_id: shopping_list_id });
};

const countItems = async () => {
    let result = await executeQuery("SELECT COUNT(id) FROM shopping_list_items;");
    return result.rows[0].count;
};

const create = async (name, shopping_list_id) => {
    await executeQuery("INSERT INTO shopping_list_items (shopping_list_id, name) VALUES ($shopping_list_id, $name);", 
    { shopping_list_id: shopping_list_id, name: name });
};
  
const deleteById = async (id) => {
    await executeQuery("DELETE FROM shopping_list_items WHERE id = $id;", { id: id });
};

const findItemsOfList = async (shopping_list_id) => {
    let uncollected = await executeQuery("SELECT * FROM shopping_list_items WHERE shopping_list_id = $shopping_list_id AND collected = false;", 
    { shopping_list_id: shopping_list_id });
    let collected = await executeQuery("SELECT * FROM shopping_list_items WHERE shopping_list_id = $shopping_list_id AND collected = true;", 
    { shopping_list_id: shopping_list_id });

    return { uncollected_items: uncollected.rows, collected_items: collected.rows };
};

export { create, collect, countItems, deleteById, findItemsOfList };