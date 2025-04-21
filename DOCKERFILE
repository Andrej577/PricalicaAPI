# Bazira se na oficijelnom Node.js image-u (predefinisan)
FROM node:20

# Kreiraj radni direktorijum u kontejneru
WORKDIR /app


# Instaliraj zavisnosti
RUN npm install express mysql2 dotenv jest supertest

# Kopiraj ostatak aplikacije
COPY . .

# Port koji app koristi
EXPOSE 3000

# Start komanda
CMD ["npm", "start"]
