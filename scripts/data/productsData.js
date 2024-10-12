import { formatCurrency } from "../utils/moneyUtilities.js";

const config = {
  imageBasePath: './assets/images/products/',
  ratingsBasePath: './assets/images/products/ratings/',
  extraInfoBasePath: './assets/images/products/extra-info/',
  jsonDataFilePath: './temp-backend/products.json'
};

class Product {
  id;
  name;
  rating;
  pricePaisa;
  stockQuantity;
  availability;
  description;
  brand;
  company;
  imageName;
  imageType;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.pricePaisa = productDetails.pricePaisa;
    this.stockQuantity = productDetails.stockQuantity;
    this.availability = productDetails.availability;
    this.description = productDetails.description;
    this.brand = productDetails.brand;
    this.company = productDetails.company;
    this.imageName = productDetails.imageName;
    this.imageType = productDetails.imageType;
  }

  getStarsURL() {
    const ratingFileName = `rating-${this.rating.stars * 10}.png`;
    return `${config.ratingsBasePath}${ratingFileName}`;
  }

  getPriceinRupees() {
    return `INR ${formatCurrency(this.pricePaisa)}`;
  }

  getImagePath() {
    return `${config.imageBasePath}${this.imageName}.${this.imageType}`;
  }

  extraInfoHTML() {
    return '';
  }

}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${config.extraInfoBasePath}${this.sizeChartLink}" target="_blank">
        Size Chart
      </a>
    `;
  }
}

class Appliance extends Product {
  instructionsLink;
  warrantyLink;

  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }

  extraInfoHTML() {
    return `
      <a href="${config.extraInfoBasePath}${this.instructionsLink}" target="_blank">
        Instructions
      </a>
      <a href="${config.extraInfoBasePath}${this.warrantyLink}" target="_blank">
        Warranty
      </a>
    `;
  }
}

const tempProductsPath = config.jsonDataFilePath;
let products = []

export async function loadProducts() {
  try {
    const response = await fetch(tempProductsPath);
    const productsData = await response.json();

    products = productsData.map((productDetails) => {
      
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      } else if (productDetails.type === 'appliance') {
        return new Appliance(productDetails);
      }
      return new Product(productDetails);
    
    });

  } catch (error) {
    console.error('Error loading or processing products.json:', error);
  }
}

export function retrieveAllProducts() {
  return products;
}

export function getProductById(productId) {
  const matchingProduct = products.find(productDetails => 
    productDetails.id === productId
  );

  return matchingProduct;
}