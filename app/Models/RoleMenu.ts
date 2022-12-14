import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Role from './Role';
import Menu from './Menu';

export default class RoleMenu extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roleId: string

  @column()
  public menuId: number
  
  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @belongsTo(() => Menu)
  public menu: BelongsTo<typeof Menu>

}
