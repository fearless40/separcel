

export interface DbRepository<Type> {
    create(): Type;
    remove(item: Type): void
    update(item: Type): void
    find(criteria: any): Type[];
}