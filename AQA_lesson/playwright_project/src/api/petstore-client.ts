import { APIRequestContext } from '@playwright/test';

export interface Pet {
  id?: number;
  category?: {
    id: number;
    name: string;
  };
  name: string;
  photoUrls: string[];
  tags?: Array<{
    id: number;
    name: string;
  }>;
  status: 'available' | 'pending' | 'sold';
}

export interface Order {
  id?: number;
  petId: number;
  quantity: number;
  shipDate?: string;
  status: 'placed' | 'approved' | 'delivered';
  complete?: boolean;
}

export class PetstoreApiClient {
  private baseURL = 'https://petstore.swagger.io/v2';
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createPet(pet: Pet): Promise<{ response: any; data: Pet }> {
    const response = await this.request.post(`${this.baseURL}/pet`, {
      data: pet,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return { response, data };
  }

  async getPetById(petId: number): Promise<{ response: any; data: Pet }> {
    const response = await this.request.get(`${this.baseURL}/pet/${petId}`);
    const data = await response.json();
    return { response, data };
  }

  async updatePet(pet: Pet): Promise<{ response: any; data: Pet }> {
    const response = await this.request.put(`${this.baseURL}/pet`, {
      data: pet,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return { response, data };
  }

  async findPetsByStatus(status: string): Promise<{ response: any; data: Pet[] }> {
    const response = await this.request.get(`${this.baseURL}/pet/findByStatus`, {
      params: { status }
    });
    
    const data = await response.json();
    return { response, data };
  }

  async deletePet(petId: number): Promise<{ response: any }> {
    const response = await this.request.delete(`${this.baseURL}/pet/${petId}`, {
      headers: {
        'api_key': 'special-key'
      }
    });
    
    return { response };
  }

  async createOrder(order: Order): Promise<{ response: any; data: Order }> {
    const response = await this.request.post(`${this.baseURL}/store/order`, {
      data: order,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return { response, data };
  }

  async getOrderById(orderId: number): Promise<{ response: any; data: Order }> {
    const response = await this.request.get(`${this.baseURL}/store/order/${orderId}`);
    const data = await response.json();
    return { response, data };
  }

  async deleteOrder(orderId: number): Promise<{ response: any }> {
    const response = await this.request.delete(`${this.baseURL}/store/order/${orderId}`);
    return { response };
  }

  generateRandomPetId(): number {
    return Math.floor(Math.random() * 1000000) + 1000;
  }

  generateRandomOrderId(): number {
    return Math.floor(Math.random() * 1000000) + 1000;
  }

  getCurrentISODate(): string {
    return new Date().toISOString();
  }
}