import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { HighestDiscountDto } from './dto/highest-discount.dto';

@Controller()
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('offer')
  async createOffers(@Body() createOfferDto: CreateOfferDto) {
    return this.offerService.createOffersFromFlipkartResponse(createOfferDto.flipkartOfferApiResponse);
  }

  @Get('highest-discount')
  async getHighestDiscount(@Query() query: HighestDiscountDto) {
    const { amountToPay, bankName, paymentInstrument } = query;
    return this.offerService.getHighestDiscount(
      Number(amountToPay),
      bankName,
      paymentInstrument,
    );
  }
} 