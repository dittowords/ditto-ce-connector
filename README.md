# Ditto Content Engine Connector

This repository contains the code for Ditto's content engine connector on the Lokalise platform. More information about the content engine connectors can be found [on Lokalise's website](https://developers.lokalise.com/docs/lokalise-engines#content-engine).

In its current state, this connector enables users to import their workspace's components to be translated within Lokalise. The Ditto integration is still in the process of being added to Lokalise's app marketplace so setup instructions will be added in the future.

## Maintainers

[The MAX squad](https://lokalise.atlassian.net/wiki/spaces/PDE/pages/2501345749/MAX+Squad+-+Marketing+Persona+Experience).

## Tech stack:

- Docker
- Typescript
- Fastify

## Running

Add .env file to your project root directory based on `.env.default` but with NODE_ENV changed to development.

If needed, update host ports starting `HOST_*`

For development, use the dockerized environment:

`docker compose up -d`

The app is available at: http://localhost:3000/

We recommend the following settings to avoid port conflicts when working with the Content Engine locally:

```
HOST_APP_PORT=3488
HOST_PRIVATE_APP_PORT=9088
```

Make sure that the `/node_modules` folder is not empty.
If that's the case, you can execute the following .

```
 docker compose exec -it app npm install
 make sync-modules
```

Run tests:

`docker compose exec -it app npm run test`

Run formatting:

`docker compose exec -it app npm run format`

Run linter:

`docker compose exec -it app npm run lint`

## OpenAPI

Openapi docs are available at [connector-openapi](https://github.com/lokalise/connector-openapi/blob/master/postman/schemas/schema.yaml)
