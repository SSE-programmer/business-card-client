FROM node:24-alpine AS business-card-client

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npx nx build business-card-client --prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=business-card-client /app/dist/business-card-client/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
