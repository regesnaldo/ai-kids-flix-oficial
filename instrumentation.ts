/**
 * ─── INSTRUMENTATION — Lifecycle Hooks for MENTE.AI Runtime ─────────────────
 *
 * Next.js instrumentation hook. Runs once at server startup and registers
 * graceful shutdown handlers for the Nexus runtime ecosystem.
 *
 * PHASE 5: Cinematic Experience Layer & Oasis Runtime
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamic imports to avoid bundling server-only modules in edge runtime
    const { wsBroadcaster } = await import("@/lib/nexus/nexus.ws");
    const { nexusBus } = await import("@/lib/nexus/nexus.events");
    const { nexusRuntime } = await import("@/lib/nexus/NexusRuntime");
    const { memoryKeeper } = await import("@/lib/agents/memory-keeper");

    // ═══════════════════════════════════════════════════════════════════════════
    // BOOT SEQUENCE
    // ═══════════════════════════════════════════════════════════════════════════

    // Initialize the cognitive kernel
    if (!nexusRuntime.isInitialized) {
      nexusRuntime.init();
    }

    // Register the Memory Keeper as a first-class Nexus agent
    if (!memoryKeeper.isRegistered) {
      memoryKeeper.register();
    }

    console.log(
      `[Instrumentation] MENTE.AI runtime initialized — ` +
      `${nexusRuntime.getAllAgents().length} agents, ` +
      `${memoryKeeper.profileCount} cached profiles`
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // GRACEFUL SHUTDOWN — beforeExit handler
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * beforeExit cleanup handler.
     *
     * Fires when the Node.js event loop is about to exit with no
     * remaining work scheduled. This covers:
     *   - Server restart (npm run dev, Vercel redeploy)
     *   - Process termination (SIGTERM, SIGINT)
     *   - Test suite teardown
     *
     * Order of operations:
     *   1. Log shutdown event to RUNTIME_HEALTH channel
     *   2. Close all open SSE/WebSocket connections via wsBroadcaster
     *   3. Prevent zombie client connections on restart
     */
    const shutdownHandler = () => {
      console.log("[Instrumentation] Shutdown signal received — draining connections...");

      // Log shutdown event BEFORE closing connections
      // This ensures monitoring systems capture the shutdown event
      try {
        nexusBus.emit({
          type: "RUNTIME_HEALTH",
          subtype: "STATE_TRANSITION",
          previousState: "healthy",
          newState: "healthy",
          trigger: "[SHUTDOWN] Server graceful shutdown initiated — draining client connections",
        });
      } catch {
        // Best effort — bus may already be closed
      }

      // Close all SSE and WebSocket client connections
      // wsBroadcaster.shutdown() closes all ws clients and unsubscribes from nexusBus
      try {
        wsBroadcaster.shutdown();
        console.log(
          `[Instrumentation] Shutdown complete — all connections drained`
        );
      } catch (err) {
        console.error("[Instrumentation] Shutdown error:", err);
      }
    };

    // Register shutdown handlers
    process.on("beforeExit", shutdownHandler);

    // Also handle SIGTERM/SIGINT for forced termination
    const signalHandler = () => {
      shutdownHandler();
      process.exit(0);
    };
    process.on("SIGTERM", signalHandler);
    process.on("SIGINT", signalHandler);

    console.log("[Instrumentation] Graceful shutdown handlers registered");
  }
}
