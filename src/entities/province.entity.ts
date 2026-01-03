import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Regency } from './regency.entity';

@Entity('provinces')
export class Province {
  @PrimaryColumn({ type: 'bigint' })
  code: string;

  @Column()
  province: string;

  @OneToMany(() => Regency, (regency) => regency.province)
  regencies: Regency[];
}

