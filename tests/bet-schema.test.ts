import { describe, expect, it } from "vitest";
import { betSchema } from "../src/schema/bet.schema";

describe("QA Unit - bet schema", () => {
	it("accepts valid bet payload", () => {
		const result = betSchema.safeParse({
			numbers: [3, 17],
			amount: 25,
			drawId: "draw-123",
		});
		expect(result.success).toBe(true);
	});

	it("rejects duplicate numbers", () => {
		const result = betSchema.safeParse({
			numbers: [11, 11],
			amount: 25,
			drawId: "draw-123",
		});
		expect(result.success).toBe(false);
	});

	it("rejects amount below minimum", () => {
		const result = betSchema.safeParse({
			numbers: [11, 22],
			amount: 1,
			drawId: "draw-123",
		});
		expect(result.success).toBe(false);
	});
});
