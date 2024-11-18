FROM node:14

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Only used for testing
ENV MAILSLURP_API_KEY=ca23aee0c11d0fafae42363f20950f4bf39e4962bd9c2aa0b2bd7642f1b6fab9

EXPOSE 3000
CMD ["npm", "start"]
