import { Entity, PrimaryGeneratedColumn, Column, TreeChildren, TreeParent, Tree } from 'typeorm';

@Entity()
@Tree("materialized-path")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeChildren()
  subordinates: UserEntity[];

  @TreeParent()
  supervisor: UserEntity;
}


