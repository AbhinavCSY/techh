import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  if (event.httpMethod === "GET") {
    const ping = process.env.PING_MESSAGE ?? "ping";
    return {
      statusCode: 200,
      body: JSON.stringify({ message: ping }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};

export { handler };
