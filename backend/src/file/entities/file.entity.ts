import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  originalName!: string;

  @Column({ unique: true })
  storedName!: string;

  @Column()
  mimeType!: string;

  @Column({ type: 'integer' })
  size!: number;

  @Column({ unique: true })
  storagePath!: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToMany(() => Tag, (tag) => tag.files)
  @JoinTable({
    name: 'file_tags',
    joinColumn: { name: 'fileId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
