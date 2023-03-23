import { Client } from "../deps.js";

const client = new Client();

const executeQuery = async (query, params) => {
  const response = {};
  try {
    await client.connect();
    const result = await client.queryObject(query, params);
    if (result && result.rows) {
      response.rows = result.rows;
    }
  } catch (err) {
    response.error = err;
  } finally {
    try {
      await client.end();
    } catch (err) {
      console.log(err);
    }
  }

  return response;
};

export { executeQuery };