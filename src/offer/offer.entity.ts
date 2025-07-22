import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['offerId'])
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  offerId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  bankName: string;

  @Column()
  discountType: string;

  @Column('float')
  discountValue: number;

  @Column('float', { nullable: true })
  maxDiscountAmount: number;

  @Column('simple-array')
  paymentInstruments: string[];

  @Column({ nullable: true })
  terms: string;
} 