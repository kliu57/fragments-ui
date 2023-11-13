# This is text file that will define all the Docker instructions necessary for Docker Engine to build an image of your service

########################################################################################################################
# Stage 0: Install the base dependencies
# So don't need to constantly download and reinstall dependencies every time I want to rebuild the site

# specifies the parent (or base) image to use as a starting point for our own image
# our fragments-ui image will be based on other Docker images
FROM node:20.9.0-bullseye@sha256:5f21943fe97b24ae1740da6d7b9c56ac43fe3495acb47c1b232b0a352b02a25c AS dependencies

# Use /app as our working directory
# create the /app directory, since it won't exist, and then enter it (i.e., cd /app)
WORKDIR /app

# Option 2: relative path - Copy the package.json and package-lock.json
# files into the working dir (/app).  NOTE: this requires that we have
# already set our WORKDIR in a previous step.
COPY package*.json ./

# execute a command and cache this layer
# Install node dependencies defined in package-lock.json
RUN npm install

########################################################################################################################
# Stage 1: Build the fragments-ui web app

FROM node:20.9.0-bullseye@sha256:5f21943fe97b24ae1740da6d7b9c56ac43fe3495acb47c1b232b0a352b02a25c AS build

# define some metadata about your image (who is mainting this image, what this image is used for)
LABEL maintainer="Katie Liu <kliu57@myseneca.ca>" \
      description="Fragments-ui web app to manage authentication with AWS User Pool and test back-end fragments microservice"

# define any environment variables you want to include
# Reduce npm spam when installing within Docker
# Disable colour when run inside Docker
ENV ENV NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Specify working directory
WORKDIR /app

# Grant permission to user node
RUN chown node:node /app

# Change to user node
USER node

# Copy the generated dependencies (node_modules/)
COPY --from=dependencies /app /app

# Copy the source code
COPY . .

# Copy src to /app/src/
COPY ./src ./src

# Use a build ARG to pass in .env values
ARG API_URL=http://ec2-34-224-75-251.compute-1.amazonaws.com:8080 \
    AWS_COGNITO_POOL_ID=us-east-1_us-east-1_dh0HaJjpO \
    AWS_COGNITO_CLIENT_ID=34tu64677p7rnmdtrknrmimggs \
    AWS_COGNITO_HOSTED_UI_DOMAIN=kliu-fragments.auth.us-east-1.amazoncognito.com \
    OAUTH_SIGN_IN_REDIRECT_URL=http://localhost:1234 \
    OAUTH_SIGN_OUT_REDIRECT_URL=http://localhost:1234

# npm run build
RUN npm run build

########################################################################################################################
# Stage 2: Serving the built site

FROM nginx:1.24.0-alpine@sha256:62cabd934cbeae6195e986831e4f745ee1646c1738dbd609b1368d38c10c5519 as deploy

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

########################################################################################################################
