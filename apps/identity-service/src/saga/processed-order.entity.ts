import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('processed_orders')
export class ProcessedOrder {
  @PrimaryColumn()
  order_id!: string;

  @Column()
  user_id!: string;

  @CreateDateColumn()
  processed_at!: Date;
}
