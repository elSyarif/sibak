import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name', 50).notNullable()
      table.string('username', 35).unique().notNullable()
      table.string('email', 45).unique().notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.uuid('role_id').references('id').inTable('roles')
      table.uuid('group_id').references('id').inTable('user_groups')
      table.boolean('is_active').defaultTo(false)

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
