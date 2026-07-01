# ScholarFlow — Client Testing & Exploration Guide

**Purpose:** This document explains everything ScholarFlow can do, in plain language, so your team can sign in, explore, and test the product from start to finish.

**Live demo site:** https://scholarflow-iota.vercel.app  
**Sign-in page:** https://scholarflow-iota.vercel.app/login

**Demo password for all test accounts below:** `demo123`

---

## 1. What is ScholarFlow?

ScholarFlow is a **Teaching Management System (TMS)** for schools. It helps:

- **Teachers** plan what they will teach, record grades and attendance, and track lesson progress.
- **Students** see their subjects, grades, timetable, and attendance.
- **Parents** follow their child’s progress at school.
- **Headmasters** approve teaching plans, monitor the whole school, and manage staff.
- **School admins** handle day-to-day setup (users, timetable, attendance rules).
- **Platform superadmin** (ScholarFlow operator) creates new schools on the system.

Each person sees only what their job allows. A student cannot change grades; a parent cannot approve a syllabus; teachers cannot lock their own curriculum without approval.

---

## 2. Who should test which account?

| Who you are simulating | School ID | Username | What to focus on |
|------------------------|-----------|----------|------------------|
| Teacher | DEMO01 | teacher | Curriculum, grades, attendance, tracking |
| Student | DEMO01 | student | Viewing subjects and own results |
| Parent | DEMO01 | parent | Child’s progress (linked to student Alex Rivera) |
| Headmaster | DEMO01 | headmaster | Approvals, school overview, governance |
| School admin | DEMO01 | admin | Users, timetable, attendance settings |
| Platform operator | *(leave blank)* | superadmin | Creating schools, viewing all requests |

**Extra student accounts** (same school/password): `jordan`, `sam` — useful when testing class lists and grades.

**Demo school name:** Riverside Academy  
**Demo school code:** DEMO01

---

## 3. Before you start — quick checklist

- [ ] Open the live site in a modern browser (Chrome, Safari, Edge, Firefox).
- [ ] Sign out between role tests (top-right **Sign out**).
- [ ] Use a **private/incognito window** if you want a clean session each time.
- [ ] Keep this guide open while you click through each section in order (Section 8 is the recommended full journey).

---

## 4. Public website (no login required)

These pages are for marketing and onboarding. Anyone can visit them.

| Page | How to open | What it is for |
|------|-------------|----------------|
| **Home** | Click the logo or go to `/` | Overview of ScholarFlow |
| **Product** | Top menu → Product | Features and platform depth |
| **Pricing** | Top menu → Pricing | Pricing tiers |
| **Customers** | Top menu → Customers | Customer stories |
| **Request account** | Top menu or `/get-started` | Submit a request to join the school (see Section 5) |
| **Sign in** | Top menu or `/login` | Login for staff, students, parents |

**What to test:** Browse each page. Confirm links work and the site looks correct on desktop and mobile.

---

## 5. Requesting a new account (public form)

**Who:** A new teacher (or staff member) who does not yet have login details.

**Steps:**

1. Go to **Get started** / **Request account**.
2. Fill in first name, last name, work email, and optional notes.
3. Click **Submit request**.
4. You should see a green confirmation message.

**What happens next:** The request appears in the school’s **Pending tasks** for the **headmaster** or **admin**. They can approve or reject it. When approved, a real login is created.

**What to test:** Submit a test request with a fake email. Then sign in as **headmaster** or **admin** and find the request under **Pending tasks**.

---

## 6. Signing in and account security

### 6.1 Sign in

1. Open **Sign in**.
2. Enter **School ID** (e.g. `DEMO01`) — *except for superadmin; see below*.
3. Enter **Username** and **Password**.
4. Click **Continue**.
5. You arrive on your **Dashboard** for your role.

**Superadmin sign-in:** Leave **School ID empty**. Username: `superadmin`. Password: `demo123`.

**Remember me:** If checked, your session stays on this device longer (until timeout or sign out).

### 6.2 Forgot password

1. On the login page, click **Forgot password?**
2. Enter School ID (if you are a school user) and username.
3. Click **Send reset link**.
4. Check the email inbox registered to that account.
5. Open the link in the email → set a new password (at least 8 characters).
6. Return to login with the new password.

**Note:** Email delivery depends on your school’s email setup. In demo mode, reset emails may go to the address on file.

