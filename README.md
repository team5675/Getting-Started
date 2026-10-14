# Team 5675 — Getting Started

Beginner Java and robot-programming lessons for the Mattawan WiredCats.
Open `index.html` in a browser to start. These are static pages; no package install is required.

## Pages

- `index.html`: first-hours route, starting with tools, one message, variables, and decisions.
- `lessons.html`: the eight-lesson sequence, split into first hours and later beginner sessions.
- `lesson-1-setup.html` through `lesson-7-objects.html`: detailed tool setup and Java lessons.
- `first-command.html`: Lesson 8, a staged simulated-light command walkthrough.
- `help.html`: returning after a break, common errors, punctuation, and a glossary.
- `exercises.html`: ten later team-project activities (the original URL is retained).
- `team-examples.html`: four guided readings from last year's team, with prerequisites, traces, hints, and answers.
- `git-guide.html`: beginner cloning, branching, staging, committing, pushing, and review walkthrough.
- `teaching-guide.html` and `aiming.html`: architecture references.
- `mentor-notes.html`: preparation, starter-dependent checks, and suggested meetings.
- `systemcore-bench-guide.html` and its Markdown source: dated bench status and clearly marked September archive. Use the maintained workspace guide for installation.
- `advanced-1-…` to `advanced-8-…`, `pose-lab.html`, `robot-1-loop.html`, `robot-2-arrays.html`,
  `robot-3-controller.html`, `big-picture.html`: Parts 2 and 3 below.
- `practice-workbook.html` and `downloads/practice-workbook.zip`: the at-home practice workbook.

## Course structure (October 2026)

The guide is now three parts, read in order. Students who have programmed before take the
fast lane through Part 1 (see below); everyone does Lesson 8 and Parts 2–3 fully.

| Part | Pages | Status |
|---|---|---|
| 1 · First steps in Java | Lessons 1–8 (existing pages) | Linked. Each of Lessons 2–8 now has three new boxes (below) |
| 2 · How a robot program runs | `robot-1-loop.html` (the 20 ms loop and modes), `robot-2-arrays.html` (arrays, four wheels), `robot-3-controller.html` (sticks, deadband, curve, lambdas) | Linked |
| 3 · Drive and know where you are | `advanced-1-field-pose`, `-2-swerve`, `-3-odometry`, `-4-apriltags`, `-5-fusion`, `-6-timestamps`, (`-7-health-checks` planned), `-8-camera-check`, plus `pose-lab.html` | 1–6 and 8 linked; 7 planned |
| Map | `big-picture.html`: the whole robot program on one page, three data paths, the course map and the two routes | Linked from `index.html` and `lessons.html` |

### What changed on the existing beginner pages

Lessons 2–8 (`lesson-2-…` to `lesson-7-…`, `first-command.html`) each gained:

1. **“Programmed before? Try a two-minute check”** (a `details` block after the lesson trail): predict
   a short program's output; if right, skim the lesson and do the matching ★ challenge.
2. **“In the real robot · 2027Practice”** (amber `box next`, before the checkpoint): the same idea in
   the practice-bot code, as an exact excerpt cut from the source by `site-adv/excerpts.py`
   (e.g. `PoseSeedTracker` for objects, the Pre-Match camera row for `else if`).
3. **“Practice at home”** (green `box try`): which practice-workbook file goes with the lesson,
   linking to `practice-workbook.html`.

`teaching-guide.html` §4 now distinguishes the earlier clear-on-disable design from the practice project’s retained seed and explicit refresh behavior.
Advanced 1–3 had their “Where this shows up on the real robot” boxes replaced by the same
real-robot box with a code excerpt.

### The practice workbook

`downloads/practice-workbook.zip` (about 64 KB) holds `src/main/java/frc/robot/practice/*` (one
practice file per lesson, Lessons 2–7, Part 2 and Advanced 4, 5, 6 and 8), `src/test/java/...`
(JUnit self-checks, 52 in total) and `answers/` (finished versions, plus known-good Lesson 8 files).
Students make a second WPILib 2026 Command Robot project named `practice-workbook`, copy `src` into
it, run a file with VS Code's **Run** CodeLens above `main`, and check it with **WPILib: Test Robot
Code** after setting `CHECK_MY_WORK` (or `CHECK_CHALLENGE`) to true. Checks are skipped while a switch
is false. Syntax errors still fail compilation even when exercise checks are switched off. Files are ASCII-only (Windows Java 17 encoding).

