FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

ENV NODE_ENV=production
ENV VITE_API_URL=http://localhost:3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
