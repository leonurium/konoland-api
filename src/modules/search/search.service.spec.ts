import { SearchService } from './search.service';

describe('SearchService', () => {
  test('returns matches from province/regency/district/village with type + item', async () => {
    const province = { code: '11', province: 'ACEH' };
    const regency = { code: '1101', regency: 'KAB. SIMEULUE', province };
    const district = { code: '1101010', district: 'TEUPAH SELATAN', regency };
    const village = { code: '1101010001', village: 'LATIUNG', postalCode: '23781', district };

    const provinceRepo = { find: jest.fn().mockResolvedValue([province]) };
    const regencyRepo = { find: jest.fn().mockResolvedValue([regency]) };
    const districtRepo = { find: jest.fn().mockResolvedValue([district]) };
    const villageRepo = { find: jest.fn().mockResolvedValue([village]) };

    const service = new SearchService(
      // repositories are injected in Nest; for this unit test we stub them
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      provinceRepo as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      regencyRepo as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      districtRepo as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      villageRepo as any,
    );

    const result = await service.search('jakarta');

    // This is the contract we want for the endpoint:
    // - data is an array of typed results
    // - each result contains full entity detail as "item"
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0]).toHaveProperty('type');
    expect(result.data[0]).toHaveProperty('item');

    expect(result.data).toEqual(
      expect.arrayContaining([
        { type: 'province', item: province },
        { type: 'regency', item: regency },
        { type: 'district', item: district },
        { type: 'village', item: village },
      ]),
    );
  });
});

