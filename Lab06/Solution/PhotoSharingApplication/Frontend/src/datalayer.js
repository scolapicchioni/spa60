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
    const response = await fetch(this.serviceUrl, {
      method: 'POST',
      body: JSON.stringify(photo),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    return response.json()
  },
  async updatePhoto (id, photo) {
    return fetch(`${this.serviceUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(photo),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
  },
  async deletePhoto (id) {
    return fetch(`${this.serviceUrl}/${id}`, {
      method: 'DELETE'
    })
  }
}

export default datalayer