import { IsNumberString, IsString, IsOptional } from 'class-validator';

export class HighestDiscountDto {
  @IsNumberString()
  amountToPay: string;

  @IsString()
  bankName: string;

  @IsOptional()
  @IsString()
  paymentInstrument?: string;
} 