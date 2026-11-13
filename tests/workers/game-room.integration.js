import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

describe("GameRoom Durable Object", () => {
  it("responde pela instância obtida no binding ROOMS", async () => {
    const id = env.ROOMS.idFromName("game-room-health-integration-test");
    const stub = env.ROOMS.get(id);
    const response = await stub.fetch("https://game-room.test/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ok",
      service: "GameRoom",
    });
  });
});