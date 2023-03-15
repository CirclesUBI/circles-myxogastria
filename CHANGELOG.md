
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

# [2.7.1] - 2023-03-09

### Fixed
- Notifications of received Circles no longer shows too large value (bug). Also fixed formatting of text and Circles with capital C. [#621](https://github.com/CirclesUBI/circles-myxogastria/pull/621)

# [2.7.0] - 2023-03-06

### Added
- Add loading dialog with more context when sending Circles [#601](https://github.com/CirclesUBI/circles-myxogastria/pull/601)

### Changed
- Round action button design to a wobbly round shape in send button and add member button [#612](https://github.com/CirclesUBI/circles-myxogastria/pull/612)
- Let pink shadow allow for clicking on components behind it [#615](https://github.com/CirclesUBI/circles-myxogastria/pull/615)
- Some general fixes after QA related to the above mentioned changed changes [#619](https://github.com/CirclesUBI/circles-myxogastria/pull/619)

# [2.6.0] - 2023-02-22

### Changed
Design updates including:
- Update send icon shape and color [#537](https://github.com/CirclesUBI/circles-myxogastria/pull/537)
- New design for input components [#508](https://github.com/CirclesUBI/circles-myxogastria/pull/508)
- Updating illustrations in onboarding [#561](https://github.com/CirclesUBI/circles-myxogastria/pull/561)
- Redesign buttons [#559](https://github.com/CirclesUBI/circles-myxogastria/pull/559)
- Mixed fixes for the design changes [#566](https://github.com/CirclesUBI/circles-myxogastria/pull/566)
- Update the banner (app note) design [#582](https://github.com/CirclesUBI/circles-myxogastria/pull/582)
- Update trust buttons [#562](https://github.com/CirclesUBI/circles-myxogastria/pull/562)
- Create new notification types and update styling [#567](https://github.com/CirclesUBI/circles-myxogastria/pull/567)
- Make trust button purple always for one way trust [#602](https://github.com/CirclesUBI/circles-myxogastria/pull/602)
- Fix HumbleAlert color and html interpretation [#604](https://github.com/CirclesUBI/circles-myxogastria/pull/604)
- Change header icons [#544](https://github.com/CirclesUBI/circles-myxogastria/pull/544)
- Change tab menu icons [#600](https://github.com/CirclesUBI/circles-myxogastria/pull/600)
- Fix disabled behavior of trust button and correct behavior between selected and unselected tabs [#560](https://github.com/CirclesUBI/circles-myxogastria/pull/560)

# [2.5.1] - 2023-02-14

### Fixed
- Update of circles core version that allows Safes with version v1.1.1+Circles to deploy the token contract (core.token.deploy) [#605](https://github.com/CirclesUBI/circles-myxogastria/pull/605)
- Adjustment of retry logic for the update transfers edges calls with fewer hops just like with transfer calls [#597](https://github.com/CirclesUBI/circles-myxogastria/pull/597)

### Removed
- Unintentional notification for safe upgrade [#596](https://github.com/CirclesUBI/circles-myxogastria/pull/596)

## [2.5.0] - 2023-02-07

### Fixed
- Updated the retry logic for transfers that time out in the api call and for calculating maximum transferable amount [#581](https://github.com/CirclesUBI/circles-myxogastria/pull/581)

## [2.4.3] - 2023-02-02

### Fixed
- A typo in the app [#583](https://github.com/CirclesUBI/circles-myxogastria/pull/583)
- Updated npm dependencies [#571](https://github.com/CirclesUBI/circles-myxogastria/pull/571), [#572](https://github.com/CirclesUBI/circles-myxogastria/pull/572), [#576](https://github.com/CirclesUBI/circles-myxogastria/pull/576), [#572](https://github.com/CirclesUBI/circles-myxogastria/pull/572), [#592](https://github.com/CirclesUBI/circles-myxogastria/pull/592)

## [2.4.2] - 2023-01-06

### Fixed
- Downgrade core version to v3.1.3, in order to eliminate some errors related to gas fees [#564](https://github.com/CirclesUBI/circles-myxogastria/pull/564)
- Update error handling for insufficient funds, i.e. no circles in wallet to pay for transactions [#549](https://github.com/CirclesUBI/circles-myxogastria/pull/549)
- Handle when there is no email for user in database in Edit profile view [#557](https://github.com/CirclesUBI/circles-myxogastria/pull/557)

## [2.4.1] - 2022-12-12

### Fixed
- Merged the fix of an issue where naming a new shared wallet similar to an existing wallet you own, fails to create the new wallet [#555](https://github.com/CirclesUBI/circles-myxogastria/pull/555) and [#515](https://github.com/CirclesUBI/circles-myxogastria/pull/515)

### Updated
- Circles core dependency update [#554](https://github.com/CirclesUBI/circles-myxogastria/pull/554)

## [2.4.0] - 2022-12-02

### Added
- Documentation comment on how env. variable "user notification" can be used [#524](https://github.com/CirclesUBI/circles-myxogastria/pull/524)

### Changed
- Compatibility with Safe version 1.3.0 and automatic upgrade for signed-in wallets to 1.3.0+L2 [#542](https://github.com/CirclesUBI/circles-myxogastria/pull/542)
- Dependency updates [#539](https://github.com/CirclesUBI/circles-myxogastria/pull/539), [#552](https://github.com/CirclesUBI/circles-myxogastria/pull/552), [#553](https://github.com/CirclesUBI/circles-myxogastria/pull/553)

### Removed
- Deleted unnecessary github actions [#538](https://github.com/CirclesUBI/circles-myxogastria/pull/538)

## [2.3.2] - 2022-10-20

### Changed

- Add possibility of adding html to banner content [#521](https://github.com/CirclesUBI/circles-myxogastria/pull/521)

## [2.3.1] - 2022-10-13

### Fixed

- Removed unintentional plus icon on shared wallet avatar in dashboard [#510](https://github.com/CirclesUBI/circles-myxogastria/pull/510)

## [2.3.0] - 2022-10-13

### Changed

- Made user notification in app customizable based on view in app [#512](https://github.com/CirclesUBI/circles-myxogastria/pull/512)

## [2.2.0] - 2022-10-05

### Added

- Added functionality to edit profile name, email and avatar [#484](https://github.com/CirclesUBI/circles-myxogastria/pull/484)
- Added improvement for transitive transfers. Upon transaction failure, trigger an update of trust network around the user and retry transaction [#362](https://github.com/CirclesUBI/circles-myxogastria/pull/362)
- Added occational user notification to more views: login view and error view [#496](https://github.com/CirclesUBI/circles-myxogastria/pull/496)

### Removed

- Removed the time circles transition screens [#488](https://github.com/CirclesUBI/circles-myxogastria/pull/488)

### Changed

- Changed the support link in the login and welcome views and removed from left side menu [#485](https://github.com/CirclesUBI/circles-myxogastria/pull/485)
- Minor dependency updates [#502](https://github.com/CirclesUBI/circles-myxogastria/pull/502)

## [2.1.1] - 2022-08-25

### Changed

- Remove dependency on maxflow calculation when sending transfers [#463](https://github.com/CirclesUBI/circles-myxogastria/pull/463)
- Update Contributors

## [2.0.1] - 2022-07-05

### Added

- Add missing prop in OnboardingRoute component [#453](https://github.com/CirclesUBI/circles-myxogastria/pull/453)
- Add additional check for fromValidation variable [#447](https://github.com/CirclesUBI/circles-myxogastria/pull/447)
- Add wallets link to dashboard avatar [#435](https://github.com/CirclesUBI/circles-myxogastria/issues/418)
- Link to icons for adding to mobile homescreens [#441](https://github.com/CirclesUBI/circles-myxogastria/pull/441)

### Changed

- Hide transition tutorial after login - from login screen as well [#452](https://github.com/CirclesUBI/circles-myxogastria/pull/452)
- Children in Header are not required as Validation page shows
- Change to time circles in shared wallet onboarding prefunding
- Transition screens should not show up for new users [#440](https://github.com/CirclesUBI/circles-myxogastria/pull/440)
- Remove prop onOpen from Drawer [#445](https://github.com/CirclesUBI/circles-myxogastria/pull/445)
- Translate time circles to circles before funding new shared wallet [#443](https://github.com/CirclesUBI/circles-myxogastria/issues/442)
- Round values in activity log mathematically instead of always rounding down [#432](https://github.com/CirclesUBI/circles-myxogastria/pull/432)

### Fixed

- Fix header on scroll in Validation view
- Fix decimals in formatCirclesValue [#438](https://github.com/CirclesUBI/circles-myxogastria/pull/438)
- Fix header and backgroundCurved component during scroll [#431](https://github.com/CirclesUBI/circles-myxogastria/pull/431)

### Removed

- Remove notification icon from validation view [#433](https://github.com/CirclesUBI/circles-myxogastria/pull/433)

## [2.0.0] - 2022-06-27

### Changed

- Time Circles launch
  - Switching to displaying all values in Time Circles instead of original CRC as on the Blockchain
    - [About the transition](https://circlesubi.medium.com/the-revaluation-of-the-circles-system-c6eea70e767d))
    - [Time circles calculation](https://aboutcircles.com/t/conversion-from-crc-to-time-circles-and-back/463)
- Major design iteration including:
  - Smoother guidance in wallet creation
  - Friendlier trust and transaction experience
  - A quick entry for you to switch between wallets
  - Visual differentiation between Individual Wallets and Shared Wallets
  - Showing the way to our new Marketplace
- Minor dependency updates

#### Pull requests in detail:

- Updated shared wallet creation process by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/307
- Update login by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/321
- New validation view by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/330
- Redesigning updates by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/333
- Make size of shared wallet ring consistent with avatar size by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/358
- Correct AppNote message on larger screens by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/368
- Change icons color in Header by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/359
- Remove circle around balance by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/378
- 349 when scrolling curved background should dissapear and new header bar should appear by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/357
- 337 right bottom menu bottons should be clickable outside text field by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/374
- 336 change links in menus by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/372
- 340 design onboarding oganisations should have white buttons not solid by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/371
- 303 list of shared wallets cannot be scrolled by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/355
- Opening dashboard doesnt move content by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/375
- 348 pink shadow at bottom while scrolling by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/363
- 380 floating menu fixes by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/384
- Remove zIndex of pink shade by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/386
- Prevent shifting a content when opening dashboard menu on Organizatio… by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/389
- 379 not all header icons should be white by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/388
- Improve organization onboarding process button texts by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/383
- 391 development console log errors due to a merged commit by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/397
- Adjust BackgroundCurved wave for larger screens by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/356
- Replace createTheme with old createMuiTheme as it is breaking preview by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/400
- Differentiate Dialog in ProfileMini component depending if we Add mem… by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/401
- Fix colsole errors in development by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/404
- 335 fix step navigation in onboarding including color gradient by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/398
- Restore white icons after mistake in 98b21a7f93d6546ef7222550b7b09049bb9d7286 by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/409
- 390 transition screens to new wallet by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/410
- Remove time circles notification box completely by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/412
- Bump eventsource from 1.1.0 to 1.1.2 by @dependabot in https://github.com/CirclesUBI/circles-myxogastria/pull/395
- Bump cross-fetch from 2.2.3 to 2.2.6 by @dependabot in https://github.com/CirclesUBI/circles-myxogastria/pull/351
- Bump protobufjs from 6.11.2 to 6.11.3 by @dependabot in https://github.com/CirclesUBI/circles-myxogastria/pull/370
- Time circles by @louilinn in https://github.com/CirclesUBI/circles-myxogastria/pull/407
- 406 pink shade remaining after you switch views by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/426
- Add members button goes first to list of members by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/423
- 414 shared wallet creation process improvement by @mikozet in https://github.com/CirclesUBI/circles-myxogastria/pull/422

## [1.11.4] - 2022-06-15

### Changed

- Update app info with 15th June message [#394] (https://github.com/CirclesUBI/circles-myxogastria/pull/394)

## [1.11.3] - 2022-06-08

### Changed

- Apply changes for 8th of June app info box [#373] (https://github.com/CirclesUBI/circles-myxogastria/pull/376)

## [1.11.2] - 2022-06-06

### Changed

- Correct margin and text for app info box [#373] (https://github.com/CirclesUBI/circles-myxogastria/pull/373)

## [1.11.1] - 2022-05-31

### Changed

- Correct margin and text for app info box

## [1.11.0] - 2022-05-31

### Added

- Add app info about system transition [#365](https://github.com/CirclesUBI/circles-myxogastria/pull/365)

### Changed

- Update .gitignore [#364](https://github.com/CirclesUBI/circles-myxogastria/pull/364)

## [1.10.2] - 2022-05-19

### Changed

- Updated node dependencies
- URL to circles marketplace corrected

## [1.10.1] - 2022-02-11

### Changed

- Updated dependencies (no changes to the users)

## [1.10.0] - 2022-02-03

### Added

- Improved seedphrase information in sign up process [#246](https://github.com/CirclesUBI/circles-myxogastria/pull/246)
- General app notifications are shown also on validation page (not only in the dashboard)

### Changed

- The number of validators counts up instead of down [#258](https://github.com/CirclesUBI/circles-myxogastria/pull/260)
- The round notification counter in the top right of the dashboard is replaced by a bell symbol with a counter [#255](https://github.com/CirclesUBI/circles-myxogastria/pull/255)
- The help text of the serach bar [#254](https://github.com/CirclesUBI/circles-myxogastria/pull/254)

### Removed

- Some locked or disabled trust buttons [#260](https://github.com/CirclesUBI/circles-myxogastria/pull/260) and [#245](https://github.com/CirclesUBI/circles-myxogastria/pull/245)
- Donation note in dashboard [#252](https://github.com/CirclesUBI/circles-myxogastria/pull/252)

## [1.9.3] - 2021-08-29

### Added

- Update environment variables

## [1.9.2] - 2021-08-27

### Added

- Update upload error mesage with file requirements [#242](https://github.com/CirclesUBI/circles-myxogastria/pull/242)

## [1.9.1] - 2021-07-16

### Added

- Show dialog when trying to add organization to shared wallet [#230](https://github.com/CirclesUBI/circles-myxogastria/pull/230)

## [1.9.0] - 2021-07-08

### Added

- Group wallet support [#167](https://github.com/CirclesUBI/circles-myxogastria/pull/167)
- Donation Notification in Dashboard [#178](https://github.com/CirclesUBI/circles-myxogastria/pull/178)
- Retry request logic when failure occurred [#214](https://github.com/CirclesUBI/circles-myxogastria/pull/214)

### Fixed

- Fix issue on Safari where button color is displayed wrong when getting enabled [#219](https://github.com/CirclesUBI/circles-myxogastria/pull/219)

## [1.8.0] - 2021-04-23

### Added

- Donation Notification in Dashboard [#178](https://github.com/CirclesUBI/circles-myxogastria/pull/178)

## [1.7.29] - 2021-04-13

### Fixed

- Fix invalid state for some restored undeployed accounts [#177](https://github.com/CirclesUBI/circles-myxogastria/pull/177)

## [1.7.28] - 2021-03-01

### Added

- Generic user announcements via env variable [#160](https://github.com/CirclesUBI/circles-myxogastria/pull/160)
