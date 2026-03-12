import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Province } from '../../entities/province.entity';
import { Regency } from '../../entities/regency.entity';
import { District } from '../../entities/district.entity';
import { Village } from '../../entities/village.entity';

describe('SearchController (HTTP)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const province = { code: '11', province: 'ACEH' };
    const regency = { code: '1101', regency: 'KAB. SIMEULUE', province };
    const district = { code: '1101010', district: 'TEUPAH SELATAN', regency };
    const village = { code: '1101010001', village: 'LATIUNG', postalCode: '23781', district };

    const moduleRef = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        SearchService,
        { provide: getRepositoryToken(Province), useValue: { find: jest.fn().mockResolvedValue([province]) } },
        { provide: getRepositoryToken(Regency), useValue: { find: jest.fn().mockResolvedValue([regency]) } },
        { provide: getRepositoryToken(District), useValue: { find: jest.fn().mockResolvedValue([district]) } },
        { provide: getRepositoryToken(Village), useValue: { find: jest.fn().mockResolvedValue([village]) } },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /search?q=... returns typed results with item details', async () => {
    const res = await request(app.getHttpServer()).get('/search').query({ q: 'aceh' }).expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual(
      expect.arrayContaining([
        { type: 'province', item: expect.any(Object) },
        { type: 'regency', item: expect.any(Object) },
        { type: 'district', item: expect.any(Object) },
        { type: 'village', item: expect.any(Object) },
      ]),
    );
  });

  test('GET /search without q returns 400', async () => {
    await request(app.getHttpServer()).get('/search').expect(400);
  });
});

