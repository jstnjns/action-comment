const core = require('@actions/core')
const github = require('@actions/github')
const { filter } = require('lodash')

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

  const token = core.getInput('repo-token')
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
