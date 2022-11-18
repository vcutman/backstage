# @backstage/plugin-events-backend-module-gerrit

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.5
  - @backstage/plugin-events-node@0.1.1

## 0.1.0

### Minor Changes

- 25f6d7bddb: Adds a new module `gerrit` to plugin-events-backend.

  The module adds a new event router `GerritEventRouter`.

  The event router will re-publish events received at topic `gerrit`
  under a more specific topic depending on their `$.type` value
  (e.g., `gerrit.change-merged`).

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-gerrit/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.1.0
  - @backstage/backend-plugin-api@0.1.4
