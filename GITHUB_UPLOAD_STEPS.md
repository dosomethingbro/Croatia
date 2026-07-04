# Upload this project to GitHub from your phone

## Fastest phone method

1. Go to GitHub.com in your phone browser and sign in.
2. Tap **+** → **New repository**.
3. Repository name: `split-history-guide`
4. Keep it **Public** or **Private**.
5. Do **not** add a README, `.gitignore`, or license because this folder already has project files.
6. Create the repository.
7. On the empty repository page, choose **uploading an existing file**.
8. Upload every file from this folder.
   - Important: upload the files inside the folder, not the ZIP itself.
9. Commit the files.

## Easier desktop method

```bash
git init
git add .
git commit -m "Initial Split history guide"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/split-history-guide.git
git push -u origin main
```

## Deploy to Vercel

1. Go to Vercel.com and sign in with GitHub.
2. Tap **Add New Project**.
3. Import `split-history-guide`.
4. Framework preset: **Other** or **Static**.
5. Build command: leave blank.
6. Output directory: leave blank.
7. Deploy.

Your homepage should be `/index.html`, and Vercel clean URLs should also allow `/`.
