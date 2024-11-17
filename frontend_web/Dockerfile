FROM node:14

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Only used for testing
ENV MAILSLURP_API_KEY=d5d14b768b14653d876bc5010cbbc0fc06455bdfa16c05c78480abf5c4433a53

EXPOSE 3000
CMD ["npm", "start"]
