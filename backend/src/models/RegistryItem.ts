export interface RegistryItem {
  userId: string,
  registryItemId: string,
  createdAt: string,
  name: string,
  description: string,
  link?: string,
  complete: boolean,
  imageUrl?: string
}