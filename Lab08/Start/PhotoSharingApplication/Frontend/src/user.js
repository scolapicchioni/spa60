import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import applicationUserManager from './applicationusermanager.js'

// by convention, composable function names start with "use"
export function useUser() {
    const route = useRoute()

    // state encapsulated and managed by the composable
    const user = ref({
                    name: '',
                    isAuthenticated: false
                })

    async function login () {
        try {
            await applicationUserManager.login()
        } catch (error) {
            console.log(error)
        }
    }
    async function logout () {
        try {
            await applicationUserManager.logout()
        } catch (error) {
            console.log(error)
        }
    }
    async function refreshUserInfo () {
        const userFromUM = await applicationUserManager.getUser()
        console.log("got user from userManager")
        console.dir(userFromUM)
        if (userFromUM) {
            user.value.name = userFromUM.profile.name
            user.value.isAuthenticated = true
        } else {
            user.value.name = ''
            user.value.isAuthenticated = false
        }
    }

    onMounted(async () => await refreshUserInfo())

    watch(
        () => route.path,
        async () => {
            await refreshUserInfo()
        }
    )

    // expose managed state as return value
    return { user, login, logout }
}