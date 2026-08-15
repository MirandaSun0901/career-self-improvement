---
name: build-campus-recruitment-dashboard
description: Analyze a user's resume, recommend and confirm suitable role categories, collect a dashboard access key, then build, publish, and maintain a personalized campus-recruitment dashboard. Use when a user asks for a reusable 秋招/春招看板, 校招信息看板, 求职机会追踪器, resume-matched job dashboard, or ongoing recruitment monitoring and application-progress tracking.
---

# Build a Campus Recruitment Dashboard

Create a personal `/info` recruitment dashboard with resume-derived role categories, verified application links, progress tracking, access-key protection, and an optional recurring update task.

## Mandatory onboarding

Collect the required inputs in the following order. Do not ask the user to invent role categories before analyzing the resume. Do not start recruitment research or dashboard construction before the role scope and access key are confirmed.

1. Ask: `请上传您的简历，我会先分析适配岗位和发展方向。`
   - Wait for an uploaded resume. Use the PDF or document skill appropriate to its format.
   - Extract name, graduation year, education, majors, work/internship experience, skills, achievements, languages, certifications, preferred locations, and transferable strengths.
   - Treat the resume as private. Do not publish its raw text, phone number, email, address, IDs, or other personal contact details.
2. Read [references/role-taxonomy.md](references/role-taxonomy.md), analyze the resume, and present a concise recommendation containing:
   - usually 3–8 primary role categories ranked by fit; allow fewer than 3 when the resume does not support more;
   - 0–5 secondary or stretch categories;
   - the resume evidence supporting each category;
   - suggested exclusions where the resume lacks a hard requirement;
   - keyword groups that will be used for job discovery.
   Ask: `以上岗位分类是否按此执行？您可以增删或调整优先级。`
   - Accept the user's confirmation or edits. The confirmed categories become the dashboard's filters and research scope.
   - Do not infer protected traits or invent experience. Distinguish demonstrated fit from stretch fit.
3. Ask: `请设置此看板的访问密钥。`
   - Accept the user's chosen value. Never repeat it in later progress messages or the final response.
   - If it is blank, ask again. If it is very weak, warn once but allow the user to keep it.

After the access key is supplied, proceed autonomously. Only ask another question when a material ambiguity prevents a safe build. Infer reasonable defaults and summarize them.

## Build workflow

1. Read [references/dashboard-spec.md](references/dashboard-spec.md).
2. Read [references/verification-policy.md](references/verification-policy.md) before searching for openings.
3. Create or update the dashboard with the `sites-building` skill. Use a unique, non-sensitive slug derived from the user's chosen title, and keep the primary route at `/info`.
4. Research current openings on the web. Personalize fit scores and reasons from resume evidence and the confirmed role categories.
5. Build a responsive, filterable table and persistent application-progress selector.
6. Protect the app with the supplied key using a server-side check and an HttpOnly session cookie. Never expose the key in client code, page HTML, logs, URLs, or source-controlled files. Store it as a runtime secret/environment variable when the hosting capability supports this.
7. Publish only after following Sites approval and deployment rules. Keep the hosting access public so link holders reach the key screen; the application gate controls entry.
8. Offer a recurring inspection automation only when the user asks for ongoing maintenance or accepts the suggestion. Its prompt must preserve valid records, verify closures and link changes, add qualifying new records, redeploy `/info`, and report totals plus added/updated/removed counts. Do not create duplicate automations.

## Defaults

- Target current full-time graduate recruitment; exclude internship-only, campus-ambassador-only, closed, unverifiable, and roles outside the confirmed categories.
- Prefer employers with at least 500 employees and aim for at least 20 active, verified companies. Do not cap the board at 20.
- Prioritize official career sites and official recruiting accounts. Use reputable university employment pages for cross-checking.
- If the user's target roles include executive assistant, chairman assistant, general manager assistant, or secretary, also allow social-recruitment roles from official sites, BOSS直聘, and 猎聘 when experience is unrestricted, within one year, or 1–3 years. Mark `社招`, the experience requirement, and the source. Exclude roles requiring more than three years or clearly senior management backgrounds.
- Keep other target categories limited to graduate recruitment unless the user explicitly broadens them.
- Preserve all still-valid records during updates; deduplicate by employer, program, role, location, and application URL.
- Use Asia/Shanghai dates and show the exact verification date.

## Completion

Verify the production deployment and primary interactions. Return the `/info` URL, confirmed role categories, current company count, update summary, and next scheduled inspection time when one exists. Do not disclose the access key. Tell the user the dashboard opens at the key screen.
