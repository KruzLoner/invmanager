export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  category?: string;
  lastUpdated?: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
} 