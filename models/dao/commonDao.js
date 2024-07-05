const model = require('../dto/index')

exports.addDoc = async (data, schema) => {
    return new Promise(async (resolve, reject) => {
        try {
            let Schema = model[schema]
            resolve(await Schema.create(data))
        } catch (error) {
            console.log("Error occur while adding...😒", error)
            reject(error)
        }
    })
}

exports.findOneQuery = async (query, schema) => {
    return new Promise(async (resolve, reject) => {
        try {
            let Schema = model[schema]
            resolve(await Schema.findOne(query))
        } catch (error) {
            console.log("Error occur while fetching...😒", error)
            reject(error)
        }
    })
}

exports.findAndPopulate = async (query, schema) => {
    return new Promise(async (resolve, reject) => {
        try {
            // query.userId = ObjectId(query.userId)
            // console.log(query.userId, query)
            let Schema = model[schema]
            resolve(await Schema.find(query).populate('policyCategory policyCarrier'))
        } catch (error) {
            console.log("Error occur while fetching...😒", error)
            reject(error)
        }
    })
}

exports.aggregateQuery = async (schema) => {
    return new Promise(async (resolve, reject) => {
        try {
            let Schema = model[schema]
            resolve(await Schema.aggregate([
                {
                    $group: {
                        _id: '$userId',
                        totalPolicies: { $sum: 1 },
                        policies: { $push: '$$ROOT' },
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: '$user' },
            ]));
        } catch (error) {
            console.log("Error occur while aggregate...😒", error)
            reject(error)
        }
    })
}