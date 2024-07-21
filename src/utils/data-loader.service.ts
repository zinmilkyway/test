// import { DEFAULT_CACHE_TIMEOUT } from './../config/constants';
// import { Config } from './../config/config';
// import { Injectable } from '@nestjs/common';
// import { LoggingService } from './../logging/logging.service';
// import DataLoader = require('dataloader');
// import { pipe } from 'fp-ts/lib/pipeable';
// import * as _ from 'lodash/fp';
// import { getLogger, Logger } from 'log4js';
// import LRU = require('lru-cache');
// import { RedisService } from 'nestjs-redis';
// import { FindConditions, In, Repository } from 'typeorm';
// import * as Redis from 'ioredis';
// import ms = require('ms');

// export type TypeOfClassMethod<T, M extends keyof T> = T[M] extends (
//   ...args: any
// ) => any
//   ? T[M]
//   : never;

// export const lruCacheMap = <K, V>(
//   lru: LRU<K, V>,
//   entity: string,
//   field: string
// ): DataLoader.CacheMap<K, Promise<V>> => {
//   const loggingServices = new LoggingService();
//   return {
//     get: (key) => {
//       const value = lru.get(key);
//       if (value !== undefined) {
//         const values = Promise.resolve(value);
//         loggingServices
//           .getLogger('tracer')
//           .trace(
//             'RECORD HIT: on table',
//             entity + ' with',
//             field + ':',
//             key,
//             values
//           );
//         // getLogger('CACHE-TRACER').debug('RECORD HIT:', key, values);
//         return values;
//         // return Promise.resolve(value);
//       }
//     },
//     set: async (key, value) => {
//       const resolved = await value;
//       lru.set(key, resolved);
//       loggingServices
//         .getLogger('tracer')
//         .trace('CACHE SET: on table', entity + ' with', field, key);
//       // getLogger('CACHE-TRACER').debug('CACHE SET:', key);
//     },
//     delete: (key) => lru.del(key),
//     clear: () => lru.reset()
//   };
// };

// export class DataLoaderService<
//   F extends string,
//   E extends Record<'id' | F | FM, string | null>,
//   FM extends string = never
// > {
//   private uniqueFields: ('id' | F)[];
//   private _client?: Redis.Redis;
//   constructor(
//     private repo: Repository<E>,
//     private logger: Logger,
//     private extraCondition: FindConditions<E>,
//     private maxAge: number,
//     uniqueFields: F[],
//     private oneToManyFields: FM[] = [],
//     private redisService?: RedisService
//   ) {
//     this._client = this.redisService?.getClient();
//     this.uniqueFields = _.uniq([...uniqueFields, 'id']);
//     this.loaders = pipe(
//       this.uniqueFields,
//       _.map((field) => {
//         const lru = new LRU<string, E>({ maxAge });
//         return [
//           field,
//           new DataLoader<string, E | null>(
//             async (keys) => {
//               const entities = await this.repo.find({
//                 [field]: In(keys as string[]),
//                 ...this.extraCondition
//               });
//               entities.forEach((entity) =>
//                 this.uniqueFields.forEach((otherField) => {
//                   if (otherField !== field)
//                     this.loaders[otherField as string].prime(
//                       entity[otherField] as any,
//                       entity
//                     );
//                 })
//               );
//               const res = keys.map(
//                 (k) => entities.find((s) => s[field] == k) ?? null
//               );
//               res.forEach(Object.freeze);
//               return res;
//             },
//             {
//               cacheMap: lruCacheMap(
//                 lru,
//                 repo.metadata.givenTableName
//                   ? repo.metadata.givenTableName.toString()
//                   : 'NOT A TABLE',
//                 field
//               )
//             }
//           )
//         ];
//       }),
//       _.fromPairs
//     );
//     this.oneToManyLoaders = pipe(
//       this.oneToManyFields,
//       _.map((field: FM): [FM, DataLoader<string, string[]>] => {
//         const lru = new LRU<string, string[]>({ maxAge });
//         return [
//           field,
//           new DataLoader<string, string[]>(
//             async (keys) => {
//               const entities = await this.repo.find({
//                 [field]: In(keys as string[]),
//                 ...this.extraCondition
//               });
//               entities.forEach(this.prime);
//               entities.forEach(Object.freeze);
//               const res = keys.map((k) =>
//                 entities
//                   .filter((s) => s[field] === k)
//                   .map((s) => s.id as string)
//               );
//               return res;
//             },
//             {
//               cacheMap: lruCacheMap(
//                 lru,
//                 repo.metadata.givenTableName
//                   ? repo.metadata.givenTableName.toString()
//                   : 'NOT A TABLE',
//                 field
//               )
//             }
//           )
//         ];
//       }),
//       _.fromPairs
//     );
//   }
//   loggingServices = new LoggingService();
//   private loaders: { [key: string]: DataLoader<string, E | null> };
//   private oneToManyLoaders: { [key: string]: DataLoader<string, string[]> };
//   private getLoader(field: 'id' | F) {
//     return this.loaders[field as string];
//   }
//   async loadBy(field: F, value: string | null | undefined) {
//     return value == null ? null : this.getLoader(field).load(value);
//   }
//   private getOneToManyLoader = (field: FM) => {
//     return this.oneToManyLoaders[field as string];
//   };
//   async loadOneToManyBy(field: FM, value: string | null | undefined) {
//     if (value == null) return [];
//     return this.getLoader('id' as F).loadMany(
//       await this.getOneToManyLoader(field).load(value)
//     ) as Promise<E[]>;
//   }

