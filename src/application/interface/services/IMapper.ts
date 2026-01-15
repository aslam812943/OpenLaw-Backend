export interface IMapper<TEntity, TDTO> {
    toDTO(entity: TEntity): TDTO;
    toEntity(dto: TDTO): TEntity;
}
