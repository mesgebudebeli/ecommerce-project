Add feature tests before deployment for:
- registration cannot create an admin account
- wrong password returns 422 and does not issue a token
- customer cannot access admin routes
- checkout recalculates product prices on the server
- insufficient stock is rejected
- invalid/forged provider callbacks never mark an order paid
- duplicate valid callbacks are idempotent
- amount/currency/reference mismatch is rejected
