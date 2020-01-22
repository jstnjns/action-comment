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

  const token = core.getInput('github-token')
  const octokit = new github.GitHub(token)


  const comments = core.getInput('files').map(async (file) =>
    octokit.pulls.createComment({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
      body: core.getInput('comment'),
      commit_id: GITHUB_SHA,
      path: file,
    })
  )

  console.log('comments', comments)
  core.setOutput('comments', comments)
}



run()
