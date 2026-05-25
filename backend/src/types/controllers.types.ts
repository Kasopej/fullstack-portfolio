export interface CRUDController {
  create: (body: any, user?: any) => Promise<unknown>;
  createMany?: (body: any, user?: any) => Promise<unknown>;
  update: (id: number, body: any, user?: any) => Promise<unknown>;
  delete?: (id: number, user?: any) => Promise<unknown>;
  getById?: (id: number) => Promise<unknown>;
  getAll: (query?: any) => Promise<unknown>;
}
