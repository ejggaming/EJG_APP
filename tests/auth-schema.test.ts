import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../src/schema/auth.schema";

describe("QA Unit - auth schema", () => {
	it("accepts a valid login payload", () => {
		const result = loginSchema.safeParse({
			phoneNumber: "09171234567",
			password: "Secret123!",
		});
		expect(result.success).toBe(true);
	});

	it("rejects invalid phone number", () => {
		const result = loginSchema.safeParse({
			phoneNumber: "12345",
			password: "Secret123!",
		});
		expect(result.success).toBe(false);
	});

	it("accepts an adult registration payload", () => {
		const result = registerSchema.safeParse({
			firstName: "QA",
			lastName: "Runner",
			email: "qa.client@example.com",
			userName: "qarunner",
			phoneNumber: "09171234567",
			password: "Secret123!",
			confirmPassword: "Secret123!",
			role: "PLAYER",
			dateOfBirth: "1995-01-01",
		});
		expect(result.success).toBe(true);
	});
});
