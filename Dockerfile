FROM node:current-alpine as build
WORKDIR /app
COPY . ./
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile && \
    pnpm build && \ 
    pnpm prune --prod


FROM ghcr.io/puppeteer/puppeteer:latest
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json /app/dist ./
RUN npx puppeteer browsers install chrome

CMD node app.js
   
