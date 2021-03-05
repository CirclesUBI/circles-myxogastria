<div align="center">
	<img width="80" src="https://raw.githubusercontent.com/CirclesUBI/.github/main/assets/logo.svg" />
</div>

<h1 align="center">circles-myxogastria</h1>

<div align="center">
 <strong>
   Web wallet for Circles
 </strong>
</div>

<br />

<div align="center">
  <!-- Licence -->
  <a href="https://github.com/CirclesUBI/circles-myxogastria/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/CirclesUBI/circles-myxogastria?style=flat-square&color=%23cc1e66" alt="License" height="18">
  </a>
  <!-- CI status -->
  <a href="https://github.com/CirclesUBI/circles-myxogastria/actions/workflows/run-tests.yml">
    <img src="https://img.shields.io/github/workflow/status/CirclesUBI/circles-myxogastria/Node.js%20CI?label=tests&style=flat-square&color=%2347cccb" alt="CI Status" height="18">
  </a>
  <!-- Discourse -->
  <a href="https://aboutcircles.com/">
    <img src="https://img.shields.io/discourse/topics?server=https%3A%2F%2Faboutcircles.com%2F&style=flat-square&color=%23faad26" alt="chat" height="18"/>
  </a>
  <!-- Twitter -->
  <a href="https://twitter.com/CirclesUBI">
    <img src="https://img.shields.io/twitter/follow/circlesubi.svg?label=twitter&style=flat-square&color=%23f14d48" alt="Follow Circles" height="18">
  </a>
</div>

<div align="center">
  <h3>
    <a href="https://handbook.joincircles.net">
      Handbook
    </a>
    <span> | </span>
    <a href="https://github.com/CirclesUBI/circles-myxogastria/releases">
      Releases
    </a>
    <span> | </span>
    <a href="https://github.com/CirclesUBI/.github/blob/main/CONTRIBUTING.md">
      Contributing
    </a>
  </h3>
</div>

<br/>

React web application and mobile client running in the browser hosted on [Circles](https://circles.garden/) to receive Circles UBI, manage your wallet and organize your trust connections.

## Requirements

* Node v12

## Development

```bash
# Install dependencies
npm install

# Copy env file and edit it
cp .env.example .env

# Run tests
npm run test
npm run test:watch

# Check code formatting
npm run lint

# Start local server and watch changes
npm run serve

# Build for production
npm run build
```

## License

GNU Affero General Public License v3.0 [`AGPL-3.0`]

[`AGPL-3.0`]: https://github.com/CirclesUBI/circles-myxogastria/blob/main/LICENSE
