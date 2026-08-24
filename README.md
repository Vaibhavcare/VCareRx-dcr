# V-CareRx DCR Authentication API

## Test login
Username: `Vaibhav`
Password: `Vaibhav@123`

## Run
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Set a strong JWT secret in production:
   - Windows PowerShell: `$env:JWT_SECRET="your-long-secret"`
   - macOS/Linux: `export JWT_SECRET="your-long-secret"`
4. Run `npm start`.
5. Open http://localhost:3000

The API endpoint is `POST /api/auth/login` and returns a JWT. Protected endpoints use `Authorization: Bearer <token>`.
