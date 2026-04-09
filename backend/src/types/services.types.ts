export interface CRUDService {
  findAll: (query?: any) => Promise<unknown>;
  findMultipleRecords?: (id: number[], opts?: object) => Promise<unknown>;
  findAllByUser?: (userId: number, query?: any) => Promise<unknown>;
  findById: (id: number) => Promise<unknown>;
  create: (data: any) => Promise<unknown>;
  createMany?: (data: any) => Promise<unknown>;
  update: (data: any, id: number) => Promise<unknown>;
  deleteRecord?: (data: any) => Promise<unknown>;
}
