<template>
<div>

  <b-row class="mt-3">

    <b-col lg="6">
      <b-card title="Login to an Existing Account">
        <b-card-text>

          <p>Already have an account? Use the form below to login and access your miner statistics, payout history, and settings.</p>

          <b-form @submit="onLogin" v-if="login.show">

            <b-form-group
              id="form-group-login-username"
              label="Username:"
              label-for="form-input-login-username"
              :state="!login.username || $user.validateUsername(login.username) ? null : false"
              invalid-feedback="Minimum three alphanumeric characters or dashes"
              >
              <b-form-input
                id="form-input-login-username"
                v-model="login.username"
                lazy required
                />
            </b-form-group>

            <b-form-group
              id="form-group-login-password"
              label="Password:"
              label-for="form-input-login-password"
              :state="!login.password || $user.validatePassword(login.password) ? null : false"
              invalid-feedback="Password is too short"
              >
              <b-input-group>
                <b-form-input
                  id="form-input-login-password"
                  v-model="login.password"
                  :type="login.show_password ? 'text' : 'password'"
                  lazy required
                  />
                <template v-slot:append>
                  <b-input-group-text>
                    <b-form-checkbox v-model="login.show_password" switch tabindex="-1" />
                  </b-input-group-text>
                </template>
              </b-input-group>
            </b-form-group>

            <b-button
              type="submit"
              label="Login"
              variant="primary"
              :disabled="!canLogin"
              >
              Login
            </b-button>

            <template v-if="login.error">
              <span class="ml-2 text-danger">
                <b-icon-alert-triangle-fill />
                {{ login.error }}
              </span>
            </template>

          </b-form>

        </b-card-text>
      </b-card>
    </b-col>

    <b-col lg="6">
      <b-card title="Register an Account">
        <b-card-text>

          <p>New here? Register below to start mining. You will be able to change your payout address and other settings later on.</p>

          <b-form @submit="onRegister" v-if="register.show">
            <b-form-group
              id="form-group-register-username"
              label="Username:"
              label-for="form-input-register-username"
              :state="!register.username || $user.validateUsername(register.username) ? null : false"
              invalid-feedback="Minimum three alphanumeric characters or dashes"
              >
              <b-form-input
                id="form-input-register-username"
                v-model="register.username"
                lazy required
                />
            </b-form-group>

            <b-form-group
              id="form-group-register-password"
              label="Password:"
              label-for="form-input-register-password"
              :state="!register.password || $user.validatePassword(register.password) ? null : false"
              invalid-feedback="Password is too short"
              >
              <b-input-group>
                <b-form-input
                  id="form-input-register-password"
                  v-model="register.password"
                  :type="register.show_password ? 'text' : 'password'"
                  lazy required
                  />
                <template v-slot:append>
                  <b-input-group-text>
                    <b-form-checkbox v-model="register.show_password" switch tabindex="-1" />
                  </b-input-group-text>
                </template>
              </b-input-group>
            </b-form-group>

            <b-form-group
              id="form-group-register-confirm-password"
              label="Confirm Password:"
              label-for="form-input-register-confirm-password"
              :state="!register.confirm_password || $user.validateConfirmPassword(register.password, register.confirm_password) ? null : false"
              invalid-feedback="Passwords do not match"
              >
              <b-input-group>
                <b-form-input
                  id="form-input-register-confirm-password"
                  v-model="register.confirm_password"
                  :type="register.show_confirm_password ? 'text' : 'password'"
                  lazy required
                  />
                <template v-slot:append>
                  <b-input-group-text>
                    <b-form-checkbox v-model="register.show_confirm_password" switch tabindex="-1" />
                  </b-input-group-text>
                </template>
              </b-input-group>
            </b-form-group>

            <b-form-group
              id="form-group-register-wallet"
              label="Payout Address:"
              label-for="form-input-register-wallet"
              :state="!register.wallet || $user.validateAddress(register.wallet) ? null : false"
              invalid-feedback="Invalid payout address"
              >
              <b-form-input
                id="form-input-register-wallet"
                v-model="register.wallet"
                lazy required
                />
            </b-form-group>

            <b-button
              type="submit"
              label="Register"
              variant="primary"
              :disabled="!canRegister"
              >
              Register
            </b-button>

            <template v-if="register.error">
              <span class="ml-2 text-danger">
                <b-icon-alert-triangle-fill />
                {{ register.error }}
              </span>
            </template>

          </b-form>

        </b-card-text>
      </b-card>
    </b-col>

  </b-row>

</div>
</template>

<script>
export default {
  name: 'login',
  computed: {
    canRegister() {
      return this.$user.validateUsername(this.register.username)
        && this.$user.validatePassword(this.register.password)
        && this.$user.validateConfirmPassword(this.register.password, this.register.confirm_password)
        && this.$user.validateAddress(this.register.wallet)
    },
    canLogin() {
      return this.$user.validateUsername(this.login.username)
        && this.$user.validatePassword(this.login.password)
    }
  },
  data() {
    return {
      login: {
        username: '',
        password: '',
        show_password: false,
        error: '',
        show: true,
      },
      register: {
        username: '',
        password: '',
        confirm_password: '',
        show_password: false,
        show_confirm_password: false,
        wallet: '',
        error: '',
        show: true,
      }
    }
  },
  methods: {
    resetForms() {
      this.login = {
        username: '',
        password: '',
        show_password: false,
        error: '',
        show: false,
      }
      this.register = {
        username: '',
        password: '',
        confirm_password: '',
        show_password: false,
        show_confirm_password: false,
        wallet: '',
        error: '',
        show: false,
      }
      // Trick to reset/clear native browser form validation state
      this.$nextTick(() => {
        this.login.show = true
        this.register.show = true
      })
    },
    onLogin(evt) {
      evt.preventDefault()
      this.login.error = ''
      this.$user.login(this.login.username, this.login.password).then(result => {
        if(result.error) {
          switch(result.message) {
          case 'ERR_INVALID_PASSWORD':
            this.login.error = 'Invalid username or password'
            break
          default:
            this.login.error = 'An error occured'
            break
          }
        } else {
          this.resetForms()
        }
      })
    },
    onRegister(evt) {
      evt.preventDefault()
      this.register.error = ''
      this.$user.register(this.register.username, this.register.password, this.register.wallet).then(result => {
        if(result.error) {
          switch(result.message) {
          case 'ERR_RESERVED_USERNAME':
            this.register.error = 'Username contains a reserved word'
            break
          case 'ERR_INVALID_USERNAME':
            this.register.error = 'Minimum three alphanumeric characters or dashes'
            break
          case 'ERR_PASSWORD_TOO_SHORT':
            this.register.error = 'Password is too short'
            break
          case 'ERR_USERNAME_TAKEN':
            this.register.error = 'Username is taken'
            break
          case 'ERR_INVALID_WALLET':
            this.register.error = 'Invalid payout address'
            break
          default:
            this.register.error = 'An error occured'
            break
          }
        } else {
          this.resetForms()
        }
      })
    }
  }
}
</script>
