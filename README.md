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

Validation evidence lives in `reviews/course-implementation-2026-10-15/`: fourteen Java answer programs, four extra boundaries, 52 workbook checks on answers and unfinished sources, and native simulation integration tests on reference and completed student programs. Final report records browser/log/site checks and their limits. Fresh Windows installer/VS Code and native PathPlanner GUI acceptance remain manual mentor checks. Hardware behavior is not established by simulation.

Photos and logos come from wiredcatrobotics.org; see `assets/team/sources.json`. Character portraits are unnamed generated learning illustrations. Keep the colorful presentation, technical diagrams, keyboard focus and reduced-motion styles.

## Publishing

Ed alone runs `site/publish-getting-started.bat`; see `../PUBLISHING.md`. Never edit GitHub or the publishing clone directly. Source is this directory. The publisher copies it to the authorized clone and asks Ed to confirm the change list. No publishing is performed by agents.

The local viewer v11, raw logs, test caches and review evidence remain outside this tree. Exercise ZIPs contain sources and required Gradle wrapper files, not build outputs or logs.
