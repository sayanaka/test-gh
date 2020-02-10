// マージされていない場合は何もしない
if (!context.payload.pull_request.merged) {
    return
}

// PR作成（web）
const pr_title_web = `prod web #${context.payload.number}`
github.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: pr_title_web,
    head: 'master',
    base: 'deploy_web',
    body: pr_title_web,
}).then(result => {
    console.log('PR(web) : 作成完了')
}).catch(e => {
    e.errors.map(t => {
        if (t.message.includes("A pull request already exists")) {
            console.log("同じの存在してた")
        }
        console.log('下記のエラーが発生したため、PR(web)作成を中止しました。')
        console.log(e.message)
    })
})

// PR作成（client）
const pr_title_client = `prod client #${context.payload.number}`
github.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: pr_title_client,
    head: 'master',
    base: 'deploy_client',
    body: pr_title_client,
}).then(result => {
    console.log('PR(client) : 作成完了')
}).catch(e => {
    e.errors.map(t => {
        if (t.message.includes("A pull request already exists")) {
            console.log("同じの存在してた")
        }
        console.log('下記のエラーが発生したため、PR(client)作成を中止しました。')
        console.log(e.message)
    })
})

// これは絶対落ちるやつ（ブランチが存在しない）
const pr_title_err = `これはおちます`
github.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: pr_title_err,
    head: 'blank',
    base: 'deploy_client',
    body: pr_title_err,
}).then(result => {
    console.log('PR(おちるやつ) : 作成完了')
}).catch(e => {
    e.errors.map(t => {
        if (t.message.includes("A pull request already exists")) {
            // 同等のPRが存在している場合は、元PRにコメントする
            console.log("同じの存在してた")
        }
        console.log('下記のエラーが発生したため、PR(おちるやつ)作成を中止しました。')
        console.log(e.message)
    })
})