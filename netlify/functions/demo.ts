import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello from Express server",
      }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};

export { handler };
