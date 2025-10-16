
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}


RUN echo "Building frontend with API=${REACT_APP_API_BASE_URL}" && npm run build


FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