### Connected (10 October 2026)

Reading order, through the Back/Next cards: Lessons 1–8 → `robot-1-loop` → `robot-2-arrays` →
`robot-3-controller` → `advanced-1` … `advanced-6` → `advanced-8` → `pose-lab` → `big-picture`.
Advanced 7 (health checks) isn't written yet, so Advanced 6 leads straight to 8, and `lessons.html`
shows it as “coming later”. When it is written, put it between 6 and 8 in `site-adv/connect.py`
(`SEQUENCE`) and give it a link in `PART3_CARDS`.

- `lessons.html`: Part 1 headings renamed; new Part 2 and Part 3 card groups; links to
  `big-picture.html` and `practice-workbook.html` near the top and in the reference list.
- `index.html`: a “Programmed before?” pointer to `big-picture.html` (the fast lane) and a
  “Where the guide goes next” section.
- `first-command.html`: its Next card now leads to `robot-1-loop.html` (it pointed to the team
  examples, which stay linked from `index.html` and `lessons.html`).
- New pages: lesson trail and Back/Next cards filled in; “draft” footers removed.

### Original October generation checks (before independent review)

- Every “Expected output” on Parts 2–3 pages is produced by running the page's own code: plain Java
  directly, WPILib code with the 2027 alpha math jars after a name-for-name translation (packages,
  `kZero` → `ZERO`). WPILib APIs used are in the 2026.2.2 javadoc (`MathUtil.applyDeadband`,
  `copyDirectionPow`, `SwerveDrivePoseEstimator`, `Transform2d`, …). The pose estimator's blending
  rule (share = σodometry ÷ (σodometry + σcamera)) was confirmed numerically.
- The workbook: all 52 checks are skipped with switches off, all fail on the unfinished files with
  switches on, and all pass on the answers.
- The pose lab's panels reproduce the Advanced 4 numbers exactly (1.0 cm / 2.0°, 10.6 cm, 21.0 cm) and the
  expected −v·latency error in panel 3; tested in Chromium with Playwright, no script errors.
- `check_site.py` after connecting: 31 pages, 592 local links, no errors. Every new or changed page fits at 390 px (wide diagrams scroll
  inside their figure, as elsewhere on the site).
- Still to do once on a student laptop with WPILib 2026: run the Lesson 2–8 boxes' fast-lane snippets
  (they ran here as plain Java), the Part 2 sim exercises (`robot-1-loop` modes, keyboard joystick in
  the Sim GUI), and the workbook's Run CodeLens and Test Robot Code in a fresh Command Robot project.

### Sources

Generators and the workbook source live outside the published folder, in
`FRC2027/site/advanced-track-src.zip` (Python page generators, `excerpts.py`, `snipcheck.py`,
`workbook/`; described in `advanced-track-src-README.md`). Edit the HTML directly for small fixes;
port the October 10 corrections before regenerating. The archived generators do not yet contain the independent review fixes.

## Independent correctness review · October 10, 2026

- Compared all 31 HTML pages, CSS, workbook and bench Markdown with the published Getting-Started site before editing: all matched. README already contained the new local publisher instructions.
- Compiled and ran 29 on-page startup examples against actual WPILib 2026.2.2 JARs with no API translation. Compiled Lesson 8's subsystem and command. Used JDK 25 with `--release 17`; this is not a full WPILib 2026 GUI simulation.
- Ran the workbook's 52 JUnit checks in three modes: switches off abort the checks as intended; unfinished exercises with switches on fail all 52; completed answers pass all 52.
- Corrected Java explanations, made the controller example independent of a removed earlier counter, qualified pose/vision models and timestamps, and labeled uncommitted alpha-7 code accurately.
- Fixed the pose-lab timing graph to display the complete error range at high speed and latency.
- Marked obsolete bench installation notes as an archive and added dated local version/status information. Kept the planned baseline distinct from the supplied practice project.
- Still required before class: the fresh-project VS Code/Gradle workflow, simulation GUI, and any hardware-dependent exercises. Advanced 7 remains planned.

Review evidence and the pre-edit snapshot are outside the published folder in
`FRC2027/reviews/teaching-site-2026-10-10/`. Ed publishes using the procedure below.

