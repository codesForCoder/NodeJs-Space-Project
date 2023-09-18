FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm run install
CMD ["npm" ,"run" , "start"]
EXPOSE 8000 80


