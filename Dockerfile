# FROM node:16-alpine as builder
# WORKDIR '/app'
# COPY package.json .
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx
# COPY --from=builder /app/build /usr/share/nginx/html

#Base Image node:12.18.4-alpine
FROM node:12.18.4-alpine as build


#Set working directory to /app
WORKDIR /app


# #Set PATH /app/node_modules/.bin
# ENV PATH /app/node_modules/.bin:$PATH


#Copy package.json in the image
COPY package*.json ./


#Run npm install command
RUN npm install


#Copy the app
COPY . ./

#Start the app
# CMD [ "npm", "run", "start" ]
RUN npm run build

FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html