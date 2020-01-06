// const bcrypt = require('bcryptjs')

//Creating dummy variablie instead of database-model
const User = [];

//export the model
module.exports = User;

//create a Schema
/*********************************************************/
// userSchema.pre('save', async function (next) {
//     try {
//         //generate a salt

//         const salt = await bcrypt.genSalt(10)
//         //generate password hash (salt + hash)
//         const passwordhash = await bcrypt.hash(this.password, salt)
//         //reasign hashed version over original password
//         this.password = passwordhash
//         next();
//         // console.log('salt', salt)
//         // console.log('original password', this.password)
//         // console.log('hashed password ', passwordhash)
//     } catch (error) {
//         next(error);
//     }
// });

// userSchema.methods.isValidPassword = async function (newpassword) {
//     try {
//         return await bcrypt.compare(newpassword, this.password)
//     } catch (error) {
//         throw new Error(error);
//     }
// }

//create a model
// const User = mongoose.model('user', userSchema)
