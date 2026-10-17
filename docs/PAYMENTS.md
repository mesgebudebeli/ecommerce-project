# Telebirr + CBE Payment Integration

This repository provides safe integration boundaries, not completed live payment APIs.

## Before implementation
1. Open a merchant account and request the current API/checkout documentation from Telebirr and CBE (or the authorized partner product selected by your business).
2. Confirm supported payment products, callback format, signature algorithm, test environment, currencies, settlement timing, and refund process.
3. Store merchant secrets only in backend environment variables or a secrets manager.

## Required implementation
- Server-to-server checkout initiation with unique order/payment references.
- Official signing/authentication exactly as specified by the provider.
- HTTPS callback endpoint and signature verification.
- Provider status query to confirm final settlement/transaction state.
- Compare merchant ID, amount, currency, order/payment reference, and final status.
- Idempotency: processing the same callback multiple times must not duplicate state changes.
- Replay protection and safe timestamp validation.
- Reconciliation job for pending/uncertain transactions.
- Refund/cancellation support and audit trail if supported by the merchant API.

## Do not do these
- Never put merchant credentials in frontend code or `VITE_*` variables.
- Never accept a client-side `success=true` as payment proof.
- Never mark an order paid before server-side provider verification.
- Never log passwords, private keys, full payment secrets, or unnecessary personal data.

The `TelebirrService` and `CbeService` intentionally return no verified webhook result until their provider-specific verification is implemented.
