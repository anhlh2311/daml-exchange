import { LiquidityProviderService } from "../src/liquidityProvider";
import { LedgerService } from "../src/ledger";
import { config } from "../src/config";

// Mock the entire @daml/ledger module
const mockLedgerClient = {
	query: jest.fn(),
	fetch: jest.fn(),
	exercise: jest.fn(),
};

jest.mock("@daml/ledger", () => ({
	Ledger: jest.fn().mockImplementation(() => mockLedgerClient),
}));

describe("Integration Tests", () => {
	let service: LiquidityProviderService;

	beforeEach(() => {
		// Use fake timers to control polling behavior
		jest.useFakeTimers();

		service = new LiquidityProviderService();
		jest.clearAllMocks();

		// Mock config to use shorter polling interval for tests
		Object.defineProperty(config.service, "pollingIntervalMs", {
			value: 100,
			writable: true,
		});

		// Mock config to match test data
		Object.defineProperty(config.parties, "liquidityProvider", {
			value: "TestLiquidityProvider",
			writable: true,
		});

		Object.defineProperty(config.autoAccept, "enabled", {
			value: true,
			writable: true,
		});

		// Mock LedgerService methods to prevent actual network calls
		jest.spyOn(LedgerService.prototype, "connect").mockResolvedValue({
			client: mockLedgerClient as any,
			party: "TestLiquidityProvider::abcdef1234567890" as any,
		});
		jest.spyOn(LedgerService.prototype, "disconnect").mockResolvedValue();
		jest.spyOn(
			LedgerService.prototype,
			"querySwapRequests",
		).mockImplementation(() => Promise.resolve([]));
		jest.spyOn(
			LedgerService.prototype,
			"queryTokenLedgers",
		).mockResolvedValue([]);
		jest.spyOn(
			LedgerService.prototype,
			"fetchInputTokenLock",
		).mockResolvedValue({
			symbol: "USDT",
			amount: "1086.08",
			owner: "UsdtOwner::222222222222",
			recipient: "TestLiquidityProvider::abcdef1234567890",
		});
		jest.spyOn(
			LedgerService.prototype,
			"acceptSwapRequest",
		).mockResolvedValue(["lp-token-ledger-cid", "accepted-swap-cid"]);
		jest.spyOn(
			LedgerService.prototype,
			"rejectSwapRequest",
		).mockResolvedValue("rejected-token-lock-cid");
	});

	afterEach(async () => {
		try {
			await service.stop();
		} catch (error) {
			// Ignore errors during cleanup
		}
		// Restore real timers
		jest.useRealTimers();
	});

	describe("Full Swap Processing Flow", () => {
		it("should process a complete USDT->BTC swap successfully", async () => {
			// Setup: Mock a USDT to BTC swap request
			const swapRequest = {
				contractId: "swap-usdt-btc-001",
				payload: {
					swapper: "Alice::1234567890abcdef",
					liquidityProvider:
						"TestLiquidityProvider::abcdef1234567890",
					admin: "Admin::fedcba0987654321",
					tokenPairKey: {
						_1: "Admin::fedcba0987654321",
						_2: { _1: "BtcOwner::111111111111", _2: "BTC" },
						_3: { _1: "UsdtOwner::222222222222", _2: "USDT" },
					},
					inputAmount: "1086.08",
					expectedOutputAmount: "0.01",
					inputTokenLockCid: "token-lock-usdt-001",
					outputTokenLockCid: null,
					slippageTolerance: "0.05",
					registryKey: "Admin::fedcba0987654321",
				},
			};

			const inputTokenLock = {
				owner: "UsdtOwner::222222222222",
				recipient: "TestLiquidityProvider::abcdef1234567890",
				symbol: "USDT",
				amount: "1086.08",
				observers: [],
			};

			// Mock the LedgerService responses
			jest.spyOn(LedgerService.prototype, "querySwapRequests")
				.mockResolvedValueOnce([swapRequest]) // Initial query returns the swap request
				.mockResolvedValue([]); // Subsequent queries return empty (swap processed)

			jest.spyOn(
				LedgerService.prototype,
				"fetchInputTokenLock",
			).mockResolvedValue(inputTokenLock);

			jest.spyOn(
				LedgerService.prototype,
				"acceptSwapRequest",
			).mockResolvedValue(["lp-usdt-ledger-001", "accepted-swap-001"]);

			// Start the service (this will complete the initial scan)
			const startPromise = service.start();

			// Wait for the start to complete
			await startPromise;

			// Advance time to trigger polling cycle
			jest.advanceTimersByTime(100);

			// Allow async operations to complete
			await Promise.resolve();

			// Verify the flow
			expect(
				LedgerService.prototype.querySwapRequests,
			).toHaveBeenCalled();
			expect(
				LedgerService.prototype.fetchInputTokenLock,
			).toHaveBeenCalledWith("token-lock-usdt-001");
			expect(
				LedgerService.prototype.acceptSwapRequest,
			).toHaveBeenCalledWith("swap-usdt-btc-001", [
				"BtcOwner::111111111111",
				"TestLiquidityProvider::abcdef1234567890",
			]);
		});

		it("should process a complete BTC->USDT swap successfully", async () => {
			// Setup: Mock a BTC to USDT swap request
			const swapRequest = {
				contractId: "swap-btc-usdt-001",
				payload: {
					swapper: "Bob::abcdef1234567890",
					liquidityProvider:
						"TestLiquidityProvider::abcdef1234567890",
					admin: "Admin::fedcba0987654321",
					tokenPairKey: {
						_1: "Admin::fedcba0987654321",
						_2: { _1: "BtcOwner::111111111111", _2: "BTC" },
						_3: { _1: "UsdtOwner::222222222222", _2: "USDT" },
					},
					inputAmount: "0.005",
					expectedOutputAmount: "547.415",
					inputTokenLockCid: "token-lock-btc-001",
					outputTokenLockCid: null,
					slippageTolerance: "0.05",
					registryKey: "Admin::fedcba0987654321",
				},
			};

			const inputTokenLock = {
				owner: "BtcOwner::111111111111",
				recipient: "TestLiquidityProvider::abcdef1234567890",
				symbol: "BTC",
				amount: "0.005",
				observers: [],
			};

			// Mock the ledger responses
			jest.spyOn(LedgerService.prototype, "querySwapRequests")
				.mockResolvedValueOnce([swapRequest])
				.mockResolvedValue([]);

			jest.spyOn(
				LedgerService.prototype,
				"fetchInputTokenLock",
			).mockResolvedValue(inputTokenLock);

			jest.spyOn(
				LedgerService.prototype,
				"acceptSwapRequest",
			).mockResolvedValue(["lp-btc-ledger-001", "accepted-swap-001"]);

			// Start the service (this will complete the initial scan)
			const startPromise = service.start();

			// Wait for the start to complete
			await startPromise;

			// Advance time to trigger polling cycle
			jest.advanceTimersByTime(100);
			await Promise.resolve();

			// Verify BTC->USDT swap processing
			expect(
				LedgerService.prototype.querySwapRequests,
			).toHaveBeenCalled();
			expect(
				LedgerService.prototype.fetchInputTokenLock,
			).toHaveBeenCalledWith("token-lock-btc-001");
			expect(
				LedgerService.prototype.acceptSwapRequest,
			).toHaveBeenCalledWith("swap-btc-usdt-001", [
				"UsdtOwner::222222222222",
				"TestLiquidityProvider::abcdef1234567890",
			]);
		});

		it("should handle multiple concurrent swap requests", async () => {
			// Setup: Multiple swap requests
			const swapRequests = [
				{
					contractId: "swap-001",
					payload: {
						swapper: "Alice::123",
						liquidityProvider:
							"TestLiquidityProvider::abcdef1234567890",
						tokenPairKey: {
							_1: "Admin::789",
							_2: { _1: "BtcOwner::111", _2: "BTC" },
							_3: { _1: "UsdtOwner::222", _2: "USDT" },
						},
						inputTokenLockCid: "lock-001",
					},
				},
				{
					contractId: "swap-002",
					payload: {
						swapper: "Bob::456",
						liquidityProvider:
							"TestLiquidityProvider::abcdef1234567890",
						tokenPairKey: {
							_1: "Admin::789",
							_2: { _1: "BtcOwner::111", _2: "BTC" },
							_3: { _1: "UsdtOwner::222", _2: "USDT" },
						},
						inputTokenLockCid: "lock-002",
					},
				},
			];

			jest.spyOn(LedgerService.prototype, "querySwapRequests")
				.mockResolvedValueOnce(swapRequests)
				.mockResolvedValue([]);

			jest.spyOn(
				LedgerService.prototype,
				"fetchInputTokenLock",
			).mockResolvedValue({
				symbol: "USDT",
				amount: "100",
				owner: "UsdtOwner::222",
			});

			jest.spyOn(
				LedgerService.prototype,
				"acceptSwapRequest",
			).mockResolvedValue(["ledger-cid", "swap-cid"]);

			await service.start();
			jest.advanceTimersByTime(100);
			await Promise.resolve();

			// Both swaps should be processed
			expect(
				LedgerService.prototype.fetchInputTokenLock,
			).toHaveBeenCalledTimes(2);
			expect(
				LedgerService.prototype.acceptSwapRequest,
			).toHaveBeenCalledTimes(2);
		});
	});

	describe("Error Handling Scenarios", () => {
		it("should handle contract validation failures gracefully", async () => {
			const swapRequest = {
				contractId: "failing-swap-001",
				payload: {
					swapper: "Alice::123",
					liquidityProvider:
						"TestLiquidityProvider::abcdef1234567890",
					tokenPairKey: {
						_1: "Admin::789",
						_2: { _1: "BtcOwner::111", _2: "BTC" },
						_3: { _1: "UsdtOwner::222", _2: "USDT" },
					},
					inputTokenLockCid: "lock-1",
				},
			};

			jest.spyOn(
				LedgerService.prototype,
				"querySwapRequests",
			).mockResolvedValue([swapRequest]);

			jest.spyOn(
				LedgerService.prototype,
				"fetchInputTokenLock",
			).mockResolvedValue({
				symbol: "USDT",
				amount: "100",
				owner: "UsdtOwner::222",
			});

			jest.spyOn(
				LedgerService.prototype,
				"acceptSwapRequest",
			).mockRejectedValue(new Error("Insufficient balance"));

			await service.start();
			jest.advanceTimersByTime(100);
			await Promise.resolve();

			// Should continue running despite validation failure
			expect(service["isRunning"]).toBe(true);
		});

		it("should handle missing TokenTransferLock contracts", async () => {
			const swapRequest = {
				contractId: "swap-missing-lock-001",
				payload: {
					swapper: "Alice::123",
					liquidityProvider:
						"TestLiquidityProvider::abcdef1234567890",
					tokenPairKey: {
						_1: "Admin::789",
						_2: { _1: "BtcOwner::111", _2: "BTC" },
						_3: { _1: "UsdtOwner::222", _2: "USDT" },
					},
					inputTokenLockCid: "missing-lock",
				},
			};

			jest.spyOn(
				LedgerService.prototype,
				"querySwapRequests",
			).mockResolvedValue([swapRequest]);

			jest.spyOn(
				LedgerService.prototype,
				"fetchInputTokenLock",
			).mockRejectedValue(
				new Error("TokenTransferLock contract not found"),
			);

			await service.start();
			jest.advanceTimersByTime(100);
			await Promise.resolve();

			expect(service["isRunning"]).toBe(true);
		});

		it("should handle network connectivity issues", async () => {
			jest.spyOn(LedgerService.prototype, "querySwapRequests")
				.mockRejectedValueOnce(new Error("Network timeout"))
				.mockRejectedValueOnce(new Error("Connection failed"))
				.mockResolvedValue([]);

			await service.start();

			// Advance time through multiple polling cycles
			jest.advanceTimersByTime(300);
			await Promise.resolve();

			// Should have recovered and queried again (initial + 3 polling cycles)
			expect(
				LedgerService.prototype.querySwapRequests,
			).toHaveBeenCalledTimes(4);
		});
	});

	describe("Party Matching Logic", () => {
		it("should extract correct party display name", () => {
			const service = new LiquidityProviderService();
			expect(service["extractPartyDisplayName"]("TestLP::123")).toBe(
				"TestLP",
			);
			expect(service["extractPartyDisplayName"]("OtherLP::456")).toBe(
				"OtherLP",
			);
		});

		it("should only process swaps intended for this LP", async () => {
			// Clear mocks to ensure clean state for this test
			jest.clearAllMocks();

			const swapRequests = [
				{
					contractId: "swap-for-this-lp",
					payload: {
						swapper: "Alice::123",
						liquidityProvider:
							"TestLiquidityProvider::abcdef1234567890",
						tokenPairKey: {
							_1: "Admin::789",
							_2: { _1: "BtcOwner::111", _2: "BTC" },
							_3: { _1: "UsdtOwner::222", _2: "USDT" },
						},
						inputTokenLockCid: "lock-001",
					},
				},
				{
					contractId: "swap-for-other-lp",
					payload: {
						swapper: "Bob::456",
						liquidityProvider: "OtherLiquidityProvider::xyz",
						tokenPairKey: {
							_1: "Admin::789",
							_2: { _1: "BtcOwner::111", _2: "BTC" },
							_3: { _1: "UsdtOwner::222", _2: "USDT" },
						},
						inputTokenLockCid: "lock-002",
					},
				},
			];

			// Re-setup the mocks for this specific test
			jest.spyOn(LedgerService.prototype, "connect").mockResolvedValue({
				client: mockLedgerClient as any,
				party: "TestLiquidityProvider::abcdef1234567890" as any,
			});
			jest.spyOn(
				LedgerService.prototype,
				"disconnect",
			).mockResolvedValue();
			jest.spyOn(
				LedgerService.prototype,
				"querySwapRequests",
			).mockResolvedValueOnce(swapRequests)  // First call returns the request
			.mockResolvedValue([]);  // Subsequent calls return empty (request was processed)

			jest.spyOn(
				LedgerService.prototype,
				"fetchInputTokenLock",
			).mockResolvedValue({
				symbol: "USDT",
				amount: "100",
				owner: "UsdtOwner::222",
			});

			jest.spyOn(
				LedgerService.prototype,
				"acceptSwapRequest",
			).mockResolvedValue(["ledger-cid", "swap-cid"]);

			await service.start();
			jest.advanceTimersByTime(100);
			await Promise.resolve();

			// Should only process the swap intended for this LP
			expect(
				LedgerService.prototype.fetchInputTokenLock,
			).toHaveBeenCalledTimes(1);
			expect(
				LedgerService.prototype.fetchInputTokenLock,
			).toHaveBeenCalledWith("lock-001");
			expect(
				LedgerService.prototype.acceptSwapRequest,
			).toHaveBeenCalledTimes(1);
		});
	});

	describe("Token Pair Logic", () => {
		it("should correctly determine output token for different input tokens", async () => {
			const btcToUsdtSwap = {
				contractId: "btc-to-usdt",
				payload: {
					swapper: "Alice::123",
					liquidityProvider: "TestLiquidityProvider::456",
					tokenPairKey: {
						_1: "Admin::789",
						_2: { _1: "BtcOwner::111", _2: "BTC" },
						_3: { _1: "UsdtOwner::222", _2: "USDT" },
					},
					inputTokenLockCid: "btc-lock",
				},
			};

			jest.spyOn(
				LedgerService.prototype,
				"querySwapRequests",
			).mockResolvedValue([btcToUsdtSwap]);

			jest.spyOn(
				LedgerService.prototype,
				"fetchInputTokenLock",
			).mockResolvedValue({
				symbol: "BTC",
				amount: "1.0",
				owner: "BtcOwner::111",
			});

			jest.spyOn(
				LedgerService.prototype,
				"acceptSwapRequest",
			).mockResolvedValue(["ledger-cid", "swap-cid"]);

			await service.start();
			jest.advanceTimersByTime(100);
			await Promise.resolve();

			// For BTC input, LP should provide USDT
			expect(
				LedgerService.prototype.acceptSwapRequest,
			).toHaveBeenCalledWith("btc-to-usdt", [
				"UsdtOwner::222",
				"TestLiquidityProvider::456",
			]);
		});

		it("should handle invalid token symbols gracefully", async () => {
			const invalidTokenSwap = {
				contractId: "invalid-token-swap",
				payload: {
					swapper: "Alice::123",
					liquidityProvider: "TestLiquidityProvider::456",
					tokenPairKey: {
						_1: "Admin::789",
						_2: { _1: "BtcOwner::111", _2: "BTC" },
						_3: { _1: "UsdtOwner::222", _2: "USDT" },
					},
					inputTokenLockCid: "invalid-lock",
				},
			};

			jest.spyOn(
				LedgerService.prototype,
				"querySwapRequests",
			).mockResolvedValue([invalidTokenSwap]);

			jest.spyOn(
				LedgerService.prototype,
				"fetchInputTokenLock",
			).mockResolvedValue({
				symbol: "ETH",
				amount: "10.0",
				owner: "EthOwner::333",
			}); // Invalid token

			await service.start();
			jest.advanceTimersByTime(100);
			await Promise.resolve();

			// Should not call acceptSwapRequest for invalid token
			expect(
				LedgerService.prototype.acceptSwapRequest,
			).not.toHaveBeenCalled();
		});
	});

	describe("Service Lifecycle", () => {
		it("should start and stop cleanly", async () => {
			await service.start();
			expect(service["isRunning"]).toBe(true);

			await service.stop();
			expect(service["isRunning"]).toBe(false);
		});

		it("should handle multiple start/stop cycles", async () => {
			await service.start();
			await service.stop();
			await service.start();
			await service.stop();

			expect(service["isRunning"]).toBe(false);
		});
	});
});
