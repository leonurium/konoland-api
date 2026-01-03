import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Regency } from './regency.entity';
import { Village } from './village.entity';

@Entity('districts')
@Index(['regencyCode'])
export class District {
  @PrimaryColumn({ type: 'bigint' })
  code: string;

  @Column({ name: 'regency_code', type: 'bigint' })
  regencyCode: string;

  @ManyToOne(() => Regency, (regency) => regency.districts)
  @JoinColumn({ name: 'regency_code', referencedColumnName: 'code' })
  regency: Regency;

  @Column()
  district: string;

  @OneToMany(() => Village, (village) => village.district)
  villages: Village[];
}

