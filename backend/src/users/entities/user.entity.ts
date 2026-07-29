import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { File } from '../../file/entities/file.entity';
import { OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  avatar!: string | null;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column()
  @Exclude()
  password!: string;

  @OneToMany(() => File, (file) => file.user)
  files!: File[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
