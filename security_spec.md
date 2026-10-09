# Security Specification: Warung Bang Kobra — Status Studio AI

## 1. Data Invariants
1. Products (`/products/{productId}`) must only be created, updated, or deleted by authenticated owners whose `request.auth.uid` matches the document's `ownerId`.
2. Designs (`/designs/{designId}`) must be owned by the creator (`ownerId == request.auth.uid`), preventing other users from reading or overwriting posters.
3. Settings (`/settings/{settingId}`) document ID must correspond to the user's `ownerId` or strictly match `ownerId == request.auth.uid`.
4. Invariant fields `ownerId` and `createdAt` are immutable on update.
5. All string inputs (product name, description, titles, warung information) must be bounded in length to prevent storage abuse and DoS.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Ghost Field Product**: Attempting to inject `isAdmin: true` into a Product document.
2. **Owner Spoofing on Product**: Setting `ownerId: "victim_user_123"` when authenticated as `attacker_user_456`.
3. **Huge String Attack on Product**: Sending a 2MB string in the `name` field to exceed document limits.
4. **Negative Price on Product**: Sending `price: -50000`.
5. **Unauthorized Product Read**: An unauthenticated user reading private draft designs or attempting wildcard writes.
6. **Cross-Tenant Design Overwrite**: Attacker attempting to update another user's saved design.
7. **Ghost Field Design**: Injecting arbitrary root keys into a Design document during update.
8. **Owner Tampering on Design Update**: Attempting to change `ownerId` from `alice` to `bob` on update.
9. **Unauthenticated Design Listing**: Attempting to list all designs without authentication or filtering by `ownerId`.
10. **Settings Hijack**: Setting another user's `ownerId` in a settings document.
11. **Malicious ID Poisoning**: Document IDs with illegal path traversal characters or > 128 bytes.
12. **PII or Cross-User Data Scraping**: Scraping all products and settings across multiple tenants.

## 3. Test Runner Coverage
The test specifications confirm that any attempt to bypass tenant separation, falsify identity, inject unwanted keys, or exceed string limits returns `PERMISSION_DENIED`.
