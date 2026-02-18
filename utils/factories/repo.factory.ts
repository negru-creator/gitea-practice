import { CreateRepoDTO } from '../../api/dto/createRepo.dto';
import { faker } from '@faker-js/faker/locale/en';

export class RepoFactory {
    static create(overrides?: Partial<CreateRepoDTO>): CreateRepoDTO {
        return {
            name: `repo-${Date.now()}`,
            description: faker.lorem.sentence(),
            auto_init: true,
            private: false,
            default_branch: 'main',
            license: 'MIT',
            template: false,
            ...overrides
        };
    }
}