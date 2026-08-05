# Evidence for whatsapp-chat-viewer#9

Decision required: Andres should review and approve before merge because this changes the core chat parser and unsupported-format diagnostics.

Executive summary: Implemented a deterministic parser pipeline that recognizes legacy United States `M/D/YY` WhatsApp exports, infers one date order for the full chat, and rejects contradictory date-order evidence instead of mixing conventions.

Need / necesidad: The old parser interpreted `5/16/16` as day/month/year, treated month `16` as invalid, and could reject a real old United States export. Andres needs the viewer to infer date order from the whole chat.

What changed:
- Split parser behavior into tokenization, chat-level date-order inference, parser diagnostics, and message materialization.
- Added M/D/Y inference while keeping D/M/Y fallback for fully ambiguous chats.
- Added conflict diagnostics with safe counts: total lines, candidate message lines, recognized message lines, convention/status, and stable cause.
- Kept system messages, multiline continuations, `<Media omitted>`, Unicode marks, optional seconds, 12-hour time, 24-hour time, Android/iOS dash/no-dash syntax, and legacy bracket syntax covered by tests.
- Extended the unsupported-format UI diagnostic to show parser counts without exposing file names, senders, phone numbers, or message text.

How this satisfies the issue:
- `5/16/16, 19:49 - PERSONA: MENSAJE` now resolves to May 16, 2016.
- One unambiguous M/D/Y date fixes ambiguous later dates for that same chat.
- Contradictory M/D/Y and D/M/Y evidence throws the existing safe unsupported-chat error with a conflict diagnostic.
- Parser internals are small exported units that tests can exercise independently.
- All regression data and browser evidence use synthetic conversations only.

Issue link: Closes #9.

Acceptance criteria done:
- Legacy United States `M/D/YY` export recognized.
- Ambiguous later dates follow the inferred chat convention.
- Contradictory signals produce an honest diagnostic.
- Existing D/M/Y, Android/iOS, bracket legacy, optional seconds, 12/24-hour, and Unicode mark coverage remains green.
- Multiline, system, and `<Media omitted>` behavior remains covered.
- Diagnostics report safe quantities and inferred convention/status only.
- Tokenization, inference, and materialization are separated and tested.
- Tests, build, and browser capture use synthetic data.

Commands/tests run:
- `yarn install --frozen-lockfile` passed.
- `CI=true yarn test --watchAll=false src/lib/whatsapp-parser/parser.test.js` passed: 11 tests.
- `CI=true yarn test --watchAll=false src/app/fileDiagnostics.test.js src/ui/views/ErrorView.test.jsx` passed: 5 tests.
- `CI=true yarn test --watchAll=false` passed: 4 suites, 17 tests.
- `yarn build` failed under Node.js v22.23.1 with `ERR_OSSL_EVP_UNSUPPORTED`, the known CRA 3/Webpack OpenSSL issue.
- `NODE_OPTIONS=--openssl-legacy-provider yarn build` passed.
- Browser check started with `PORT=3000 BROWSER=none HOST=0.0.0.0 NODE_OPTIONS=--openssl-legacy-provider yarn start`.
- `http://host.docker.internal:3000/whatsapp-chat-viewer` was refused because the dev server was sandbox-owned, not host-owned.
- Browser capture then used `http://127.0.0.1:3000/whatsapp-chat-viewer`, uploaded `.worker-evidence/artifacts/synthetic-mdy-export.txt`, selected `Alice Example`, rendered 3 messages, and saved `.worker-evidence/artifacts/mdy-rendered-chat.png`.

Visual evidence:
- `.worker-evidence/artifacts/mdy-rendered-chat.png`
- `.worker-evidence/artifacts/synthetic-mdy-export.txt`

Residual risk and Andres review:
- Review the conflict policy: currently any chat containing both D/M/Y-only and M/D/Y-only valid candidates is rejected as inconsistent.
- Review whether invalid timestamp-looking lines should remain continuations when another convention is inferred; current behavior avoids treating them as parsed messages.

Calibration:
- Estimated before editing: 2.5-4 human hours, medium difficulty, medium risk, 120-minute execution limit.
- Actual run result: about 65 minutes in worker time; medium difficulty and medium risk were accurate.
- Recalibration note: future parser-pipeline work in this repo should estimate extra time for CRA 3/Node 22 build flags and browser tooling setup, even when code changes are small.

Review attention: A1.

Pantheon review: Evidence should be enough for the milestone review gate: parser tests, full test suite, compatible build, synthetic corpus, and rendered M/D/YY screenshot are all present.

Worker reflection:
- The parser had a single path doing syntax recognition, date interpretation, and message construction, which made chat-level inference hard to add safely.
- A repo-local browser/evidence script would have avoided the transient Playwright setup work.
