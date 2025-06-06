## SPCloud Web Application

This project is a web application scaffolded with Vite + React + TypeScript, and is integrated with AWS Amplify for backend services.

## Project Structure

The project is organized as follows:

- **`amplify/`**: Contains the AWS Amplify backend definition (authentication, data, storage).
  - `backend.ts`: Main entry point for Amplify backend configuration.
  - `auth/resource.ts`: Defines the authentication resources.
  - `data/resource.ts`: Defines the data (GraphQL API and database) resources.
  - `storage/resource.ts`: Defines the S3 storage resources.
- **`public/`**: Static assets that are served directly.
  - `vite.svg`: Example static asset.
- **`src/`**: Contains the frontend application code.
  - `main.tsx`: The main entry point for the React application.
  - `App.tsx`: The root component of the application.
  - `assets/`: Static assets like images and icons used within the application.
  - `components/`: Reusable React components.
  - `contexts/`: React context providers.
  - `pages/`: Top-level page components corresponding to different routes.
- **`index.html`**: The main HTML file for the Vite frontend.
- **`package.json`**: Lists project dependencies and scripts.
- **`vite.config.ts`**: Configuration file for Vite.
- **`tsconfig.json`**: TypeScript configuration for the project.
- **`amplify_outputs.json`**: This file is generated by Amplify and contains the configuration for your backend resources. **It should not be committed to your repository if the repository is public.**

## AWS Amplify Setup

This project uses AWS Amplify for its backend. To set up the project with your own AWS account and connect it to a GitHub repository, follow these steps:

### 1. Prerequisites
- An AWS Account.
- A GitHub Account.
- Git installed on your local machine.
- Node.js and npm (or yarn) installed on your local machine.

### 2. Create a New Amplify App in AWS Console
1.  Go to the AWS Management Console and search for "AWS Amplify".
2.  Click on "New app" and select "Host web app".
3.  Choose "GitHub" as your repository service (or your preferred Git provider).
4.  Authenticate with GitHub and select the repository for this project.
5.  Configure the branch you want to deploy (e.g., `main` or `master`).

### 3. Configure Build Settings
Amplify will usually detect that it's a Vite project and suggest appropriate build settings. However, you might need to adjust them. A typical setup for a Vite React TypeScript app would be:
- **Framework**: `Vite`
- **Build command**: `npm run build` (or `yarn build`)
- **Base directory / Output directory**: `dist`

Ensure your `package.json` has a `build` script like:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  // ... other scripts
}
```

### 4. Deploy the Backend
Once the frontend hosting is configured, you need to deploy the Amplify backend defined in the `amplify/` directory.
1.  In your Amplify app console, navigate to the "Backend environments" tab.
2.  If you haven't pushed the `amplify` folder from your local machine to GitHub yet, do so.
3.  Amplify should detect the `amplify` backend definition in your repository.
4.  Follow the prompts to deploy the backend. This will provision the necessary AWS resources (Cognito, AppSync/DynamoDB, S3).

### 5. Obtain `amplify_outputs.json`
After the backend is successfully deployed, you need to get the `amplify_outputs.json` file. This file contains the configuration details that your frontend application needs to connect to the AWS backend services.
1.  In the AWS Amplify console for your app, go to the "Backend environments" tab.
2.  Select the active backend environment (e.g., `dev` or `prod`).
3.  Look for a section or a button related to "Deployment" or "Build artifacts".
4.  You should find an option to download the `amplify_outputs.json` file. It might also be available under "Admin UI" if you have it enabled, or sometimes directly linked after a successful build/deployment of the backend.
    *   Alternatively, if you have the Amplify CLI configured and pulled the backend to your local environment, this file will be generated in the root of your project.

### 6. Configure Your Local Frontend
1.  Place the downloaded `amplify_outputs.json` file in the root directory of your project (`spcloudapp/`).
2.  Ensure your `src/main.tsx` (or wherever Amplify is initialized) correctly imports and uses this configuration. Typically, it looks something like this:
    ```typescript
    import { Amplify } from 'aws-amplify';
    import outputs from '../amplify_outputs.json'; // Adjust path if necessary

    Amplify.configure(outputs);
    ```
3.  **Important Security Note**: Add `amplify_outputs.json` to your `.gitignore` file if it's not already there, especially if your repository is public. This file contains sensitive endpoint information. For team collaboration, each member can generate their own or securely share it.

### 7. Run the Application Locally
After setting up Amplify and configuring your frontend:
```bash
npm install
npm run dev
```
Or if you use yarn:
```bash
yarn install
yarn dev
```
This will start the Vite development server, and your application should connect to the Amplify backend services you deployed.

### Continuous Deployment (CI/CD)
AWS Amplify automatically sets up a CI/CD pipeline. When you push changes to your connected GitHub branch, Amplify will:
1.  Build your frontend.
2.  If there are changes in the `amplify/` directory, it will update your backend resources.
3.  Deploy the new version of your web app.

You can monitor the build and deployment process in the Amplify console.