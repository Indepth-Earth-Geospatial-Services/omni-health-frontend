# Auth Store & Login Flow - Code Review & Updates

## Summary

The auth system has been updated to align with the new backend API response structure. Several improvements have been made for type safety, validation, and security.

---

## Changes Made

### 1. **Auth Store (`auth-store.ts`)**

#### ✅ Fixed Type Definitions

- **Added `UserRole` type** for better type safety and reusability
  ```typescript
  export type UserRole = "admin" | "super_admin" | "user";
  ```
- **Fixed `phone` field type**: Changed from `string | number` to `string`
  - Backend returns phone as string, so the type should match

#### ✅ Made `user` Parameter Required

- **Changed login signature**:

  ```typescript
  // Before
  login: (token: string, facilityIds: string[], user?: User) => void;

  // After
  login: (token: string, facilityIds: string[], user: User) => void;
  ```

  - **Why**: API always returns user data; making it required enforces proper error handling

#### ✅ Added Input Validation

```typescript
login: (token: string, facilityIds: string[], user: User) => {
  // Validate inputs
  if (!token || !user || !facilityIds?.length) {
    console.error("Invalid login parameters", { token, user, facilityIds });
    return;
  }
  // ... rest of implementation
};
```

#### ✅ Improved `setCurrentFacilityId`

- Added warning logs for invalid facility selection attempts
- Better error visibility for debugging facility assignment issues

```typescript
if (!facilityIds?.includes(id)) {
  console.warn(
    `Attempted to set invalid facility ID: ${id}. Available: ${facilityIds?.join(", ")}`,
  );
  return;
}
```

#### ✅ Added `assigned_lgas` Support

- **Added to `AuthState`**: `assigned_lgas: string[] | null`
  - Stores Local Government Areas (LGAs) assigned to the user
  - Primarily used for ADMIN role to know which regions they manage
- **Updated login signature**:
  ```typescript
  login: (token: string, facilityIds: string[], user: User, assigned_lgas?: string[] | null) => void
  ```
- **Added helper hook**: `useAssignedLgas()`
  ```typescript
  const assignedLgas = useAssignedLgas(); // Returns string[]
  ```
- **Stored in sessionStorage**: Persisted along with other auth data for consistency

---

### 2. **Login Form (`login-form.tsx`)**

#### ✅ Added Response Validation

```typescript
// Validate required fields from API response
if (!user.email || !user.role || !response.facility_ids?.length) {
  throw new Error("Invalid response from server: missing required fields");
}
```

- Prevents silent failures if backend response is malformed
- Catches missing `facility_ids` (critical for multi-facility admins)

#### ✅ Improved Type Safety

- Added explicit type annotation for user object creation
- Better null handling for optional fields (first_name, last_name)

---

## Backend Response Structure

The auth-store now correctly handles:

```json
{
  "message": "string",
  "access_token": "string",
  "token_type": "string",
  "facility_ids": ["facility_1", "facility_2"],
  "assigned_lgas": ["LGA1", "LGA2"],
  "full_name": "John Doe",
  "email": "user@example.com",
  "role": "admin"
}
```

**Transformation Flow:**

1. Backend returns `full_name` → split into `first_name` & `last_name`
2. Backend returns `facility_ids` → stored in auth store's `facilityIds`
3. Backend returns `assigned_lgas` → stored in auth store's `assigned_lgas` (mainly for ADMIN roles)
4. Backend returns `role` → validated against `UserRole` enum
5. JWT decoded to extract `user_id` (backend responsibility to include)

---

## Data Flow After Login

```
API Response (LoginResponse)
         ↓
    Validation (required fields check)
         ↓
    Transform (split full_name, decode JWT, extract assigned_lgas)
         ↓
    Create User Object + Extract assigned_lgas
         ↓
    Store in Auth Store (with facilityIds, assigned_lgas)
         ↓
    Multi-Facility Admin? → Show Modal
         ↓
    Redirect to Role Dashboard
```

---

## Security Considerations

### ✅ Implemented

- **Token expiry validation** with 5-second buffer (`isTokenExpired`)
- **XSS protection** for cookie values (URL-encoded in auth data cookie)
- **Role-based access control** in middleware (proxy.ts)
- **Secure cookie settings** (SameSite=Strict, path=/)
- **Session-based tokens** (no explicit expiry = cleared on browser close)

