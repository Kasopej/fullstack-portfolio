export interface CRUDController {
  create: (body: any, user?: any) => Promise<unknown>;
  createMany?: (body: any) => Promise<unknown>;
  update: (id: number, body: any) => Promise<unknown>;
  delete?: (body: any) => Promise<unknown>;
  getById?: (id: number) => Promise<unknown>;
  getAll: (query?: any) => Promise<unknown>;
}
