# Office Personality Quiz

A nickname-only office quiz. After submitting, a participant sees their result once. Refreshing clears it. Answers and scores are saved privately; there is no public results page.

## Develop

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Without response-ledger settings, development saves one JSON file per submission in `.responses/`.

## Deploy on Vercel

Create a separate **private** GitHub repository with a `main` branch (for example, an initial README commit). Give a fine-grained token **Contents: read and write** permission only on that repository. Set these Vercel environment variables:

- `RESPONSES_REPO`: `owner/repository` of the private responses repository
- `RESPONSES_GITHUB_TOKEN`: the fine-grained token (secret)
- `RESPONSES_BRANCH`: branch name, if different from `main`

Import this app repository into Vercel as a Next.js project. Production submissions fail closed if the private ledger is not configured. Each successful submission creates `responses/<UUID>.json` as a separate Git commit. The token is used only by the server route. Treat nickname, responses, and Git history as private personal data.

The current word list is an initial, simplified transcription of the supplied workbook photos. Review the exact wording and scoring before using the quiz as a faithful reproduction.
