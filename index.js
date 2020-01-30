const core = require('@actions/core')
const github = require('@actions/github')
const { map } = require('lodash')


const parseHash = (str) => {
  const expression = /\b[0-9a-f]{5,40}\b/g

  return str.match(expression)
}


async function run() {
  if (!github.context.payload.pull_request) {
    core.error('This action is only valid on Pull Requests')
    return
  }

  const token = core.getInput('github-token')
  const octokit = new github.GitHub(token)

  const files = JSON.parse(core.getInput('files'))
  console.log('files', files)

  const comments = map((files || []), async (file) => {
    const commit = parseHash(file.blob_url)

    console.log('commit', commit)

    if (!commit) return

    const comment = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.pull_request.number,
      body: core.getInput('comment'),
      commit_id: commit,
      path: file.filename,
      // line: 0,
      // position: 0,
      // side: 'RIGHT',
    }

    console.log('comment', comment)
    try {
      await octokit.pulls.createComment(comment)
    } catch(err) {
      core.setFailed(err)
    }
  })

  console.log('comments', comments)
  core.setOutput('comments', JSON.stringify(comments))
}



run()
