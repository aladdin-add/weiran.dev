const Cache = require('@11ty/eleventy-cache-assets')
const orderBy = require('lodash/orderBy')

// if you want to display your most starred github repositories,
// change this to your username. if not, set it to false.
const YOUR_GITHUB_USERNAME = 'aladdin-add'

module.exports = async function () {
    if (!YOUR_GITHUB_USERNAME) {
        return []
    }

    try {
        console.log('Fetching GitHub repos...')
        const _repos = [];
        const params = [
            'eslint/eslint',
            'kataw/kataw',
            'not-an-aardvark/eslint-plugin-eslint-plugin',
            'aladdin-add/eslint-plugin',
            'weiran-zsd/dts-cli',
        ];
        const opts = {
            duration: '1d',
            type: 'json'
        };

        for (const it of params) {
            // 没有 await，避免请求耗时过长
            const repo = Cache(`https://api.github.com/repos/${it}`, opts);
            _repos.push(repo);
        }

        const repos = await Promise.all(_repos);

        // const repos = await Cache(
        //     `https://api.github.com/users/${YOUR_GITHUB_USERNAME}/repos`,
        //     {
        //         duration: '1d',
        //         type: 'json'
        //     }
        // )
        return orderBy(repos, 'stargazers_count', 'desc')
    } catch (e) {
        console.log('Failed fetching GitHub repos')
        return []
    }
}