//   clearAll() {
//     (_.values(this.loaders) as DataLoader<string, E>[]).forEach((l) =>
//       l.clearAll()
//     );
//   }

//   private listCache = new LRU<string, [string[], number]>({
//     maxAge: this.maxAge
//   });

//   hasListCache = (key: string) => this.listCache.has(key);

//   getListCache = (key: string) => this.listCache.get(key);

//   prime = (entity: E) => {
//     this.uniqueFields.forEach((field) => {
//       const value = entity[field];
//       if (value) {
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         this.getLoader(field).prime(value!, entity);
//       }
//     });
//   };

//   clear = (entity: E) => {
//     this.uniqueFields.forEach((field) => {
//       const value = entity[field];
//       if (value) {
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         this.getLoader(field).clear(value!);
//       }
//     });
//   };

//   async cachedPaginatedList(
//     key: string,
//     query: (repo: Repository<E>) => Promise<[E[], number]>,
//     maxAge?: number
//   ): Promise<[E[], number]> {
//     const cached = this.listCache.get(key);

//     if (cached) {
//       const [ids, count] = cached;
//       const data = (await this.getLoader('id' as F).loadMany(ids)) as E[];
//       // [(await this.getLoader('id' as F).loadMany(ids)) as E[], count];
//       // this.logger.trace('LIST CACHE HIT:', key, cached);
//       this.loggingServices
//         .getLogger('tracer')
//         .trace('LIST CACHE HIT:', key, cached);
//       return [data, count];
//     } else {
//       const [entities, count] = await query(this.repo);
//       entities.forEach(this.prime);
//       /*       we mutate the songs entitiy with downloadedNumber field because they count the number on tones downloadNumber,
//       the older versions not working properly with resolvers fields because of graphql workflow run resolvers field after query/mutation. 
//       here we need to remove the Object.freeze() method. Consider switch to query builder on download number instead.
//       entities.forEach(Object.freeze);
//       eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
//       this.listCache.set(key, [entities.map((s) => s.id!), count], maxAge);

//       return [entities, count];
//     }
//   }

//   async cachedPaginatedListWithPreparedData(
//     key: string,
//     preparedData: [E[], number],
//     maxAge?: number
//   ): Promise<[E[], number]> {
//     const cached = this.listCache.get(key);

//     if (cached) {
//       const [ids, count] = cached;
//       const data = (await this.getLoader('id' as F).loadMany(ids)) as E[];
//       // [(await this.getLoader('id' as F).loadMany(ids)) as E[], count];
//       // this.logger.trace('LIST CACHE HIT:', key, cached);
//       this.loggingServices
//         .getLogger('tracer')
//         .trace('LIST CACHE HIT:', key, cached);
//       return [data, count];
//     } else {
//       const [entities, count] = preparedData;
//       entities.forEach(this.prime);
//       this.listCache.set(key, [entities.map((s) => s.id!), count], maxAge);

//       return [entities, count];
//     }
//   }
//   invalidateListsWithPrefix(prefix: string) {
//     this.listCache
//       .keys()
//       .filter((key) => key.startsWith(prefix))
//       .forEach((key) => this.listCache.del(key));
//   }
//   async setCache(
//     key: string,
//     value: string,
//     expiryMode?: string | any[],
//     time?: number | string
//   ): Promise<boolean> {
//     const result = await this._client?.set(key, value, expiryMode, time);
//     return result == 'OK';
//   }

//   async getCache(key: string): Promise<string | null> {
//     if (this._client) return await this._client.get(key);
//     else return null;
//   }
// }

// @Injectable()
// export class RedisClient {
//   constructor(private readonly redisService: RedisService) {}
//   loggingService = new LoggingService();

//   async setCache(
//     key: string,
//     value: string,
//     expiryMode?: string,
//     time?: number | string,
//     setMode?: number | string
//   ): Promise<boolean> {
//     const _client = this.redisService.getClient('redis');

//     _client?.set(
//       key,
//       value,
//       expiryMode ?? 'EX',
//       time ?? ms(DEFAULT_CACHE_TIMEOUT) / 1000,
//       // setmode ?? '',
//       (err, reply) => {
//         if (err) {
//           this.loggingService.getLogger('debug').debug(err);
//         }
//         return reply == 'OK';
//       }
//     );
//     return true;
//   }

//   async getCache(key: string): Promise<string | null> {
//     const _client = this.redisService.getClient('redis');

//     // console.log('====================================');
//     // _client.keys('*', function (err, keys) {
//     //   if (err) return console.log(err);

//     //   for(var i = 0, len = keys.length; i < len; i++) {
//     //     console.log(keys[i]);
//     //   }
//     // });
//     // console.log('====================================');

//     // console.log('====================================');
//     // console.log((await _client.ttl(key)));
//     // console.log('====================================');
//     if (_client) return await _client.get(key);
//     else return null;
//   }

//   async clear(key: string): Promise<number | null> {
//     const _client = this.redisService.getClient('redis');
//     if (_client) return await _client.del(key);
//     else return 0;
//   }
// }
