
FROM node:18


WORKDIR agua_gas_metering_api/


COPY package*.json ./


RUN npm install


COPY . .

RUN npm run build
RUN npx prisma generate
EXPOSE 8000

CMD ["npm", "run", "dev"]
