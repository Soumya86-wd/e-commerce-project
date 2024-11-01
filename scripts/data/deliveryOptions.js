import { formatPaisaToRupees } from "../utils/moneyUtilities.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const jsonDataFilePath = './temp-backend/deliveryOptions.json';
let deliveryOptions = [];

export function retrieveDeliveryOptions() {
  return deliveryOptions;
}

class DeliveryOption {
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
                          : `INR ${formatPaisaToRupees(this.pricePaisa)} -`;
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

export async function loadDeliveryOptions() {
  try {
    const response = await fetch(jsonDataFilePath);

    if(!response.ok) {
      const errorMessage = 'Failed to fetch deliveryOptions';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const deliveryOptionsData = await response.json();

    deliveryOptions = deliveryOptionsData.map((deliveryDetails) => {
      return new DeliveryOption(deliveryDetails);
    });

  } catch (error) {
    console.error('Error in loadDeliveryOptions', error.message);
    throw error;
  }
}

export function getDeliveryOptionById(deliveryOptionId) {
  const selectedDeliveryOption = deliveryOptions.find(deliveryOption => 
    deliveryOption.id === deliveryOptionId
  );
  return selectedDeliveryOption || deliveryOptions[0];
}