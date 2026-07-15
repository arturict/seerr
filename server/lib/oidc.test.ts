import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { JellyfinUserResponse } from '@server/api/jellyfin';
import { parseOidcIdentity, selectJellyfinUser } from './oidc';

const jellyfinUser = (Id: string, Name: string): JellyfinUserResponse => ({
  Id,
  Name,
  ServerId: 'server',
  ServerName: 'Fudliflix',
  Configuration: { GroupedFolders: [] },
  Policy: { IsAdministrator: false },
});

describe('FudliHub OIDC identity mapping', () => {
  it('requires the subscriber group and exact email claim', () => {
    assert.equal(
      parseOidcIdentity(
        { sub: 'ak-1', email: 'user@example.com', groups: ['FudliHub Users'] },
        'Jellyfin Users'
      ),
      null
    );
    assert.equal(
      parseOidcIdentity(
        { sub: 'ak-1', email: 'not-an-email', groups: ['Jellyfin Users'] },
        'Jellyfin Users'
      ),
      null
    );
  });

  it('maps the immutable subject to exactly one Jellyfin profile', () => {
    const identity = parseOidcIdentity(
      {
        sub: 'ak-1',
        email: 'new.user@example.com',
        preferred_username: 'new.user@example.com',
        groups: ['Jellyfin Users'],
      },
      'Jellyfin Users'
    );
    assert.ok(identity);
    assert.equal(
      selectJellyfinUser(
        [jellyfinUser('jf-1', 'new.user'), jellyfinUser('jf-2', 'someone')],
        identity
      )?.Id,
      'jf-1'
    );
    assert.equal(
      selectJellyfinUser(
        [
          jellyfinUser('jf-1', 'new.user'),
          jellyfinUser('jf-2', 'new.user@example.com'),
        ],
        identity
      ),
      null
    );
  });
});
