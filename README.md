# Team 5675 — Getting Started

Beginner Java and robot-programming lessons for the Mattawan WiredCats.
Open `index.html` in a browser to start. These are static pages; no package install is required.

## Pages

- `index.html`: Java introduction and first-meeting route.
- `first-command.html`: complete simulated-light command activity.
- `exercises.html`: ten cumulative robot-programming activities (the original URL is retained).
- `team-examples.html`: four short readings from the supplied final 2026 robot repository.
- `git-guide.html`: saving, pushing, and reviewing a cumulative practice branch.
- `teaching-guide.html` and `aiming.html`: architecture references.
- `mentor-notes.html`: preparation, starter-dependent checks, and suggested meetings.
- `systemcore-bench-guide.html` and its Markdown source: existing advanced bench reference. Its technical content was not updated in this teaching-language revision.

## September 23, 2026 revision

Replaced “winning,” “rungs,” and “ship it” with activity instructions, observations,
explanations, and saving/sharing. Added code-placement guidance, recovery practice,
the missing `robotInit()` instructions for the 2026 template, and corrected Romi setup wording.
The larger activities now distinguish scheduler requirements from retained requests and
ask students to verify the implemented priority rule. Historical 2026 excerpts are labeled
with source paths and line numbers; they are not a 2027 port.

Student code stays on WPILib 2026. The website archive does not include the teaching
baseline robot project. Mentors must provide its repository/version and run the
preparation checks before class. The final 2026 season repository is a separate historical reference.

## Validation

- Checked HTML nesting, duplicate IDs, local file links, and page anchors.
- Inspected desktop and 390-pixel layouts; all nine HTML pages fit the narrow viewport.
- Checked expandable help and inspected the new examples page.
- Matched historical excerpts to the supplied 2026 archive.
- Java snippets were reviewed against WPILib documentation but were not compiled or
  simulated here: the standard local WPILib installations available were 2027 alpha,
  and the teaching baseline source was not provided. A stable-2026 classroom walkthrough remains necessary.

## Preview and update GitHub Pages

1. Extract the edited ZIP into a new folder. Double-click `index.html` to review it.
   Google Fonts needs internet access; system-font fallbacks work offline.
2. In a local checkout of the existing Getting-Started website repository, create an edit branch.
3. Copy the **contents** of the extracted folder into the repository root, replacing the
   matching site files and adding the new pages. Do not nest the entire extracted folder
   under the repository: `index.html` must remain at the root.
4. Review the diff, commit, push the branch, and open a pull request. After review, merge
   to `main` when ready to publish.
5. The supplied `.github/workflows/static.yml` runs on pushes to `main`; it was preserved
   unchanged. Check that workflow in GitHub Actions and then check the published site.

This delivery does not publish to GitHub Pages or change robot code.
