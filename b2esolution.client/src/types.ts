export type LoginResponse = { token: string }

export type PagedResult<T> = {
    items: T[]
    page: number
    pageSize: number
    total: number
}

export type ProductListItem = { id: number; name: string; price: number }
export type ProductCreateDto = { name: string; price: number }
export type ProductUpdateDto = { name: string; price: number }
