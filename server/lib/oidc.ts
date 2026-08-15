import type { JellyfinUserResponse } from '@server/api/jellyfin';
import validator from 'validator';

export interface OidcIdentity {
  subject: string;
  email: string;
  groups: string[];
  preferredUsername: string;
  name: string;
}

export function parseOidcIdentity(
  claims: Record<string, unknown>,
  requiredGroup: string
): OidcIdentity | null {
  const subject = String(claims.sub ?? '').trim();
  const email = String(claims.email ?? '')
    .trim()
    .toLowerCase();
  const groups = Array.isArray(claims.groups)
    ? claims.groups.map((group) => String(group))
    : [];
  if (
    !subject ||
    !validator.isEmail(email, { require_tld: false }) ||
    !groups.includes(requiredGroup)
  ) {
    return null;
  }
  return {
    subject,
    email,
    groups,
    preferredUsername: String(claims.preferred_username ?? '')
      .trim()
      .toLowerCase(),
    name: String(claims.name ?? '').trim(),
  };
}

export function selectJellyfinUser(
  users: JellyfinUserResponse[],
  identity: OidcIdentity,
  existingJellyfinUserId?: string | null
): JellyfinUserResponse | null {
  const candidates = new Set(
    [
      identity.preferredUsername,
      identity.email,
      identity.email.split('@')[0],
    ].filter(Boolean)
  );
  const matches = users.filter(
    (candidate) =>
      candidate.Id === existingJellyfinUserId ||
      candidates.has(candidate.Name.toLowerCase())
  );
  return new Set(matches.map((candidate) => candidate.Id)).size === 1
    ? matches[0]
    : null;
}
