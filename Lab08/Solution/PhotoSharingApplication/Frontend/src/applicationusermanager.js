//https://authts.github.io/oidc-client-ts/classes/UserManager.html
import { UserManager } from 'oidc-client-ts'

class ApplicationUserManager extends UserManager {
  constructor () {
    super({
      authority: 'https://localhost:5001',
      client_id: 'frontend',
      redirect_uri: 'http://localhost:5173/callback',
      response_type: 'code',
      scope: 'openid profile backend',
      post_logout_redirect_uri: 'http://localhost:5173'
    })
  }

  async login () {
    await this.signinRedirect()
  }

  async logout () {
    return this.signoutRedirect()
  }
}

const applicationUserManager = new ApplicationUserManager()
export { applicationUserManager as default }