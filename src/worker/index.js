export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        message: "Worker funcionando",
      });
    }

    return env.ASSETS.fetch(request);
  },
};