## September 23, 2026 beginner revision

Rebuilt the short introduction as separate, slower lessons for students with no programming
experience. Each lesson supplies a goal, prerequisites, numbered steps, exact file placement,
expected output, explanations, a small variation, help, and a stopping point. Lessons 1–4
provide the first-hours route; methods, loops, objects, and commands come in later sessions.
Diagrams explain editor panels, braces, decisions, separate objects, and command timing.
Historical excerpts now have guided walkthroughs, not just questions. Mentor pacing allows
repeated practice rather than fitting several new concepts into one meeting.

Advanced technical references remain available and are labeled as later reading. The main
navigation emphasizes Start here, Lessons, Help & words, and Team examples. Original chapter
anchors are retained on the homepage for older links.

### Changes retained from the earlier editing pass

Replaced “winning,” “rungs,” and “ship it” with activity instructions, observations,
explanations, and saving/sharing. Added code-placement guidance, recovery practice,
the missing `robotInit()` instructions for the 2026 template, and corrected Romi setup wording.
The larger activities now distinguish scheduler requirements from retained requests and
ask students to verify the implemented priority rule. Historical 2026 excerpts are labeled
with source paths and line numbers; they are not a 2027 port.

Student code stays on WPILib 2026. The website archive does not include the teaching
baseline robot project. Mentors must provide its repository/version and run the
preparation checks before class. The final 2026 season repository is a separate historical reference.

## Historical September validation

- Checked HTML nesting, duplicate IDs, local file links, and page anchors.
- Inspected desktop and 390-pixel layouts; all 18 HTML pages fit the narrow viewport.
- Checked expandable help/answers, lesson navigation, and beginner diagrams.
- Matched historical excerpts to the supplied 2026 archive.
- Java snippets were reviewed against WPILib documentation but were not compiled or
  simulated here: the standard local WPILib installations available were 2027 alpha,
  and the teaching baseline source was not provided. A stable-2026 classroom walkthrough remains necessary.

## Publishing to GitHub Pages

The site is published from Ed's local folder with the publisher script, **not** by uploading files on
github.com. The full procedure is in `FRC2027/site/PUBLISHING.md`. In short:

1. Make every change in this folder (`FRC2027/site/Getting-Started-main/`), the single source of truth.
2. Run `FRC2027/site/publish-getting-started.bat`. It checks links, copies this folder into a clone of
   `team5675/Getting-Started` at `C:\dev\Getting-Started`, lists the changes, and commits and pushes to
   `main` after you confirm. Use `-Mirror` after deleting or renaming a page.
3. `.github/workflows/static.yml` redeploys GitHub Pages on every push to `main`. Check the Actions tab,
   then the live site.

Don't edit files on github.com or in `C:\dev\Getting-Started`: the next publish replaces them (the
publisher warns first).

## October 13, 2026 — reviewed home route and completed course bridges

This section supersedes the “Advanced 7 planned” and original reading-order notes above.

- `home-java.html` is the independent stable 2026.2.1 installation/Hello World route.
  `downloads/home-java-starter.zip` has ten plain Java exercises and answers, 49 checks,
  README and learning notes. Rebuild with `python site/build_home_java.py` from the workspace,
  or run that script by absolute path. Its declarative lesson data is the editable source.
  This route uses Java directly, without Gradle/native libraries; Java 17 is the student default.
- The stable class installer is WPILib 2026.2.1 (see release verification below). The older practice-workbook.zip is unchanged.
- New pages: `advanced-7-health-checks.html`, `debugging-and-logs.html`,
  `pathplanner-first-path.html`, `code-map.html`. The PathPlanner ZIP contains standalone
  GUI-only starter/answer projects; settings are synthetic and never for hardware.
- Next-link order now includes Git after Lesson 8, debugging/logs after controller input,
  PathPlanner after odometry, and health between timestamps and camera verification.
- Real-code links freeze camera branch ddb14a2 and selected main examples at 38eba04.
  The per-stream timestamp fix remains explicitly local/uncommitted. Team GitHub access
  is needed for private source links, but the home downloads require no account.
- Keep the small prerequisite fixes (else-if, clamp, bounded while, constructor terminology)
  when maintaining pages. The archived September/October generators predate this revision;
  do not regenerate over the editable HTML without porting the changes.
