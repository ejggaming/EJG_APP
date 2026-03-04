import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "../src/store/useAppStore";

beforeEach(() => {
	useAppStore.setState({
		user: null,
		isAuthenticated: false,
		isInitialized: false,
		balance: 0,
		betSlip: [],
		pendingBet: null,
		pendingFinancePing: 0,
		pendingKycPing: 0,
		isLoading: false,
	});
});

describe("QA Unit - app store", () => {
	it("setUser updates auth flag and wallet balance", () => {
		useAppStore.getState().setUser({
			id: "u1",
			email: "qa.client@example.com",
			userName: "qauser",
			role: "PLAYER",
			isEmailVerified: true,
			isPhoneVerified: true,
			phoneNumber: "09171234567",
			status: "active",
			avatar: null,
			lastLogin: null,
			person: { firstName: "QA", lastName: "Client" },
			wallet: {
				id: "w1",
				balance: 1250,
				bonus: 0,
				currency: "PHP",
				status: "active",
			},
			kyc: null,
			agent: null,
		});

		const state = useAppStore.getState();
		expect(state.isAuthenticated).toBe(true);
		expect(state.balance).toBe(1250);
		expect(state.user?.email).toBe("qa.client@example.com");
	});

	it("manages bet slip add/remove/clear", () => {
		useAppStore.getState().addToBetSlip({
			id: "b1",
			numbers: [1, 2],
			amount: 50,
			drawId: "d1",
			drawLabel: "Draw 1",
		});
		useAppStore.getState().addToBetSlip({
			id: "b2",
			numbers: [3, 4],
			amount: 25,
			drawId: "d1",
			drawLabel: "Draw 1",
		});

		expect(useAppStore.getState().betSlip).toHaveLength(2);
		useAppStore.getState().removeFromBetSlip("b1");
		expect(useAppStore.getState().betSlip).toHaveLength(1);
		useAppStore.getState().clearBetSlip();
		expect(useAppStore.getState().betSlip).toHaveLength(0);
	});

	it("logout clears auth state and bet slip", () => {
		useAppStore.setState({
			isAuthenticated: true,
			balance: 999,
			betSlip: [
				{
					id: "b1",
					numbers: [7, 8],
					amount: 20,
					drawId: "d1",
					drawLabel: "Draw 1",
				},
			],
		});

		useAppStore.getState().logout();
		const state = useAppStore.getState();
		expect(state.isAuthenticated).toBe(false);
		expect(state.balance).toBe(0);
		expect(state.betSlip).toHaveLength(0);
	});
});
