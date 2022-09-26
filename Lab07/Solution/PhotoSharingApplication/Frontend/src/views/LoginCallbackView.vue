<template>
    <h3>Please wait, you are being redirected to the Home page</h3> 
</template>

<script>
    
//import { UserManager } from 'oidc-client-ts'    

import applicationUserManager from '../applicationusermanager'

export default {
    async created () {
        try {
            //await new UserManager({response_mode:"query"}).signinRedirectCallback()
            await applicationUserManager.signinRedirectCallback()
            this.$router.push({name: 'home'})
        } catch (e) {
            console.log(e)
        }
    }
}
</script>