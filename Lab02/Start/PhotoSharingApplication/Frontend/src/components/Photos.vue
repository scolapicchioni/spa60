<template>
    <div>
        <div v-for="photo in photos" :key="photo.id">
            <p>{{ photo.id }} - {{ photo.title }}</p>
            <p>{{ photo.description }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            photos: [
                {id: 1, title: 'Win-win survival strategies', description: 'Bring to the table win-win survival strategies to ensure proactive domination.'},
                {id: 2, title: 'High level overviews', description: 'Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition.'},
                {id: 3, title: 'Organically grow world', description: 'Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.'},
                {id: 4, title: 'Agile frameworks', description: 'Leverage agile frameworks to provide a robust synopsis for high level overviews'}
            ]
        }
    }
}
</script>