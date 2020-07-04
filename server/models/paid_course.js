module.exports = (sequelize, DataTypes) => {
    let PaidCourse = sequelize.define(
        'paid_course',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true               
            },
            order_id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Order id exists'
                }
            },
            txn_status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            underscored: true,
            tableName: 'paid_courses'
        }
    );
    return PaidCourse;
}