### 6.3 Sign out

Click **Sign out** in the top-right header. You return to the public site / login.

### 6.4 Automatic sign-out (session timeout)

If you leave the app idle for too long (default 30 minutes for the demo school), you are signed out automatically and see a message. This protects shared computers.

### 6.5 Sidebar navigation

- The **left menu** lists every section your role can access.
- **Dashboard** is always the home summary.
- On desktop, click **Collapse** at the bottom of the sidebar to show icons only; click again to expand.
- On mobile, use the **menu** button (☰) to open the sidebar.

---

## 7. Important concept: the curriculum lifecycle

Much of the system revolves around a **teaching plan (curriculum)** for each subject/class. It moves through stages:

| Stage | Meaning | Who acts |
|-------|---------|----------|
| **Draft** | Teacher is still editing topics and materials | Teacher |
| **Pending** | Teacher submitted the plan for approval | Headmaster reviews |
| **Locked** | Approved — official plan for the term | Students/parents can view; teacher records delivery |
| **Rejected** | Headmaster sent it back for fixes | Teacher edits and resubmits |
| **Change requested** | After lock, teacher asked to change something | Headmaster approves or rejects the change |

**Workspace** = one subject + one class (e.g. Science · Year 9A). A teacher may have several workspaces.

---

## 8. Recommended full journey (test in this order)

This is the **complete story** from a new person joining to daily school use.

### Part A — Platform setup (superadmin)

1. Sign in as **superadmin** (no School ID).
2. Open **Dashboard** — see how many schools and users exist.
3. Open **Schools** → **Create school** with a test code (e.g. `TEST01`) and name.
4. Open **Account requests** — see all requests from all schools.

### Part B — New staff request (public → admin)

1. Sign out. Submit a **Get started** form as a new user.
2. Sign in as **admin** → **Pending tasks** → approve or reject the account request.
3. (If approved) the new user could log in with the credentials created by the system.

### Part C — Teacher builds and submits curriculum

1. Sign in as **teacher**.
2. **Dashboard** — review class averages, workspaces, alerts.
3. **Workspaces** — open **Science · Year 9A** (or Mathematics).
4. **Curriculum** — while status is *draft* or *rejected*, add topics, open a topic to add videos/worksheets, toggle whether students can see each resource.
5. **Submit for approval** when the plan is ready.
6. Status becomes **pending**.

### Part D — Headmaster approves curriculum

1. Sign in as **headmaster**.
2. **Dashboard** — see pending approval counts.
3. **Pending tasks** → **Syllabi awaiting approval** → click **Review** or **Approve** / **Reject**.
4. After approval, status becomes **locked**.

### Part E — Teacher records daily work

1. Sign in as **teacher** again.
2. **Weekly tracking** — mark each week as completed, partial, or not covered.
3. **Grades** — add a grade for a student, or **Import CSV** for bulk entry.
4. **Attendance** — mark each student present, absent, or late for today.
5. **Timetable** — view your teaching schedule.

### Part F — Student and parent view results

1. Sign in as **student** — **Dashboard**, **My subjects**, open a topic, check **Performance**, **Timetable**, **Attendance**.
2. Sign in as **parent** — **Dashboard** shows child **Alex Rivera**; explore **Academic**, **Curriculum**, **Attendance**, **Timetable**.

### Part G — Headmaster monitors the school

1. **School performance** — school-wide grades table; **Export PDF / Excel**.
2. **Teacher performance** — see which teachers are behind on delivery.
3. **Attendance overview** — school attendance picture.
4. **Users** — add/deactivate users, reset passwords.
5. **Configuration** — thresholds, academic year, session timeout.
6. **Timetable** — drag-and-drop builder, add slots, fix conflicts.
7. **Audit log** — history of important changes.

### Part H — Admin handles operations

1. Sign in as **admin**.
2. **Pending tasks** — account requests, timetable conflicts, enrolment gaps (no syllabus approval).
3. **Users**, **Configuration**, **Timetable** — same tools as headmaster for day-to-day ops.
4. **Attendance config** — lock window and reason codes (e.g. “Medical”, “Excused”).

---

## 9. Teacher — every feature explained

**Sign in:** School ID `DEMO01`, username `teacher`.

