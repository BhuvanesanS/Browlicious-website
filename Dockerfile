FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY dist ./dist
COPY cms ./cms
COPY data/.gitkeep ./data/.gitkeep
COPY uploads/.gitkeep ./uploads/.gitkeep
RUN mkdir -p /app/data /app/uploads && chown -R node:node /app
USER node
ENV NODE_ENV=production
EXPOSE 8003
CMD ["node", "server.js"]
