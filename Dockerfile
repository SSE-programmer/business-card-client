FROM node:24-alpine AS business-card-client

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npx ng build --configuration production

FROM nginx/nginx-quic-qns
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=business-card-client /app/dist/business-card-client/browser /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80
EXPOSE 443/udp

CMD ["nginx", "-g", "daemon off;"]