### Dashboard
- Welcome message and school year.
- **Class average** across your subjects.
- **Students taught**, **grade entries**, **timetable slots**.
- **Students below threshold** — flagged if grades fall under school rules.
- **Your workspaces** — quick links to Curriculum, Grades, Attendance for each subject.
- **Export all grades PDF** — download a PDF of all grades you manage.

### Workspaces
- List of every subject/class you teach.
- Each card shows curriculum status (draft, pending, locked, etc.).
- Buttons: **Curriculum**, **Weekly tracking**, **Grades**, **Attendance**.

### Curriculum (per workspace)
- View all **topics** (units of work) and which **weeks** they target.
- **Draft mode:** add new topics, delete topics, edit topic details.
- **Submit for approval** — sends plan to headmaster.
- **Locked mode:** plan is read-only; use **Request curriculum change** with a written reason if you need edits.
- Switch **Topic view** / **Week view** to see the plan organized differently.

### Topic detail (inside a topic)
- Add **video** or **worksheet (paper)** links.
- Choose whether each resource is **visible to students**.
- Upload or link learning materials for that unit.

### Weekly tracking
- For each week of the term, mark delivery as **Completed**, **Partial**, or **Not covered**.
- Add optional remarks (e.g. “Assessment week”, “School trip”).
- Headmaster uses this to see if teachers are keeping up.

### Grades
- See all grade entries for this class.
- **Add grade** — pick student, category (exam, test, assessment, behaviour, other), assessment name, date, mark, remarks.
- **Import CSV** — upload a spreadsheet to add many grades at once (columns: username, category, assessment name, date, value).

### Attendance
- List of students in the class.
- For **today’s date**, mark each student **Present**, **Absent**, or **Late**.
- Selections save immediately.

### Timetable
- View your personal teaching timetable (days, times, rooms, subjects).

---

## 10. Student — every feature explained

**Sign in:** School ID `DEMO01`, username `student` (Alex Rivera).

### Dashboard
- **Grade average**, **attendance percentage**, **curriculum progress**.
- Number of **timetable slots**.
- List of **your subjects** with status.

### My subjects
- Each enrolled subject (e.g. Science, Mathematics).
- For **locked** subjects: see topics and whether each is covered, in progress, or upcoming.
- Click a topic (when allowed) for detail and **visible resources** only.

### Topic detail
- Read topic description and open resources the teacher marked as visible.

### My performance
- View your grades across subjects.

### Timetable
- Your class schedule for the week.

### Attendance
- Your attendance history (present / absent / late by date).

**Students cannot:** edit grades, change attendance, approve curriculum, or see other students’ private data.

---

## 11. Parent — every feature explained

**Sign in:** School ID `DEMO01`, username `parent` (Jamie Rivera — linked to child Alex Rivera).

### Dashboard
- **Attendance** and **curriculum progress** for your child.
- **Recent grades** summary.
- **Alerts** if the child is below grade threshold or attendance threshold.
- If multiple children were linked, a **dropdown** would let you switch between them (demo has one child).

### Academic
- Detailed view of the child’s grades and performance.

### Curriculum
- What the school has approved as the teaching plan for the child’s subjects (read-only).

### Attendance
- Child’s attendance records.

### Timetable
- Child’s weekly schedule.

**Parents cannot:** change any school data; they only observe.

---

## 12. Headmaster — every feature explained

**Sign in:** School ID `DEMO01`, username `headmaster`.

The headmaster is the **school leader**. They approve teaching plans and oversee quality across the whole school. They also have most admin tools.

### Dashboard
- **Pending approvals** count (syllabi + change requests + account requests).
- **Flagged students** (below grade threshold).
- **Teachers behind** on weekly delivery.
- **Students enrolled**, **low attendance alerts**, **timetable conflicts**.
- Links into detailed pages.

### Pending tasks
- **Syllabi awaiting approval** — Review, Approve, or Reject each submitted plan.
- **Change requests** — when a teacher wants to edit a locked curriculum; Approve or Reject with reason.
- **Account requests** — new staff requests from the public form; Approve or Reject.
- **Flags** — students below threshold, teachers behind schedule, students with low attendance.

### Syllabus review (detail page)
- Open from **Review** on a pending syllabus.
- Read the full curriculum before approving.

### School performance
- Summary cards: total grades, workspaces, students below threshold.
- Full grades table for the whole school.
- **Export PDF / Excel** for reports and meetings.

