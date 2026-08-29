# VCareRx-DCR

VCareRx-DCR is a mobile-friendly field reporting web application.

## Features

- Mobile-friendly login and profile interface
- Sky-blue and white professional login design
- User profile and dashboard
- Sign In and Sign Out attendance actions
- Location permission and GPS capture during Sign In/Sign Out
- Multiple user roles and account access
- Admin-only Settings access
- DCR / daily reporting features
- Doctor, chemist, stockist and product data
- Reports and backup/restore functionality
- Works as a hosted web app in modern mobile browsers

## Files

- `index.html` — Main VCareRx-DCR application

## GitHub Pages Deployment

1. Create a GitHub repository named `VCareRx-DCR`.
2. Upload `index.html` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**.
6. Wait for GitHub Pages to deploy the site.
7. Open the generated HTTPS URL on Chrome or Safari.

Your URL will normally be:

`https://YOUR-GITHUB-USERNAME.github.io/VCareRx-DCR/`

## Location Permission

The application uses browser geolocation. When a user selects Sign In or Sign Out, the browser may request permission to access the device location.

For reliable location access:

- Use the HTTPS GitHub Pages URL.
- Allow Location permission when prompted.
- Keep Location Services enabled on the phone.
- On iPhone, use Safari or Chrome with Location permission enabled in iOS settings.
- On Android, allow location permission for the browser.

The browser and operating system control location permissions. The application cannot bypass a user denial or disabled device location.

## Important Production Note

This version is a static HTML application. Browser-local data/storage is not automatically synchronized between different phones.

For a production multi-user deployment where all phones share the same live database, use a secure backend/database and server-side authentication. Do not store production passwords directly in public HTML or JavaScript.

## License

Private/internal use unless a separate license is provided.
