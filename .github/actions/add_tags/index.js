const core = require('@actions/core');
const github = require('@actions/github');
const { Package } = require("./src/Package");
const { GitHubRepository } = require("./src/GitHubRepository");
const { existsSync, readFileSync } = require("fs");
const process = require("process");

(async function () {

    try {

        // 1. Get action inputs
        const TOKEN = core.getInput("token");
        const RELEASE_PLEASE_CONFIG = core.getInput('release-please-config');
        const RELEASE_PLEASE_MANIFEST = core.getInput('release-please-manifest');

        // 2. Load release-please configuration and manifest
        let config, manifest;
        if (!existsSync(RELEASE_PLEASE_CONFIG)) {
            throw new Error(`Configuration '${RELEASE_PLEASE_CONFIG}' not found.`);
        } else if (!existsSync(RELEASE_PLEASE_MANIFEST)) {
            throw new Error(`Manifest '${RELEASE_PLEASE_MANIFEST}' not found.`);
        } else {
            config = readFileSync(RELEASE_PLEASE_CONFIG);
            config = JSON.parse(config.toString("utf-8"));
            manifest = readFileSync(RELEASE_PLEASE_MANIFEST).toString("utf-8");
            manifest = JSON.parse(manifest.toString("utf-8"));
        }
        console.log("✓ Configuration and Manifest files located.")

        // 3. Compile package list
        let packages = config.packages;
        let unresolvedPackages = new Map();
        if (Object.keys(packages).length === 0) {
            throw new Error("No packages to tag.")
        } else {
            for (let loc in packages) {
                let version = manifest[loc];
                let component = packages[loc].component ?? "";
                let tagIncludesName =
                    packages[loc]["include-component-in-tag"] ??
                    packages["include-component-in-tag"] ??
                    true;
                let tagIncludesV =
                    packages[loc]["include-v-in-tag"] ??
                    packages["include-v-in-tag"] ??
                    true;
                let package = new Package(
                    component,
                    version,
                    tagIncludesV,
                    tagIncludesName
                );
                unresolvedPackages.set(package.getTag(), package);
            }
        }
        console.log(`✓ Found ${unresolvedPackages.size} Packages.`);
        for (let package of unresolvedPackages.values()) {
            console.log(`  - ${package.getTag()}`)
        }

        // 4. Resolve packages and tags
        let createTags = new Set([...unresolvedPackages.keys()]);
        let repo = new GitHubRepository(TOKEN, github.context);
        // For each repository tag...
        for await (let repositoryTag of repo.iterateTags()) {
            // ...attempt to resolve a package
            for (let [packageTag, package] of unresolvedPackages) {
                if (package.isAssociatedWithTag(repositoryTag)) {
                    unresolvedPackages.delete(packageTag);
                    if (repositoryTag === packageTag) {
                        createTags.delete(packageTag);
                    }
                    break;
                }
            }
            // If no packages left to resolve, stop iteration
            if (unresolvedPackages.size() === 0) {
                break;
            }
        }
        console.log(`✓ Resolved Tags`)

        // Create new tags
        for (let tag of createTags) {
            repo.createCommitTag(tag);
        }
        console.log(`✓ Created ${createTags.length} new tags.`);
        for (let tag of createTags) {
            console.log(`  - ${tag}`);
        }

    } catch (err) {
        core.setFailed(err.message);
    }

})()
