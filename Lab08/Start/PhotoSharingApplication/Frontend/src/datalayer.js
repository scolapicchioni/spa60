import applicationUserManager from './applicationusermanager'
const datalayer = {
  serviceUrl: 'https://localhost:7241/api/photos',
  async getPhotos () {
    const response = await fetch(this.serviceUrl)
    return response.json()
  },
  async getPhotoById (id) {
    const response = await fetch(`${this.serviceUrl}/${id}`)
    return response.json()
  },
  async insertPhoto (photo) {
    const user = await applicationUserManager.getUser()
    const response = await fetch(this.serviceUrl, {
      method: 'POST',
      body: JSON.stringify(photo),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (user ? user.access_token : '')
      })
    })
    let result
    if (response.status !== 201) {
      result = response.statusText
    } else {
      result = await response.json()
    }
    return result
  },
  async updatePhoto (id, photo) {
    const user = await applicationUserManager.getUser()
    return fetch(`${this.serviceUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(photo),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (user ? user.access_token : '')
      })
    })
  },
  async deletePhoto (id) {
    const user = await applicationUserManager.getUser()
    return fetch(`${this.serviceUrl}/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': 'Bearer ' + (user ? user.access_token : '')
      })
    })
  }
}

export default datalayer