const datalayer = {
    photos: [
      {id: 1, title: 'WIN-WIN survival strategies', description: 'Bring to the table win-win survival strategies to ensure proactive domination.'},
      {id: 2, title: 'HIGH level overviews', description: 'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.'},
      {id: 3, title: 'ORGANICALLY grow world', description: 'Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.'},
      {id: 4, title: 'AGILE frameworks', description: 'Leverage agile frameworks to provide a robust synopsis for high level overviews'}
    ],
    getPhotos () {
      return this.photos
    },
    getPhotoById (id) {
      return this.photos.find(p => p.id === id)
    },
    insertPhoto (photo) {
      const id = this.photos.reduce((prev, curr) => prev.id > curr.id ? prev.id : curr.id) + 1
      photo.id = id
      this.photos.push(photo)
    },
    updatePhoto (id, photo) {
      const oldPhoto = this.photos.find(p => p === id)
      if (oldPhoto) {
        oldPhoto.title = photo.title
        oldPhoto.description = photo.description
      }
    },
    deletePhoto (id) {
      const photoIndex = this.photos.findIndex(p => p.id === id)
      this.photos.splice(photoIndex, 1)
    }
  }
  
  export default datalayer