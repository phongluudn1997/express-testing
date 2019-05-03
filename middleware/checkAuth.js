const User = require('../models/user')


// module.exports = (userId, action_code, cb) => {
//     User
//         .findOne({ _id: userId })
//         .populate({
//             path: 'user_role',
//             populate: {
//                 path: 'permissions',
//                 match: { action_code: action_code }
//             }
//         })
//         .exec((err, user) => {
//             if (err) {
//                 return cb(err,false)
//             }
//             else if (user.user_role.permissions.length == 0) {
//                 return cb(null, false)
//             }
//             else {
//                 console.log(user.user_role.permissions[0].action_name)
//                 return cb(null, true)
//             }
//         })
// }


module.exports = async (userId, action_code) => {
    let permission;
    try {
      const user = await User
        .findOne({ _id: userId })
        .populate({
        path: 'user_role',
        populate: {
          path: 'permissions',
          match: { action_code: action_code }
        }
      })
      if (user.user_role.permissions.length == 0) {
        permission = false
      } else {
        console.log(user.user_role.permissions)
        permission = true
      }
    } catch (e) {
      throw e
    }
    return permission
  }