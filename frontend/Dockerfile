FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json postcss.config.js tailwind.config.js next.config.js ./
COPY src ./src
RUN ls -la src/ && ls -la src/lib/ && ls -la src/components/
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S cl && adduser -S cl -G cl
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
USER cl
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000 || exit 1
CMD ["npm", "start"]
