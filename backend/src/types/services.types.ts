export interface CRUDService {
  findAll: (query?: any) => Promise<unknown>;
  findAllByUser?: (userId: number, query?: any) => Promise<unknown>;
  findById: (id: number) => Promise<unknown>;
  create: (data: any, user?: any) => Promise<unknown>;
  createMany?: (data: any) => Promise<unknown>;
  update: (id: number, data: any) => Promise<unknown>;
  deleteRecord?: (data: any) => Promise<unknown>;
}
