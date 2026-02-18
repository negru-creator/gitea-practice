export interface CreateRepoDTO {
    auto_init?: boolean,
    default_branch?: string,
    description?: string,
    gitignores?: string,
    issue_labels?: string,
    license?: string,
    name: string,
    object_format_name?: string,
    private?: boolean,
    readme?: string,
    template?: boolean,
    trust_model?: string
}