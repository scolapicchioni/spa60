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
import applicationUserManager from '../applicationusermanager'
export default {
    data () {
        return {
            user: {
                name: '',
                isAuthenticated: false
            }
        }
    },
    async created () {
        await this.refreshUserInfo()
    },
    watch: {
        async '$route' (to, from) {
            await this.refreshUserInfo()
        }
    },
    methods: {
        async login () {
            try {
                await applicationUserManager.login()
            } catch (error) {
                console.log(error)
            }
        },
        async logout () {
            try {
                await applicationUserManager.logout()
            } catch (error) {
                console.log(error)
            }
        },
        async refreshUserInfo () {
            const user = await applicationUserManager.getUser()
            console.log("got user from userManager")
            console.dir(user)
            if (user) {
                this.user.name = user.profile.name
                this.user.isAuthenticated = true
            } else {
                this.user.name = ''
                this.user.isAuthenticated = false
            }
        }
    }
}
</script>