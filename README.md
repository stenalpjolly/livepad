# Live Pad 

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/614367234d494bd09ebd35f3cc67e70c)](https://app.codacy.com/gh/stenalpjolly/livepad?utm_source=github.com&utm_medium=referral&utm_content=stenalpjolly/livepad&utm_campaign=Badge_Grade)

### Link: https://livepad-c8b42.web.app/

## Feature list

- [x] Editor with create and join session option
- [x] Separate interviewer and candidate session
- [x] Disable code highlight on candidate
- [x] Cursor tooltip along the username  
- [ ] Option to enable code highlight for the candidate on a session create 
- [ ] Validate session creation 
- [ ] Introduce read-only sections inside the editor
- [ ] Code highlight only for interviewer
- [ ] Private note session for interviewer
- [ ] Option to accept and reject incoming requests
- [ ] Option to end the interview and make it read only
- [ ] Option to playback completed interview
- [ ] Option to download the interview into a local JSON file
- [ ] Option to load a local file and playback interview

## Installation
1. Clone/download repo
2. `yarn install` (or `npm install` for npm)

## Usage
**Development**

`yarn run start-dev`

* Build app continuously (HMR enabled)
* App served @ `http://localhost:8080`

**Production**

`yarn run start-prod`

* Build app once (HMR disabled) to `/dist/`
* App served @ `http://localhost:3000`

---

**All commands**

Command | Description
--- | ---
`yarn run start-dev` | Build app continuously (HMR enabled) and serve @ `http://localhost:8080`
`yarn run start-prod` | Build app once (HMR disabled) to `/dist/` and serve @ `http://localhost:3000`
`yarn run build` | Build app to `/dist/`
`yarn run test` | Run tests
`yarn run lint` | Run linter
`yarn run lint --fix` | Run linter and fix issues
`yarn run start` | (alias of `yarn run start-dev`)

**Note**: replace `yarn` with `npm` in `package.json` if you use npm.