### Teacher performance
- Overview of how well teachers are delivering their planned weeks.
- Identify who is behind.

### Attendance overview
- School-wide attendance statistics and concerns.

### Users
- **List** all staff and students in the school.
- **Add user** — create username, name, email, role, password, class (for students).
- **Import students CSV** — bulk add students.
- **Deactivate / Reactivate** accounts.
- **Reset password** for a user.
- **Change role** (e.g. teacher → admin).

### Configuration
- Set **academic year** label.
- **Grade threshold (%)** — below this, students are flagged.
- **Attendance threshold (%)** — below this, students are flagged for low attendance.
- **Session timeout (minutes)** — idle time before auto sign-out.
- **Parent resource access** — whether parents can see learning resources (on/off).

### Timetable
- **Visual grid** (Monday–Friday) for the whole school schedule.
- **Add slot** — subject, class, teacher name, room, day, start/end time.
- **Drag and drop** lessons to move them.
- **Delete** slots.
- System warns about **conflicts** (same room or teacher double-booked).
- **Clone term** — copy timetable pattern to a new term (where available).

### Audit log
- Read-only list of important changes (who changed what and when).
- Used for accountability and compliance.

**Headmaster cannot:** access other schools’ data (only their own school).

---

## 13. School admin — every feature explained

**Sign in:** School ID `DEMO01`, username `admin`.

Admins handle **operations**. They share many tools with the headmaster but **cannot approve or reject syllabi** — that stays with the headmaster.

### Dashboard
- **Pending operations** — account requests, timetable conflicts, enrolment gaps.
- Quick counts and links.

### Pending tasks
- **Account requests** — approve/reject new users.
- **Timetable conflicts** — issues to fix in the timetable builder.
- **Enrolment gaps** — classes or students missing proper assignment.
- **No syllabus approval section** (unlike headmaster).

### Users
- Same as headmaster: create, import, deactivate, reset password, change roles.

### Configuration
- Same school settings as headmaster (thresholds, academic year, timeout, parent access).

### Timetable
- Same drag-and-drop timetable builder as headmaster.

### Attendance config *(admin only)*
- **Lock window** — after X hours, attendance records cannot be changed (stops late edits).
- **Reason codes** — add/remove codes used when marking absences (e.g. ILL, TRIP).

### Audit log
- Same compliance log as headmaster.

---

## 14. Platform superadmin — every feature explained

**Sign in:** Leave School ID **blank**. Username `superadmin`.

This role is for **ScholarFlow the company**, not for a single school. It manages all customer schools on the platform.

### Dashboard
- **Customer schools** count.
- **School users** count (all users except platform staff).
- **Pending account requests** across all schools.

### Schools
- **List** every customer school (school code and name).
- **Create school** — enter a unique **External ID** (used at login as School ID) and school name.
- New schools start empty until users and data are added.

### Account requests
- Table of **all** account requests from **all** schools.
- Shows name, email, role requested, status (pending, approved, rejected).
- School staff still approve requests within their school; superadmin sees everything for oversight.

### Audit log
- Platform-wide view of audit entries (all schools).

**Superadmin cannot:** act as a day-to-day teacher or headmaster inside a school workspace (they manage tenants, not lesson plans).

---

## 15. Reports and downloads

| Where | What you can download |
|-------|------------------------|
| Teacher Dashboard | PDF of all grades |
| Headmaster → School performance | PDF and Excel of school grades |
| Headmaster / Teacher performance pages | Export options where shown |

Use these to test that files download and open correctly.

---

## 16. What each role is **not** allowed to do

| Role | Cannot do |
|------|-----------|
| Student | Edit grades, attendance, or curriculum |
| Parent | Edit any school records |
| Teacher | Approve own syllabus; see other teachers’ private drafts unless shared by policy |
| Admin | Approve or reject syllabi / curriculum changes |
| Headmaster | Access other schools |
| Superadmin | Replace headmaster for syllabus approval inside a school |

If you try to open another role’s page by typing the web address, you are redirected or see “access denied.”

---

## 17. Email and notifications (demo limitations)

The system **records** when emails *would* be sent (e.g. syllabus approved, account approved), but in the current demo **emails are not actually delivered** to inboxes unless email is fully configured on the server.

