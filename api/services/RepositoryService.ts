import { APIRequestContext } from "@playwright/test"
import { CreateRepoDTO } from "../dto/createRepo.dto";

export default class RepositoryService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createRepo(token: string, dto: CreateRepoDTO) {
        return await this.request.post('/api/v1/user/repos', {
            data: dto,
            headers: {
                'Authorization': `token ${token}`
            }
        });
    }

    async deleteRepo(token: string, owner: string, repoName: string) {
        return await this.request.delete(`/api/v1/repos/${owner}/${repoName}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
    }
}

