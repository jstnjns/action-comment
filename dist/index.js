module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(56);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 56:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(335)
const github = __webpack_require__(539)
const { filter } = __webpack_require__(276)

const {
  GITHUB_SHA,
  GITHUB_EVENT_PATH,
  GITHUB_TOKEN,
  GITHUB_WORKSPACE,
} = process.env


async function run() {
  if (!github.context.payload.pull_request) {
    core.error('This action is only valid on Pull Requests')
    return
  }

  const token = core.getInput('github-token')
  const octokit = new github.GitHub(token)

  core.debug('Fetching PR files...')
  const { data: files } = await octokit.pulls.listFiles({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
  })

  core.debug('Filtering changed files...')
  const before = core.getInput('before') ? new Regex(core.getInput('before')) : false
  const match = core.getInput('match') ? new Regex(core.getInput('match')) : false

  const matched =
    filter(files, file => {
      if (before && match && file.previous_filename) {
        return
          before.test(file.previous_filename) &&
          match.test(file.filename)
      }

      if (before && file.previous_filename) {
        return before.test(file.previous_filename)
      }

      if (match) {
        return match.test(file.filename)
      }
    })

  core.debug('Matched files:')
  console.log(matched, !!matched.length)
  core.setOutput('files', matched)
}



run()


/***/ }),

/***/ 276:
/***/ (function() {

eval("require")("lodash");


/***/ }),

/***/ 335:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 539:
/***/ (function() {

eval("require")("@actions/github");


/***/ })

/******/ });