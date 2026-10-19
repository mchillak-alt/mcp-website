import { initializePaddle } from "@paddle/paddle-js";

// The client-side token is public by design — it only identifies the seller to
// Paddle.js and cannot authorise anything on its own.
//
// Sandbox and live are separate: swap both of these at launch, and re-run
// scripts/seed-paddle-catalog.js to get live price IDs for functions/_products.js.
export const PADDLE_CLIENT_TOKEN = "test_e170ee9f9ba28108f1663e26ac8";
export const PADDLE_ENV = "sandbox";

// While PADDLE_ENV is "sandbox", checkout is reachable only by adding ?paddle
// to a pack URL. Without this, sandbox checkout on the public site would let
// anyone buy with a test card and walk away with the real files. Flip to live
// credentials and set this true to open it to everyone.
export const PADDLE_ENABLED_FOR_EVERYONE = false;

export function paddleCheckoutEnabled(search) {
  return PADDLE_ENABLED_FOR_EVERYONE || new URLSearchParams(search).has("paddle");
}

let paddlePromise = null;

// Paddle.js refuses a second initialize, so everything shares one instance.
export function getPaddle() {
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      token: PADDLE_CLIENT_TOKEN,
      environment: PADDLE_ENV,
      // Must be registered here — Paddle ignores an eventCallback passed to
      // Checkout.open(). This is the only reliable way to learn the
      // transaction id: Paddle's success redirect does not always carry it.
      eventCallback(event) {
        if (event?.name !== "checkout.completed") return;
        const transactionId = event.data?.transaction_id;
        if (!transactionId) return;
        window.location.assign(
          `/download?transaction=${encodeURIComponent(transactionId)}`
        );
      },
    }).catch((error) => {
      // Let the next caller retry rather than caching a permanent failure.
      paddlePromise = null;
      throw error;
    });
  }
  return paddlePromise;
}
