# @backstage/plugin-events-backend-module-azure

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.1.5
  - @backstage/plugin-events-node@0.1.1

## 0.1.0

### Minor Changes

- 12cd94b7e9: Adds a new module `azure` to plugin-events-backend.

  The module adds a new event router `AzureDevOpsEventRouter`.

  The event router will re-publish events received at topic `azureDevOps`
  under a more specific topic depending on their `$.eventType` value
  (e.g., `azureDevOps.git.push`).

  Please find more information at
  https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-azure/README.md.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.1.0
  - @backstage/backend-plugin-api@0.1.4
