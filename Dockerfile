# Copyright (c) 2025 Simon-Weij
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

FROM node:24-trixie-slim AS stage

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN cd frontend && npm ci

RUN npm run build

RUN npm ci --only=production --ignore-scripts

FROM gcr.io/distroless/nodejs24-debian13

WORKDIR /app

COPY --from=stage /app/node_modules ./node_modules
COPY --from=stage /app/dist ./dist
COPY --from=stage /app/frontend/build ./frontend/build

EXPOSE 3000

USER nonroot

CMD ["dist/src/main.js"]