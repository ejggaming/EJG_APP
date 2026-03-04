import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LoginInput } from "../src/schema/auth.schema";

const { mockApiClient } = vi.hoisted(() => ({
	mockApiClient: {
		post: vi.fn(),
		get: vi.fn(),
	},
}));

vi.mock("../src/services/apiClient", () => ({
	default: mockApiClient,
}));

import { authService } from "../src/services/authService";

describe("QA Unit - auth service", () => {
	beforeEach(() => {
		mockApiClient.post.mockReset();
		mockApiClient.get.mockReset();
	});

	it("calls /auth/login with login payload", async () => {
		const payload: LoginInput = {
			phoneNumber: "09171234567",
			password: "Secret123!",
		};
		mockApiClient.post.mockResolvedValueOnce({ data: { status: "success" } });

		await authService.login(payload);

		expect(mockApiClient.post).toHaveBeenCalledWith("/auth/login", payload);
	});

	it("calls /auth/register without confirmPassword", async () => {
		const payload = {
			firstName: "QA",
			lastName: "Client",
			email: "qa.client@example.com",
			userName: "qauser",
			phoneNumber: "09171234567",
			password: "Secret123!",
			role: "PLAYER" as const,
			dateOfBirth: "1995-01-01",
		};
		mockApiClient.post.mockResolvedValueOnce({ data: { status: "success" } });

		await authService.register(payload);

		expect(mockApiClient.post).toHaveBeenCalledWith("/auth/register", payload);
	});

	it("calls /auth/me using GET", async () => {
		mockApiClient.get.mockResolvedValueOnce({ data: { status: "success" } });

		await authService.me();

		expect(mockApiClient.get).toHaveBeenCalledWith("/auth/me");
	});
});
