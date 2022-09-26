<template>
    <v-btn icon @click="login" v-if="!user.isAuthenticated">
        <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn variant="text" @click="logout" v-else>
      {{ user.name }}
    <v-icon>mdi-account-off</v-icon>
  </v-btn>              
</template>

<script>
import { useUser } from '../user.js'
export default {
    setup(){
        const {user , login, logout} = useUser();
        return {user, login, logout };
    }
}
</script>