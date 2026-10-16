# WiredCats Getting Started

Current course source, revised 15 October 2026. Static HTML/CSS/JavaScript; no runtime site dependencies.

## Learning route

Lessons 1–7 use the same plain-Java starter at home and in class. `robot-project.html` introduces a separate stable-2026 simulation project, followed by Lesson 8 and six cumulative checkpoints in `sim-lab.html`. The later math, camera, pose and timing lessons connect these experiences to the reviewed robot excerpts. `course-finish.html` supplies a capstone and `practice-bot-transfer.html` explains supervised hardware transfer.

`home-java.html` is a shortcut to the same route. `practice-workbook.html` is optional repetition. The original TemplateSubsystem activities in `exercises.html` are a collapsed mentor reference requiring an implemented baseline.

## Source and downloads

Edit these HTML pages directly. Editable exercise projects live in `../course-src/`:
- home-java-starter: fourteen small Java examples and answers.
- practice-workbook: optional exercises with 52 JUnit checks.
- sim-starter: Gradle project, browser station, actual AdvantageKit logging, PathPlanner paths, six checkpoints and answers.

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

Use `help.html#backup` before experimentation until Git has been learned. Lesson 8
leads to Lab 1; the lab table supplies later prerequisites. The supplied trigger
helpers make lambdas unnecessary for Lab 1; the toolbox introduces them before
AutoBuilder and deferred events. Mentor notes include a first-time-student trial.
Review and preservation evidence: `reviews/beginner-review-2026-10-15/` outside
the published tree. No site publication was performed.
