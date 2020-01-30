const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')
const { map } = require('lodash')


const parseHash = (str) => {
  const expression = /\b[0-9a-f]{5,40}\b/g
  const match = str.match(expression)

  return match ? match[0] : false
}


async function run() {
  if (!context.payload.pull_request) {
    core.error('This action is only valid on Pull Requests')
    return
  }

  const token = core.getInput('github-token')
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor
  const github = new GitHub(token)

  const comment = core.getInput('comment', { required: true })
  const fn = new AsyncFunction('require', 'github', 'core', 'context', comment)
  const result = await fn(require, github, core, context)

  console.log(context)

  // const files = JSON.parse(core.getInput('files'))
  // const comments = map((files || []), async (file) => {
  //   const commit = parseHash(file.blob_url)
  //
  //   console.log('commit', commit)
  //
  //   if (!commit) return
  //
  //   const params = {
  //     owner: context.repo.owner,
  //     repo: context.repo.repo,
  //     pull_number: context.payload.pull_request.number,
  //     body: result,
  //     commit_id: commit,
  //     path: file.filename,
  //     side: 'LEFT',
  //     position: 1,
  //   }
  //
  //   console.log('comment', params)
  //   try {
  //     await github.pulls.createComment(params)
  //   } catch(err) {
  //     core.setFailed(err)
  //   }
  // })


  try {
    const params = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number,
      commit_id: context.payload.after,
      body: result,
    }

    await github.pulls.createComment(params)
  } catch(err) {
    core.setFailed(err)
  }

  // console.log('comments', comments)
  // core.setOutput('comments', JSON.stringify(comments))
}



run()
