const github = require('@actions/github');

class GitHubRepository {

    /**
     * Creates a new {@link GitHubRepository}.
     * @param {string} token
     *  The GitHub token.
     * @param {github.context} context
     *  The GitHub context to use.
     */
    constructor(token, context) {
        this.context = context;
        this.octokit = github.getOctokit(token);
    }


    /**
     * Creates a tag at the commit identified by the current context.
     * @param {string} tag
     *  The tag name.
     */
    async createCommitTag(tag) {
        // Create tag
        let resp = await this.octokit.rest.git.createTag({
            owner: this.context.repository.name,
            repo: this.context.repository.name,
            tag: tag,
            message: "",
            type: "commit",
            object: this.context.sha
        });

    }

    /**
     * Iterates through the repository's tags.
     * @returns {AsyncGenerator<string>}
     *  The list of tags.
     */
    async *iterateTags() {
        console.log(JSON.stringify(this.context, null, 2));
        let per_page = 100;
        for (let page = 0; true; page++) {
            // Fetch tags
            let tags = await this.octokit.rest.repos.listTags({
                owner: this.context.repository.repo,
                repo: this.context.repository.name,
                per_page,
                page
            });
            // Validate status
            if (tags.status !== 200) {
                throw new Error(`Failed to fetch tags. [Status: ${tags.status}]`)
            }
            // Iterate tags
            for (let tag of tags.data) {
                yield tag.name;
            }
            // If at last page, return
            if (tags.length < per_page) {
                break;
            }
        }
    }

}

module.exports = { GitHubRepository };