- Verification: extracted home answers 49/49 on installed Alpha 7 JDK25; all ten unfinished
  exercises detected; static HTML/link checks; representative desktop/narrow browser checks.
  Fresh Windows installer/VS Code and native PathPlanner GUI acceptance remain mentor tasks.
- Review, robot findings, evidence and next additions:
  `../../reviews/course-review-2026-10-13/review.html` in the workspace (not a published site link).
- Ed publishes using `site/publish-getting-started.bat`; agent did not run it.
  Suggested commit: `Add portable Java practice and SystemCore learning bridges`.

### Follow-up: stable student default and Commands v3 (13 October 2026)

Supersedes the alpha-default recommendation earlier in this review/session: Ed questioned the
benefit of alpha setup given limited student progress before January. Recommend released
WPILib **2026.2.1/JDK17** for beginners; teach SystemCore concepts now and reserve alpha for mentors.
GitHub releases/latest confirms 2026.2.1; releases/tags/v2026.2.2 returns404. Earlier 2026.2.2
library compile checks are not evidence of a 2.2 installer. Do not alter historical test evidence.

The portable home Java ZIP works without robot libraries. Final validation checks Java17 API
compatibility using the installed JDK25 compiler and executes on JDK25; no JDK17 runtime or fresh
2026 install is present here. Keep that acceptance limit explicit. PathPlanner editor lab needs
only stable GUI2026.1.2, no alpha vendordep. Added systemcore-for-students.html and optional
commands-v2-v3.html after Lesson8. Official WPILib docs support v2/v3 side by side for several
seasons; SystemCore does not force v3. Current robot CommandsV2 vendordep conflicts with V3,
so prototype a separate integration before changing the class/robot framework. Alpha7 disables
Run/Debug CodeLens per changelog; terminal/trace-table fallbacks remain explicit.

Move the class only after a released 2027 WPILib/vendor/GUI combination is verified together,
not merely because the calendar says January. New suggested publish commit:
`Add portable Java practice and SystemCore learning bridges`. No publication performed.


## October 14 follow-up — authentic WiredCats identity

The current design uses photographs from wiredcatrobotics.org: programming, Note
Worthy (2024), Catalyst (2025), and the team at St. Joseph (2024). The WIRED wordmark
appears in navigation; its original cat emblem is displayed with a fixed CSS crop.
The square site icon is the official WIRED wordmark. Past-season robot captions
avoid suggesting that these are the unknown 2027 robot or field.

Ed clarified that the character portraits should stay, without names. Sixteen pages
keep their short, topic-specific illustrated learning prompts, labeled Team tip or
Pause & predict. The homepage introduces the same learning habits without naming
characters. Only the character portraits are generated illustrations; all robot and
team photographs are authentic. Exact diagrams still explain the technical concepts.

The homepage uses a split photo hero, colorful course cards and a team section.
Beginner lessons include See it / Try it / Check it links wherever those destinations
exist, plus highlighted goals, practice and checkpoints. Core instruction stays visible.

Active assets: assets/identity.css, assets/team/ (six optimized WebP photos/logos and
sources.json), assets/companions/ (two unchanged portrait WebPs), assets/course.css
and assets/course.js. Team photographs/logos total 843,822 bytes; portraits total
102,096 bytes. All media is local, with no runtime request to the team website.

The existing visual builder calls build_course_imagery.py to maintain this layer.
prepare_team_images.cjs resizes/encodes official photos without retouching; the older
prepare_course_images.cjs now redirects to it. Generated robot scenes and old style
assets are archived in reviews/team-identity-2026-10-14/retired-assets/ outside the
published source. Historical artwork and decisions also remain in prior reviews.

Validation: 39 HTML pages / 1,134 local links and anchors, desktop and 390px layouts,
all old anchors and all pre/code, SVG and inline script content preserved. Four
exercise download hashes are unchanged. The builder produces identical results on
repeat runs. Browser checks cover Hello World preview, path step, lesson shortcuts
and the Java loop trace. Reduced-motion and print styles are retained; no full
screen-reader or print-preview acceptance is claimed.

Recovery ZIP, official original downloads, provenance and screenshots are under
reviews/team-identity-2026-10-14/. No publishing, GitHub writes or log-tool changes.
Ed alone runs the publisher. Suggested commit:
Refresh WiredCats course with real team photos and unnamed learning guides.
