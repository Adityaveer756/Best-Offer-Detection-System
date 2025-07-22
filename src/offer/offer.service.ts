import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Offer } from './offer.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async createOffersFromFlipkartResponse(flipkartOfferApiResponse: any) {
    const offers = this.parseOffers(flipkartOfferApiResponse);
    let noOfOffersIdentified = offers.length;
    let noOfNewOffersCreated = 0;
    for (const offer of offers) {
      const exists = await this.offerRepository.findOne({ where: { offerId: offer.offerId } });
      if (!exists) {
        await this.offerRepository.save(offer);
        noOfNewOffersCreated++;
      }
    }
    return { noOfOffersIdentified, noOfNewOffersCreated };
  }

  parseOffers(apiResponse: any): Partial<Offer>[] {
    // Adapt this function to the actual Flipkart API response structure
    if (!apiResponse.offers) return [];
    return apiResponse.offers.map((o) => ({
      offerId: o.id,
      title: o.title,
      description: o.description,
      bankName: o.bank,
      discountType: o.discountType,
      discountValue: o.discountValue,
      maxDiscountAmount: o.maxDiscountAmount,
      paymentInstruments: o.paymentInstruments || [],
      terms: o.terms || '',
    }));
  }

  async getHighestDiscount(amountToPay: number, bankName: string, paymentInstrument?: string) {
    let where: any = { bankName };
    if (paymentInstrument) {
      where.paymentInstruments = In([paymentInstrument]);
    }
    const offers = await this.offerRepository.find({ where });
    let highestDiscount = 0;
    for (const offer of offers) {
      let discount = 0;
      if (offer.discountType === 'FLAT') {
        discount = offer.discountValue;
      } else if (offer.discountType === 'PERCENTAGE') {
        discount = (amountToPay * offer.discountValue) / 100;
        if (offer.maxDiscountAmount) {
          discount = Math.min(discount, offer.maxDiscountAmount);
        }
      }
      if (discount > highestDiscount) highestDiscount = discount;
    }
    return { highestDiscountAmount: highestDiscount };
  }
} 