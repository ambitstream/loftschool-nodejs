exports.auth = ({email, password}) => new Promise(async (resolve, reject) => {
  try {
    if (!email || !password) {
      reject('Email and password are required')
      return
    }

    if (email !== 'admin@admin.com' || password !== 'admin') {
      reject('Incorrect credemtials')
      return
    }
    resolve(true)
  } catch (e) {
    reject(e)
  }
})
