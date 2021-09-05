# Ekodex-Client
A repository to represent the client for Ekodex, a single platform for game projects that I've created and are applicable to a single gaming platform model.

Check out the front-end website repository here: https://github.com/vericks101/Ekodex-Web

Check out the back-end server repository here: https://github.com/vericks101/Ekodex-RESTAPI

## Local Setup and Configuration
Ensure `node_modules` is available else the application will fail to run. If needed, run `npm install` to pull the needed dependencies.

You will also need to provide a `electron-builder.yml` file with the following configuration parameters provided:
```
appId: com.client.EkodexClient
publish:
  provider: github
  token: [GITHUB_ACCESS_TOKEN]
extraResources:
  from: "./assets/"
  to: ""
```

Once the above is followed, run `npm start` to locally start up the application.

If the application needs to be built, run `npm run build`. Additionally, `npm run deploy` can be executed to build and deploy the application to GitHub.
