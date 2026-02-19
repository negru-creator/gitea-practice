export interface RepoData {
    repoName: string;
    isPrivate?: boolean;
    description?: string;
    repoTemplateName?: string;
    labels?: string;
    gitignoresTemplate?: string[];
    licenseTemplate?: string;
    templateItems?: (
        | 'git_content'
        | 'git_hooks'
        | 'webhooks'
        | 'topics'
        | 'avatar'
        | 'protected_branch'
    )[];
    isInitialized?: boolean;
    defaultBranchName?: string;
    isTemplate?: boolean;
}