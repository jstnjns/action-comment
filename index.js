const core = require('@actions/core')
const github = require('@actions/github')
const { map } = require('lodash')

const {
  GITHUB_SHA,
} = process.env


async function run() {
  if (!github.context.payload.pull_request) {
    core.error('This action is only valid on Pull Requests')
    return
  }

  console.log(github.context)

  const token = core.getInput('github-token')
  const octokit = new github.GitHub(token)

  const files = JSON.parse(core.getInput('files'))
  console.log('files', files)

  const comments = map((files || []), async (file) => {
    const comment = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
      body: core.getInput('comment'),
      commit_id: GITHUB_SHA,
      path: file.filename,
      line: 0,
      side: 'RIGHT',
    }

    console.log('comment', comment)
    await octokit.pulls.createComment(comment)
  })

  console.log('comments', comments)
  core.setOutput('comments', JSON.stringify(comments))
}



run()
