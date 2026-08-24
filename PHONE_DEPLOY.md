# V-CareRx DCR — Phone Deployment

This project is ready for Render.

## What you need
A GitHub account and a Render account.

## Steps from a phone
1. Create a new GitHub repository, e.g. `v-carerx-dcr`.
2. Upload all files and folders from this ZIP, keeping `public/index.html` inside the `public` folder.
3. Open Render and sign in with GitHub.
4. Choose **New → Web Service**.
5. Select the `v-carerx-dcr` GitHub repository.
6. If Render does not auto-detect the blueprint, use:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
7. Deploy.
8. Render will provide an HTTPS URL ending in `.onrender.com`.
9. Open that URL on your phone.

## Login
Username: Vaibhav
Password: Vaibhav@123

The project generates a JWT_SECRET on Render through `render.yaml`. Do not put real production passwords or secrets into frontend JavaScript.
