import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "../src/utils/formatters";

describe("QA Unit - formatters", () => {
	it("formats date using default locale", () => {
		const result = formatDate("2026-01-15");
		expect(result.length).toBeGreaterThan(0);
	});

	it("formats php currency values", () => {
		const result = formatCurrency(1234.5, "PHP", "en-PH");
		expect(result).toContain("1,234.50");
	});
});
