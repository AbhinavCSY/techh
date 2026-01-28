import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  if (event.httpMethod === "GET") {
    const isProduction = process.env.NODE_ENV === "production";
    const devPassword = process.env.APP_PASSWORD;

    if (isProduction || !devPassword) {
      return {
        statusCode: 404,
        body: JSON.stringify({ password: null }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ password: devPassword }),
    };
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};

export { handler };
