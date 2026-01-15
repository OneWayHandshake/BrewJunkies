import { BrewMethod } from '../constants/index.js';
import { BrewParameters } from './coffee.types.js';
import { User } from './user.types.js';

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  brewMethod: BrewMethod;
  brewParams: Partial<BrewParameters> | null;
  tastingNotes: string[];
  userId: string;
  coffeeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewWithUser extends Review {
  user: Pick<User, 'id' | 'name' | 'avatarUrl'>;
}

export interface ReviewWithCoffee extends Review {
  coffee: {
    id: string;
    name: string;
    origin: string;
    imageUrl: string | null;
  };
}

export interface CreateReviewData {
  coffeeId: string;
  rating: number;
  title?: string;
  content?: string;
  brewMethod: BrewMethod;
  brewParams?: Partial<BrewParameters>;
  tastingNotes?: string[];
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  content?: string;
  brewMethod?: BrewMethod;
  brewParams?: Partial<BrewParameters>;
  tastingNotes?: string[];
}
