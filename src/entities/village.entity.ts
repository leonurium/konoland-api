import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { District } from './district.entity';

@Entity('villages')
export class Village {
  @PrimaryColumn({ type: 'bigint' })
  code: string;

  @Column({ name: 'district_code', type: 'bigint' })
  districtCode: string;

  @ManyToOne(() => District, (district) => district.villages)
  @JoinColumn({ name: 'district_code', referencedColumnName: 'code' })
  district: District;

  @Column()
  village: string;

  @Column({ name: 'postal_code' })
  postalCode: string;
}

