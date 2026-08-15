# Resume-to-role taxonomy

Use this taxonomy to turn resume evidence into a compact, user-confirmed search scope. Categories are examples, not a mandatory fixed list. Add or remove categories when the resume supports a different direction.

## Common categories and evidence signals

| Category | Typical role keywords | Strong resume signals |
|---|---|---|
| 管培生 | 管理培训生、综合管培、轮岗项目、储备干部 | cross-functional work, leadership, quantified outcomes, fast learning |
| 采购类 | 采购、寻源、供应商管理、品类采购、采购运营 | vendor coordination, cost analysis, negotiation, contracts, data analysis |
| 供应链类 | 供应链、计划、物流、履约、库存、供应链运营 | forecasting, inventory, process improvement, operations, logistics |
| 商务类 | 商务拓展、战略合作、渠道、客户成功、商业运营 | partnerships, client work, proposals, negotiation, revenue or growth outcomes |
| 市场类 | 市场、品牌、用户增长、内容营销、产品营销 | campaign planning, research, content, growth metrics, brand projects |
| 销售类 | 销售、客户经理、渠道销售、解决方案销售 | targets, pipeline, client acquisition, conversion, account management |
| 运营类 | 产品运营、用户运营、项目运营、平台运营 | SOPs, dashboards, growth, coordination, process automation |
| 人力资源类 | HRBP、招聘、培训、组织发展、员工关系 | recruiting, training, stakeholder management, org or people projects |
| 行政/助理类 | 行政、总助、董助、经理助理、秘书、项目助理 | executive support, scheduling, documentation, coordination, confidentiality |
| 财务/审计类 | 财务分析、会计、审计、税务、资金、内控 | accounting major, finance tools, reporting, audit, controls, certifications |
| 咨询/研究类 | 商业分析、咨询顾问、行业研究、战略分析 | structured problem solving, research, modeling, presentations, client delivery |
| 产品类 | 产品经理、产品助理、商业产品、AI产品运营 | user research, requirements, prototypes, data, cross-functional delivery |
| 数据/自动化类 | 数据分析、BI、流程自动化、AI运营、数字化 | SQL/Python/BI, automation, dashboards, measurable efficiency gains |

## Scoring rule

Score each candidate category from 0 to 100 using only explicit resume evidence:

- 35 points: directly relevant responsibilities or projects;
- 25 points: quantified results or demonstrated outcomes;
- 15 points: relevant academic background, tools, languages, or certifications;
- 15 points: transferable strengths such as leadership, communication, analysis, or execution;
- 10 points: location, industry, and work-style compatibility when stated.

Interpretation:

- 75–100: primary category;
- 60–74: primary or strong secondary category;
- 45–59: stretch category, label the missing evidence;
- below 45: do not recommend unless the user explicitly requests it.

## Recommendation format

Return a concise table with category, fit tier, supporting evidence, and discovery keywords. Then ask the user to confirm, add, remove, or reprioritize categories. Do not expose phone numbers, emails, addresses, IDs, or raw resume passages in the recommendation.

## Hard boundaries

- Never infer age, gender, ethnicity, health, marital status, political status, or other protected/sensitive traits.
- Never fabricate experience, outcomes, certifications, tools, or location preferences.
- Do not treat a job title alone as proof of a skill; cite the responsibility or result that supports it.
- Keep the final dashboard scope based on the user's confirmed categories, not on hidden assumptions.
