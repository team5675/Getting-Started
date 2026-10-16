# WiredCats Getting Started

Current course source, revised 15 October 2026. Static HTML/CSS/JavaScript; no runtime site dependencies.

## Learning route

There is one student route of 39 steps, listed in `../course-route.json`. Lessons, the seven simulation labs (`lab-1.html` to `lab-6.html`, then `mechanism-lab.html`) and four short Java toolbox pages (`toolbox-*.html`) sit in the order students need them. `sim-lab.html` and `java-toolbox.html` are overviews that keep the old `#lab-N` and `#inheritance`-style anchors working.

Do not hand-edit Back/Next buttons, the "Step N of 39" strip or the step list on `lessons.html`. Change the order in `course-route.json`, then run `python site/build_route.py` from the workspace. `--check` reports drift without writing and is part of `validate-course.bat`. Every page must be either a route step or listed under `reference` in the route file; only steps carry Back/Next buttons, and hand-written "← ..." or "Next ..." links must point at the real neighbouring steps. Label a link to a later lab "Coming up" rather than "Next". The script owns only the text between its `STEP`, `NEXT` and `STEPS` marker comments; `assets/route.css` styles them.

`home-java.html` points to step 1. `practice-workbook.html`, `extra-help.html` and `team-examples.html` are optional. The original TemplateSubsystem activities in `exercises.html` are a collapsed mentor reference requiring an implemented baseline.

## Source and downloads

Edit these HTML pages directly. Editable exercise projects live in `../course-src/`:
- home-java-starter: fourteen small Java examples and answers.
- practice-workbook: optional exercises with 52 JUnit checks.
- sim-starter: Gradle project, browser station, actual AdvantageKit logging, PathPlanner paths, six checkpoints and answers (one lab page each).

Package them with `python site/build_course_downloads.py` from the workspace. `site/build_sim_checkpoints.py` regenerates checkpoint/answer Java and path files; it resets the working starter to checkpoint 1. Review that script before changing the curriculum. `site/build_course_imagery.py` maintains authentic team photos, logos and unnamed illustrated prompts without rewriting lesson content.

Do not rerun archived prose/visual generators over current HTML. The older `advanced-track-src.zip` and original visual homepage template predate this revision. Previous README chronology is preserved in `reviews/course-implementation-2026-10-15/README-before-consolidation.md` outside the published tree.

## Teaching stack and validation

WPILib 2026.2.1, actual JDK 17, AdvantageKit 26.0.2, PathPlanner 2026.1.2, Commands v2. Keep the 2027 alpha bench separate. Simulator sources mark anticipated migration with `SYSTEMCORE-2027:`. Never run the 2027 importer on this project.

Run `.\site\validate-course.bat` from the FRC2027 workspace; see `../VALIDATION.md` for setup, coverage and limits. Maintained checks live in `../validation/`, and each run writes evidence to `../validation-results/`. The latest JSON points to the most recent attempted run, including failures. The earlier dated reviews remain historical evidence. Fresh Windows installer/VS Code, native PathPlanner GUI acceptance and a real first-time-student walkthrough remain manual checks. Hardware behavior is not established by simulation.

Photos and logos come from wiredcatrobotics.org; see `assets/team/sources.json`. Character portraits are unnamed generated learning illustrations. Keep the colorful presentation, technical diagrams, keyboard focus and reduced-motion styles.

## Publishing

Ed alone runs `site/publish-getting-started.bat`; see `../PUBLISHING.md`. Never edit GitHub or the publishing clone directly. Source is this directory. The publisher copies it to the authorized clone and asks Ed to confirm the change list. No publishing is performed by agents.

The local viewer v11, raw logs, test caches and review evidence remain outside this tree. Exercise ZIPs contain sources and required Gradle wrapper files, not build outputs or logs.


## Evening re-review fixes — 15 October 2026

Added controller-bridge.html and mechanism-lab.html; Lesson 8 now includes a
LightForSeconds authoring exercise. Simulator test fixtures live under build/,
not student source. Standard virtual-controller input preserves screen WASD.
The .auto controls odometry reset; manual faults preserve request telemetry,
while autonomous faults cancel the time-based auto. TrainingHarness holds supplied
browser/logging plumbing. See course-src/sim-starter/README.md and the source
command-lab/mechanism-lab folders before changing downloadable lessons.

Foundations now include optional prediction checks, type/reassignment examples,
accumulation, aliasing/field-local experiments and independent Part B tasks.
Public home log instructions use AdvantageScope; v11 remains locally supplied.
The assessment and implementation evidence are outside the published source in
reviews/course-rereview-2026-10-15 and reviews/course-fixes-2026-10-15.

## Fresh beginner review — 15 October 2026

Keep the foundation sequence, but distinguish required practice from optional
reading. Lessons 2–7 now have specific observable exits and short robot glimpses;
all original code blocks remain, including full robot excerpts inside disclosures.
The three added examples (two-way decision, minutes method, countdown) are executed
by the maintained Java snippet checks. Download task comments and Part B answers
match the revised pages. Part B answers for Methods, Loops and ObjectsPractice also
run on the normal program path, alongside the original self-checks.

`extra-help.html` curates optional dev.java and Codecademy readings by topic. Keep
their reading limits, Java 17 guard, and optional account/payment boundary. Do not
send new learners to an unrestricted newest-Java installation tutorial.

Use `help.html#backup` before experimentation until Git has been learned. Lesson 8 leads to Lab 1; since 16 October 2026 the route
itself places every later lab after its prerequisites. The supplied trigger
helpers make lambdas unnecessary for Lab 1; the toolbox introduces them before
AutoBuilder and deferred events. Mentor notes include a first-time-student trial.
Review and preservation evidence: `reviews/beginner-review-2026-10-15/` outside
the published tree. No site publication was performed.

## Single route — 16 October 2026

One 39-step route replaces the separate Next chains. sim-lab.html was split into
lab-1.html to lab-6.html and java-toolbox.html into four toolbox pages; the code
blocks moved unchanged and their validation/snippets.json entries moved with them.
The home page has one primary Start Lesson 1 button. Evidence and the one-time
migration script: reviews/route-fixes-2026-10-16/ outside the published tree.
No site publication was performed.

## One-word launchers — 16 October 2026 (pass 2)

home-java-starter ships `run.cmd` (`.\run HelloWorld`, `.\run Methods check`) and
sim-starter ships `robot.cmd` (`.\robot`, `.\robot build`, `.\robot test ...`). Both use
`%PUBLIC%\wpilib\2026\jdk`, where the WPILib 2026 installer puts Java for both install
options (checked in the installer source, tag v2026.2.1); `WPILIB_2026_JDK` overrides it.
Pages no longer ask students to set `$javaForLessons` or `JAVA_HOME`. Keep the launchers
CRLF. `validation/launcher_checks.py` runs them from the shipped ZIPs on Windows.
Lesson 1 now gives the installer click path, an Extract All destination of `C:\dev`, and a
`.\run` readiness check. Evidence: reviews/route-fixes-2026-10-16/pass-2/.
