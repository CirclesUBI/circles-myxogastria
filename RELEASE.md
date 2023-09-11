# Releasing `circles-myxogastria`

Use this checklist to create a new release of `circles-myxogastria` which gets deployed on https://circles.garden. All steps are intended to be run from the root directory of the repository.

## Creating a new release

1. Make sure you are currently on the `main` branch, otherwise run `git checkout main`.
2. `git pull` to make sure you haven’t missed any last-minute commits. After this point, nothing else is making it into this version.
3. `npm test` to ensure that all tests pass locally.
4. `git push` and verify all tests pass on all CI services.
5. Read the git history since the last release, for example via `git --no-pager log --oneline --no-decorate v1.8.0^..origin/main` (replace `v1.8.0` with the last published version).
6. Create a git and npm tag based on [semantic versioning](https://semver.org/) using `npm version [major | minor | patch]`.
7. `git push origin main --tags` to push the tag to GitHub.
8. `git push origin main` to push the automatic `package.json` change after creating the tag.
9. [Create](https://github.com/CirclesUBI/circles-myxogastria/releases/new) a new release on GitHub, select the tag you've just pushed under *"Tag version"* and use the same for the *"Release title"*. For "Describe this release" make sure all the important information is there. Correct typos and re-word commits if necessary. See examples [here](https://github.com/CirclesUBI/circles-myxogastria/releases).

## Deploy release on Netlify

All commits which get merged into the `main` branch get automatically deployed and published under https://circles.garden by [Netlify](https://www.netlify.com/).
