# Serverless Registry List App
## Capstone Project for Udacity Cloud developer

This is a project for Udacity Cloud Developer Nanodegree. It is a serverless  registry list application which allows users to create their registry list.

# Functionality of the application

This application will allow creating/removing/updating/fetching registry items. Each item can optionally have an attachment image. Each user only has access to registry items that he/she has created.

This application is built using Serverless Framework (https://serverless.com/). All the resources are defined in `serverless.yml` file and then deploy to AWS.

# How to run
## Frontend

The `client` folder contains a web application that use the API developed for the application.

To run the frontend application, please do the following:
1. npm install
2. npm start

## Backend

The `backend` folder contains the backend service code which has been deployed to the AWS.
You don't need to run anything for the backend. 

# Thanks!
