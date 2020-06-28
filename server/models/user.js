module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define(
        'user',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true               
            },
            first_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Email already in use'
                },
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            cust_id: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            access: {
                type: DataTypes. INTEGER,
                allowNull: false,
                defaultValue: 3
            }
        },
        {
            underscored: true,
            tableName: 'users'
        }
    );

    User.associate = (models) => {
        models.user.belongsToMany(models.course,{
            through: 'courses_paid',
            foreignKey: 'user_id'
        });
    };
    return User;
};