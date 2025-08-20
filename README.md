# fin-fortune

## TODO
- [x] Extract out calculations into unit testable functions
- [x] Write unit tests for daily calculations
- [x] Finish computations/prompts for weekly/monthly data
- [x] Add unit tests for weekly/monthly data
- [x] Add cron jobs to gather data daily, weekly, and monthly!
- [x] Add global prompt state, initialize, and update on cron job
- [x] Add auth
- [ ] Change auth so that instead of returning the access/refresh tokens, it instead sets the cookie header accessToken and refreshToken. If access token expired, server will respond with 401. Client needs to check for 401 and then hit refresh endpoint for new token.
- [ ] add handler for fortune generation w/ gemini api
- [ ] make frontend
- [ ] profit?

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
