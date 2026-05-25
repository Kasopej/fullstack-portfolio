export interface CRUDService {
  findAll: (query?: any) => Promise<unknown>;
  findAllByUser?: (userId: number, query?: any) => Promise<unknown>;
  findById: (id: number) => Promise<unknown>;
  /**
   * User create method
   */
  create: (data: any, user: any) => Promise<unknown>;
  createMany?: (data: any, user: any) => Promise<unknown>;
  /**
   * User update method
   */
  update: (id: number, data: any, user: any) => Promise<unknown>;
  /**
   * User delete method
   */
  deleteRecord?: (data: any, user: any) => Promise<unknown>;
}
