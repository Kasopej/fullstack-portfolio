import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { PaginatedResponse } from './pagination.types';
import { REQUEST } from '@nestjs/core';
import { type Request } from 'express';
import { PaginationDto } from './pagination.dto';

function getSkip(page: number, limit: number) {
  return (Math.max(1, page) - 1) * limit;
}

@Injectable()
export class PaginationService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  async paginateQuery<T extends ObjectLiteral>(
    repository: Repository<T>,
    {
      page = new PaginationDto().page,
      limit = new PaginationDto().limit,
    }: Partial<PaginationDto> = {
      page: new PaginationDto().page,
      limit: new PaginationDto().limit,
    },
    queryOptions?: FindManyOptions<T>,
    otherOptions?: {
      map?: (item: T) => T;
    },
  ): Promise<PaginatedResponse<T>> {
    const records = await repository.find(
      Object.assign(queryOptions || {}, {
        take: limit,
        skip: getSkip(Number(page), Number(limit)),
      }),
    );
    const totalCount = await repository.count(queryOptions);
    const totalPages = Math.ceil(totalCount / Number(limit));
    const baseUrl = `${this.request.protocol}://${this.request.headers.host}/`;
    const reqUrl = new URL(this.request.url, baseUrl);
    return {
      data: records.map(otherOptions?.map ? otherOptions.map : (item) => item),
      meta: {
        currentPage: Number(page),
        itemsPerPage: Number(limit),
        total: totalCount,
        totalPages,
      },
      links: {
        currentPage: `${reqUrl.href}?limit=${limit}&page=${page}`,
        firstPage: `${reqUrl.href}?limit=${limit}&page=${1}`,
        lastPage: `${reqUrl.href}?limit=${limit}&page=${totalPages}`,
        previouspage: `${reqUrl.href}?limit=${limit}&page=${Math.max(1, page - 1)}`,
        nextPage: `${reqUrl.href}?limit=${limit}&page=${totalPages > page ? page + 1 : page}`,
      },
    };
  }
}
