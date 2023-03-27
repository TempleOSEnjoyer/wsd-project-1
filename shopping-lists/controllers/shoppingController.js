import { configure, renderFile } from "../deps.js";
import * as shoppingListService from "../services/shoppingListService.js";
import * as shoppingItemService from "../services/shoppingItemService.js";

configure({
    views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
      status: 303,
      headers: {
      "Location": path,
      },
  });
};

const addList = async (request) => {
  const formData = await request.formData();
  const name = formData.get("name");
  await shoppingListService.create(name);
  
  return redirectTo("/lists");
};

const addItemToShoppingList = async (request) => {
  const url = new URL(request.url);
  const splitURL = url.pathname.split("/");
  const shopping_list_id = splitURL[2];

  const formData = await request.formData();
  const item_name = formData.get("name");

  await shoppingItemService.create(item_name, shopping_list_id);
  return redirectTo(`/lists/${ splitURL[2] }`);
};

const alphaOrder = (a, b) => {
  const aa = a.name.toLowerCase().replace(/\s/g, '');
  const bb = b.name.toLowerCase().replace(/\s/g, '');

  console.log("Comparing: ", aa, bb);

  if (aa < bb) { 
    return -1;
  } else if (aa > bb) {
    return 1;
  } else {
    return 0;
  }
};

const collectItemFromShoppingList = async (request) => {
  const url = new URL(request.url);
  const splitURL = url.pathname.split("/");
  const shopping_list_id = splitURL[2];
  const item_id = splitURL[4];
  
  await shoppingItemService.collect(shopping_list_id, item_id);
  return redirectTo(`/lists/${ splitURL[2] }`);
};

const deactivateList = async (request) => {
  const url = new URL(request.url);
  const splitURL = url.pathname.split("/");
  const shopping_list_id = splitURL[2];
  await shoppingListService.deactivateListById(shopping_list_id);
  return redirectTo("/lists")
};

const getStats = async () => {
  const stats = {
    list_count: await shoppingListService.countLists(),
    item_count: await shoppingItemService.countItems(),
  };
  return stats;
};

const renderLists = async () => {
  const data = {
    lists: await shoppingListService.findLists(),
  };

  return new Response(await renderFile("shoppingLists.eta", data), responseDetails);
};

const renderList = async (request) => {
  const url = new URL(request.url);
  const splitURL = url.pathname.split("/");
  const shopping_list_id = splitURL[2];

  const items = await shoppingItemService.findItemsOfList(shopping_list_id)

  const uncollected_items = items.uncollected_items.sort(function(a, b) {
    return alphaOrder(a, b);
  });

  const collected_items = items.collected_items.sort(function(a, b)  {
    return alphaOrder(a, b);
  });

  const data = {
    uncollected_items: uncollected_items,
    collected_items: collected_items,
    shopping_list_id: shopping_list_id,
    shopping_list_name: (await shoppingListService.findListById(shopping_list_id))[0].name,
  };

  return new Response(await renderFile("shoppingItems.eta", data), responseDetails);
};

export { addList, addItemToShoppingList, collectItemFromShoppingList, deactivateList, getStats, renderList, renderLists }