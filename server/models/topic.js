module.exports = (sequelize, DataTypes) => {
    let Topic = sequelize.define(
        'topic',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: {
                    args: true,
                    msg: 'Topic already exists.'
                }
            },
            dir_path: {
                type: DataTypes.STRING,
                allowNull: false
            },
            hours: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            underscored: true,
            tableName: 'topics'
        }
    );

    Topic.associate = (models) => {
        models.topic.belongsTo(models.subject, {
            as: 'subject',
            foreignKey: {
                name:'subject_id',
                allowNull: false
            }
        });
    };

    return Topic;
};