import { serve } from "./deps.js";
import { configure, renderFile } from "./deps.js";
//import * as siteController from "./controllers/siteController.js";
import * as shoppingController from "./controllers/shoppingController.js"

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

const renderDefault = async () => {
  const stats = await shoppingController.getStats();
  return new Response(await renderFile("index.eta", stats), responseDetails);
};

const handleRequest = async (request) => {
  const url = new URL(request.url);
  console.log("PATH:", url.pathname, " METHOD:", request.method);
  if (url.pathname === "/" && request.method === "GET") {
    return await renderDefault();
  } else if (url.pathname === "/lists" && request.method === "GET") {
    return await shoppingController.renderLists();
  } else if (url.pathname === "/lists" && request.method === "POST") {
    return await shoppingController.addList(request);
  } else if (url.pathname.match("lists/[0-9]+/items/[0-9]+/collect") && request.method === "POST") {
    return await shoppingController.collectItemFromShoppingList(request);
  } else if (url.pathname.match("lists/[0-9]+/items") && request.method === "POST") {
    return await shoppingController.addItemToShoppingList(request);
  } else if (url.pathname.match("/lists/[0-9]+/deactivate") && request.method === "POST") {
    return await shoppingController.deactivateList(request);
  } else if (url.pathname.match("/lists/[0-9]+") && request.method === "GET") {
    return await shoppingController.renderList(request);
  } else {
    return redirectTo("/");
  }
};

serve(handleRequest, { port: 7777 });