### ⚠️ Additional Recommendations

1. **Rate Limiting** (Backend responsibility)
   - Implement on login endpoint to prevent brute force attacks
   - Suggested: 5 attempts per IP per 15 minutes

2. **CSRF Protection**
   - Ensure Next.js CSRF tokens are enabled
   - Use `SameSite=Strict` on all auth cookies ✅ (already done)

3. **Facility ID Validation**
   - Never trust frontend facility selection without server-side verification
   - Backend should validate user has access to requested facility

4. **Phone Number Storage** (if used)
   - Ensure backend validates phone format
   - Consider encryption for PII at rest

5. **Token Signature Verification**
   - Backend must verify token signature
   - Don't accept unsigned tokens (already backend responsibility)

---

## Testing Recommendations

### Unit Tests Needed

1. **Login with valid credentials**
   - Verify user, token, and facilityIds are stored correctly
   - Check multi-facility modal appears for admins with 2+ facilities

2. **Login with single facility**
   - Verify direct redirect without modal

3. **Invalid response handling**
   - Missing `facility_ids`
   - Missing `role`
   - Missing `user_id` in JWT

4. **Facility selection**
   - Verify invalid facility IDs are rejected
   - Verify facility list is updated correctly

### E2E Tests Needed

1. Complete login flow with email/password
2. Multi-facility selection workflow
3. Token expiry and re-login
4. Logout and cookie cleanup

---

## Files Modified

1. `src/features/auth/auth-store.ts`
   - Added `UserRole` type
   - Made `user` parameter required
   - Added input validation
   - Improved error logging

2. `src/features/auth/components/login-form.tsx`
   - Added response validation
   - Improved type safety

---

## Using assigned_lgas in Components

### Example: Display Assigned LGAs for Admin

```typescript
"use client";
import { useAssignedLgas } from "@/features/auth/auth-store";

export function AdminDashboard() {
  const assignedLgas = useAssignedLgas(); // Returns string[]

  return (
    <div>
      <h2>Your Assigned LGAs</h2>
      {assignedLgas.length > 0 ? (
        <ul>
          {assignedLgas.map((lga) => (
            <li key={lga}>{lga}</li>
          ))}
        </ul>
      ) : (
        <p>No LGAs assigned</p>
      )}
    </div>
  );
}
```

### Store Access

```typescript
// Direct store access if needed
import { useAuthStore } from "@/features/auth/auth-store";

const assignedLgas = useAuthStore((state) => state.assigned_lgas);
```

---

## Migration Notes

### Breaking Changes

- The `user` parameter in `login()` is now required
- Any code calling `login()` without the `user` object will fail
- The `assigned_lgas` parameter is now optional but recommended to pass from API response

### Backwards Compatibility

- Existing auth data stored in sessionStorage is compatible
- No changes needed to stored tokens
- No database migrations required

---

## Checklist for Production Deployment

- [ ] All login tests passing
- [ ] Multi-facility admin flow tested
- [ ] Token expiry behavior verified
- [ ] Facility selection modal working
- [ ] assigned_lgas properly stored and accessible
- [ ] useAssignedLgas hook working in components
- [ ] Error messages user-friendly
- [ ] No console errors in browser
- [ ] Cookies properly set/cleared
- [ ] Middleware role enforcement verified
- [ ] Rate limiting enabled on backend
- [ ] CORS settings validated

---

## Related Files

- **Types**: `src/services/auth.service.ts` (LoginResponse interface)
- **Middleware**: `src/proxy.ts` (route protection)
- **Token Utils**: `src/lib/token.ts` (JWT handling)
- **Constants**: `src/lib/auth-constants.ts` (storage keys)
- **Facility Modal**: `src/features/auth/components/FacilitySelectionModal.tsx`

---

## Code Quality Metrics

| Aspect          | Status      | Notes                                        |
| --------------- | ----------- | -------------------------------------------- |
| Type Safety     | ✅ Improved | Added UserRole type, fixed phone field       |
| Error Handling  | ✅ Enhanced | Added validation, better error messages      |
| Security        | ✅ Good     | Session tokens, SameSite cookies, RBAC       |
| Performance     | ✅ Good     | No unnecessary re-renders, efficient storage |
| Maintainability | ✅ Good     | Clear comments, single source of truth       |
