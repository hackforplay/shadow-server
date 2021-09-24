# https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/a3ce23e490063c3f1381aff21026c881a4181a0e/run/helloworld/Dockerfile

# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:14-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# ビルドに必要なファイルをコピーする
COPY tsconfig.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
RUN npm ci
# RUN npm install --only=production


# Copy local code to the container image.
COPY . ./

# ビルド
RUN npm run build

# Run the web service on container startup.
CMD [ "node", "lib/index.js" ]

# [END run_helloworld_dockerfile]
# [END cloudrun_helloworld_dockerfile]
