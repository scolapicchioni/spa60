<template>
<v-app>

  <v-app-bar app color="primary">
    <v-btn icon :to="{name: 'home'}">
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn icon :to="{name: 'about'}">
      <v-icon>mdi-chat</v-icon>
    </v-btn>
    
    <v-btn icon :to="{name: 'create'}">
      <v-icon>mdi-pencil-plus</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