**Still works:** login, password reset (if email provider is configured), and all on-screen workflows.

---

## 18. Suggested test checklist (tick as you go)

### Public & auth
- [ ] Home, Product, Pricing, Customers pages load
- [ ] Submit account request on Get started
- [ ] Login as each of the 6 roles
- [ ] Sign out and sign back in
- [ ] Collapse and expand sidebar
- [ ] Forgot password flow (optional, needs email)

### Teacher
- [ ] Dashboard shows workspaces and stats
- [ ] Add or view topic in curriculum
- [ ] Submit curriculum for approval (if draft)
- [ ] Mark weekly tracking
- [ ] Add a grade and/or import CSV
- [ ] Mark attendance for today
- [ ] View timetable

### Headmaster
- [ ] Approve or reject pending syllabus
- [ ] Approve or reject change request (if any)
- [ ] Approve or reject account request
- [ ] Export school performance PDF/Excel
- [ ] Add a user
- [ ] Change a configuration value
- [ ] Add or move a timetable slot
- [ ] View audit log

### Student & parent
- [ ] Student sees subjects and own grades
- [ ] Parent sees child dashboard and alerts
- [ ] Neither can edit protected data

### Admin
- [ ] Pending tasks (no syllabus section)
- [ ] Attendance config — add reason code
- [ ] User reset password

### Superadmin
- [ ] Create a test school
- [ ] View all account requests
- [ ] Dashboard counts update

### Full story (Section 8)
- [ ] Complete Part A through Part H in one session

---

## 19. Getting help during testing

| Issue | What to check |
|-------|----------------|
| “Invalid username or password” | School ID, username, password; superadmin leaves School ID blank |
| Blank dashboard / “Failed to load data” | Internet connection; try refresh; sign out and in again |
| Cannot approve syllabus | You must be signed in as **headmaster** or **admin** (Pending tasks → Syllabi) |
| Student sees no topics | Curriculum may not be **locked** yet — headmaster must approve |
| Password reset email not received | Email provider may not be configured for demo |

---

## 20. Quick reference — all menu items by role

### Teacher
Dashboard · Workspaces · Request subject · Behaviour · Academic report · Timetable  
*(Inside workspace: Curriculum · Weekly tracking · Grades · Attendance · Topic detail)*

### Student
Dashboard · My subjects · My performance · Timetable · Attendance

### Parent
Dashboard · Academic · Curriculum · Attendance · Behaviour · Timetable

### Headmaster
Dashboard · Pending tasks · School performance · Teacher performance · Attendance overview · Users · Configuration · Timetable · Audit log

### Admin
Dashboard · Pending tasks (syllabi + subject requests) · Users · Configuration · Timetable · Attendance config · Audit log

### Superadmin
Dashboard · Schools · Account requests · Audit log

---

## 21. PRD v1.0 — new flows to test

### Account request (Get Started)
1. Open `/get-started` (not signed in).
2. Pick a school from the dropdown.
3. Submit — request appears in **Admin** or **Headmaster → Pending tasks → Account requests**.

### Subject request (teacher)
1. Sign in as **teacher** → **Request subject**.
2. Enter e.g. Mathematics / Year 9A → submit.
3. **Admin** or **Headmaster** approves in Pending tasks → workspace created with GCSE template topics when available.

### Curriculum planning & resubmit
1. Teacher opens workspace **Curriculum** (draft or rejected).
2. Reorder topics (↑↓), assign weeks via checkboxes, submit for approval.
3. Admin/headmaster rejects with a reason → teacher sees banner and can **Resubmit**.

### User password (admin)
1. **Users** → **Set password** on a user → enter temp password → copy from confirmation banner.

### Behaviour workflow
1. Teacher → **Behaviour** → record rating + remark.
2. Headmaster → Pending tasks → **Behaviour records** → approve.
3. Parent → **Behaviour** → sees approved record only.

### Academic report (teacher)
1. **Academic report** → iframe opens GCSE Mathematics builder prefilled with teacher name and academic year.

### Timetable (admin/headmaster)
1. **Add lesson** — pick teacher from dropdown, link workspace, includes Sat/Sun columns.
2. Drag lesson to another cell — success message appears.

---

*Document version: matches ScholarFlow production at https://scholarflow-iota.vercel.app · Demo school DEMO01 · Password demo123*
