import { formatCurrency } from "../utils/moneyUtilities.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const jsonDataFilePath = './temp-backend/deliveryOptions.json';

class DeliveryOptions {
  id;
  deliveryDays;
  pricePaisa;

  constructor(deliveryDetails) {
    this.id = deliveryDetails.id;
    this.deliveryDays = deliveryDetails.deliveryDays;
    this.pricePaisa = deliveryDetails.pricePaisa;
  }

  getPriceString() {
    const priceString = (this.pricePaisa === 0)
                          ? 'FREE'
                          : `INR ${formatCurrency(this.pricePaisa)}`;
    return priceString;
  }

  getDeliveryDateString() {
    const today = dayjs();
    const deliveryDate = today.add(
      this.deliveryDays, 'days'
    );
    return deliveryDate.format('dddd, MMMM D');
  }
} 

export let deliveryOptions = [];
export async function fetchDeliveryOptions() {
  try {
    const response = await fetch(jsonDataFilePath);
    const deliveryOptionsData = await response.json();

    deliveryOptions = deliveryOptionsData.map((deliveryDetails) => {
      return new DeliveryOptions(deliveryDetails);
    });
  } catch (error) {
    console.error('Error fetching delivery options', error);
  }
}

