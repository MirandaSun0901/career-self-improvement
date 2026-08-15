# Dashboard specification

## Route and access

- Primary route: `/info`.
- Root route redirects to `/info`.
- First visit shows a clean access-key screen.
- Validate the key on the server and set a secure, HttpOnly, SameSite cookie with a bounded lifetime.
- Add `noindex, nofollow` metadata because the dashboard contains personalized matching.
- Never commit, publish, log, or render the access key. Use a deployment secret or equivalent server-side runtime configuration.

## Required record fields

Each opportunity contains:

- employer name
- industry
- employer nature: private company plus listing/funding status; foreign company plus home country; state-owned or central state-owned label
- employer scale evidence or scale band
- recruitment type: campus or social
- program/batch
- matched roles and normalized role categories
- main cities
- opening date and deadline, using `招满即止` only when supported
- experience requirement for social roles
- resume-based fit score and concise fit reason
- source platform
- last verification date
- direct application URL

## Filters and controls

- Search employer, role, city, and industry.
- Dynamic role-category filters derived from the resume analysis and the user's confirmed categories.
- Industry, employer nature, batch/recruitment type, and city filters.
- Reset action and visible result count.
- Progress values: `未投递`, `已投递`, `待测评`, `已测评`, `待笔试`, `已笔试`, `一面`, `二面`, `终面`, `HR面`, `Offer`, `已拒绝`, `已放弃`.
- Persist progress in the browser without transmitting it to third parties unless the user requests synced storage.

## Presentation

- Responsive desktop table with a usable mobile layout.
- Show total verified employers, total matched role directions, high-match count, and latest verification date. Show an inspection time only when a recurring inspection actually exists.
- Sort by personalized fit by default.
- Visibly distinguish `社招` from `校招` and show third-party source labels.
- Never render resume contact details or raw resume text.
- Store only the minimum derived matching profile needed by the dashboard. Do not bundle the resume file into the site or reusable skill.

## Update behavior

- Add new records without overwriting valid existing ones.
- Update changed deadlines, roles, cities, source links, and status.
- Remove or archive closed and disqualified records.
- Preserve the user's progress state across deployments by keeping stable employer/opportunity keys.
