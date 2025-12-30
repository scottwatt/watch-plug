export interface Watch {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  createdAt: Date;
  sold: boolean;
}