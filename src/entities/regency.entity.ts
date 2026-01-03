import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Province } from './province.entity';
import { District } from './district.entity';

export enum RegencyType {
  KOTA = 'Kota',
  KABUPATEN = 'Kabupaten',
}

@Entity('regencies')
export class Regency {
  @PrimaryColumn({ type: 'bigint' })
  code: string;

  @Column({ name: 'province_code', type: 'bigint' })
  provinceCode: string;

  @ManyToOne(() => Province, (province) => province.regencies)
  @JoinColumn({ name: 'province_code', referencedColumnName: 'code' })
  province: Province;

  @Column()
  regency: string;

  @Column({
    type: 'enum',
    enum: RegencyType,
  })
  type: RegencyType;

  @OneToMany(() => District, (district) => district.regency)
  districts: District[];
}

