// マージされていない場合は何もしない
if (!context.payload.pull_request.merged) {
    return
}

// PR作成（web）
const new_pr_web_base_branch = 'deploy_web'
const pr_title_web = `prod web #${context.payload.number}`
github.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: pr_title_web,
    head: 'master',
    base: new_pr_web_base_branch,
    body: pr_title_web,
}).then(result => {
    console.log('PR(web) : 作成完了')
}).catch(e => {
    e.errors.map(t => {
        if (t.message !== undefined && t.message.includes("A pull request already exists")) {
            // 同等のPRが存在している場合は、元PRにコメントする
            createPRComment(new_pr_web_base_branch)
        } else {
            console.log('下記のエラーが発生したため、PR(おちるやつ)作成を中止しました。')
            console.log(e.message)
        }
    })
})

// PR作成（client）
const new_pr_client_base_branch = 'deploy_client'
const pr_title_client = `prod client #${context.payload.number}`
github.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: pr_title_client,
    head: 'master',
    base: new_pr_client_base_branch,
    body: pr_title_client,
}).then(result => {
    console.log('PR(client) : 作成完了')
}).catch(e => {
    e.errors.map(t => {
        if (t.message !== undefined && t.message.includes("A pull request already exists")) {
            // 同等のPRが存在している場合は、元PRにコメントする
            createPRComment(new_pr_client_base_branch)
        } else {
            console.log('下記のエラーが発生したため、PR(おちるやつ)作成を中止しました。')
            console.log(e.message)
        }
    })
})

// これは絶対落ちるやつ（ブランチが存在しない）
const pr_title_err = `これはおちます`
github.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: pr_title_err,
    head: 'blank',
    base: new_pr_client_base_branch,
    body: pr_title_err,
}).then(result => {
    console.log('PR(おちるやつ) : 作成完了')
}).catch(e => {
    e.errors.map(t => {
        if (t.message !== undefined && t.message.includes("A pull request already exists")) {
            // 同等のPRが存在している場合は、元PRにコメントする
            createPRComment(new_pr_client_base_branch)
        } else {
            console.log('下記のエラーが発生したため、PR(おちるやつ)作成を中止しました。')
            console.log(e.message)
        }
    })
})

const createPRComment = (base_branch_name) => {

    console.log("=> 元PRのHEAD")
    console.log(context.payload.pull_request.head.ref)


    github.search.issuesAndPullRequests({
        q: `is:pr is:open head:${context.payload.pull_request.head.ref} base:${base_branch_name}`
    }).then(result => {
        console.log("=> 検索結果")
        console.log(result.data.items)

        console.log("=> 検索結果 １件目")
        console.log(result.data.items[0])
    })



    // github.issues.createComment({
    //     owner: context.repo.owner,
    //     repo: context.repo.repo,
    //     issue_number: context.payload.number,
    //     body: `同じものが存在していたよ`,
    // })
    // console.log("=> context")
    // console.log(context)
    console.log("同じのが存在してました")
}