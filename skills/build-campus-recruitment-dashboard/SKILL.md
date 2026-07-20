---
name: build-campus-recruitment-dashboard
description: Build, publish, and maintain a personalized campus-recruitment dashboard from a user's access key, resume, and target roles. Use when a user asks for a reusable 秋招/春招看板, 校招信息看板, 求职机会追踪器, resume-matched job dashboard, or wants ongoing recruitment monitoring and application-progress tracking.
---

# Build a Campus Recruitment Dashboard

Create a personal `/info` recruitment dashboard with resume-based matching, verified application links, progress tracking, password access, and a daily update task.

## Mandatory onboarding

Collect exactly these three required inputs, one at a time and in this order. Do not combine the questions. Do not start research or building before all three are available.

1. Ask: `请设置此看板的访问密钥。`
   - Accept the user's chosen value. Never repeat it in later progress messages or the final response.
   - If it is blank, ask again. If it is very weak, warn once but allow the user to keep it.
2. Ask: `请上传您的简历，以便我解析您的教育、经历和能力。`
   - Wait for an uploaded resume. Use the PDF or document skill appropriate to its format.
   - Extract name, graduation year, education, majors, work/internship experience, skills, achievements, languages, certifications, preferred locations, and transferable strengths.
   - Treat the resume as private. Do not publish its raw text, phone number, email, address, IDs, or other personal contact details.
3. Ask: `请填写您的意向岗位，尽量详细，例如商务类、技术类、行政类。`
   - Normalize the answer into user-facing filter categories and keyword groups without narrowing the user's intent.

After the third answer, proceed autonomously. Only ask another question when a material ambiguity prevents a safe build. Infer reasonable defaults and summarize them.

## Build workflow

1. Read [references/dashboard-spec.md](references/dashboard-spec.md).
2. Read [references/verification-policy.md](references/verification-policy.md) before searching for openings.
3. Create or update the dashboard with the `sites-building` skill. Use a unique slug derived from the user's name or chosen title, and keep the primary route at `/info`.
4. Research current openings on the web. Personalize fit scores and reasons from the parsed resume and target roles.
5. Build a responsive, filterable table and persistent application-progress selector.
6. Protect the app with the supplied key using a server-side check and an HttpOnly session cookie. Never expose the key in client code, page HTML, logs, URLs, or source-controlled files. Store it as a runtime secret/environment variable when the hosting capability supports this.
7. Publish only after following Sites approval and deployment rules. Keep the hosting access public so link holders reach the key screen; the application gate controls entry.
8. Create one daily automation for 08:00 Asia/Shanghai after verifying that the required Sites and web capabilities work. Its prompt must preserve valid records, verify closures and link changes, add qualifying new records, redeploy `/info`, and report totals plus added/updated/removed counts.

## Defaults

- Target current full-time graduate recruitment; exclude internship-only, campus-ambassador-only, closed, unverifiable, and irrelevant technical-only programs.
- Prefer employers with at least 500 employees and aim for at least 20 active, verified companies. Do not cap the board at 20.
- Prioritize official career sites and official recruiting accounts. Use reputable university employment pages for cross-checking.
- If the user's target roles include executive assistant, chairman assistant, general manager assistant, or secretary, also allow social-recruitment roles from official sites, BOSS直聘, and 猎聘 when experience is unrestricted, within one year, or 1–3 years. Mark `社招`, the experience requirement, and the source. Exclude roles requiring more than three years or clearly senior management backgrounds.
- Keep other target categories limited to graduate recruitment unless the user explicitly broadens them.
- Preserve all still-valid records during updates; deduplicate by employer, program, role, location, and application URL.
- Use Asia/Shanghai dates and show the exact verification date.

## Completion

Verify the production deployment and primary interactions. Return the `/info` URL, current company count, update summary, and next scheduled inspection time. Do not disclose the access key. Tell the user the dashboard opens at the key screen.
