<template>
<b-modal
  id="user-settings"
  title="User Settings"
  size="lg"
  @show="resetForm"
  >

  <b-form @submit="onSave">

    <h4>Payout Settings</h4>

    <div class="my-3">
      <b-form-checkbox v-model="settings.anon_leader">
        Anonymize me in public statistics
      </b-form-checkbox>
    </div>

    <b-form-group
      label="Payout Address:"
      :state="!settings.wallet || $user.validateAddress(settings.wallet) ? null : false"
      invalid-feedback="Invalid payout address"
      >
      <b-form-input
        v-model="settings.wallet"
        lazy required
        />
    </b-form-group>

    <b-form-group>
      <template v-slot:label>
        Payout Threshold: {{ settings.payment_threshold | fixedMoney }}
      </template>
      <b-form-input
        type="range"
        v-model="settings.payment_threshold"
        :min="$store.state.stats.pool_info.payouts.min_payout"
        :max="$store.state.stats.pool_info.payouts.max_payout"
        :step="$store.state.stats.pool_info.payouts.min_payout"
        required
        />
    </b-form-group>

    <hr />

    <h4>Difficulty Settings</h4>

    <div class="my-3">
      <b-form-radio-group
        v-model="settings.user_diff_type"
        :options="user_diff_options"
        />
    </div>

    <b-form-group>
      <template v-slot:label>
        Difficulty: {{ settings.user_diff | commas }}
      </template>
      <b-form-input
        type="range"
        v-model="settings.user_diff"
        :disabled="settings.user_diff_type === 'auto'"
        min="1000"
        max="1000000"
        step="100"
        required
        />
    </b-form-group>

    <hr />

    <h4>Password Settings</h4>
    <p>If you don't want to change your password, leave blank.</p>

    <b-row>
      <b-col md="6">
        <b-form-group
          label="New Password:"
          :state="!settings.new_password || $user.validatePassword(settings.new_password) ? null : false"
          invalid-feedback="Password is too short"
          >
          <b-input-group>
            <b-form-input
              v-model="settings.new_password"
              :type="settings.show_new_password ? 'text' : 'password'"
              lazy
              />
            <template v-slot:append>
              <b-input-group-text>
                <b-form-checkbox v-model="settings.show_new_password" switch tabindex="-1" />
              </b-input-group-text>
            </template>
          </b-input-group>
        </b-form-group>

      </b-col>
      <b-col md="6">
        <b-form-group
          label="Confirm Password:"
          :state="!settings.confirm_new_password || $user.validateConfirmPassword(settings.new_password, settings.confirm_new_password) ? null : false"
          invalid-feedback="Passwords do not match"
          >
          <b-input-group>
            <b-form-input
              v-model="settings.confirm_new_password"
              :type="settings.show_confirm_new_password ? 'text' : 'password'"
              lazy
              />
            <template v-slot:append>
              <b-input-group-text>
                <b-form-checkbox v-model="settings.show_confirm_new_password" switch tabindex="-1" />
              </b-input-group-text>
            </template>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

  </b-form>

  <template v-slot:modal-footer>

    <template v-if="settings.error">
      <span class="ml-2 text-danger">
        <b-icon-alert-triangle-fill />
        {{ settings.error }}
      </span>
    </template>

    <b-button variant="outline-danger" @click="$bvModal.hide('user-settings')">
      Cancel
    </b-button>

    <b-button variant="primary" @click="onSave">
      Save
    </b-button>

  </template>

</b-modal>
</template>

<script>
export default {
  name: 'UserSettings',
  data() {
    return {
      settings: {
        anon_leader: true,
        wallet: '',
        payment_threshold: 0,
        user_diff_type: 'auto',
        user_diff: 1000,
        new_password: '',
        confirm_new_password: '',
        show_new_password: false,
        show_confirm_new_password: false,
        error: '',
        show: true,
      },
      user_diff_options: [
        { text: 'Automatic', value: 'auto' },
        { text: 'Starting Difficulty', value: 'start' },
        { text: 'Constant Difficulty', value: 'static' },
      ]
    }
  },
  methods: {
    resetForm() {
      const current_settings = this.$store.state.user.info
      let user_diff_type = 'auto'
      let user_diff = 0
      if(current_settings.user_diff < 0) {
        user_diff_type = 'static'
        user_diff = Math.abs(current_settings.user_diff)
      } else if(current_settings.user_diff > 0) {
        user_diff_type = 'start'
        user_diff = current_settings.user_diff
      }

      this.settings = {
        anon_leader: current_settings.anon_leader,
        wallet: current_settings.wallet,
        payment_threshold: current_settings.payment_threshold,
        user_diff_type,
        user_diff,
        new_password: '',
        confirm_new_password: '',
        show_new_password: false,
        show_confirm_new_password: false,
        error: '',
        show: false,
      }
      // Trick to reset/clear native browser form validation state
      this.$nextTick(() => {
        this.settings.show = true
      })
    },
    onSave(evt) {
      evt.preventDefault()
      this.settings.error = ''

      const settings = {}

      for(const [key, value] of Object.entries(this.settings)) {
        switch(key) {
        case 'new_password':
          if(value !== '') {
            settings[key] = value
          }
          break
        case 'wallet':
        case 'anon_leader':
        case 'payment_threshold':
          settings[key] = value
          break
        case 'user_diff':
          if(this.settings.user_diff_type === 'auto') {
            settings[key] = 0
          } else if(this.settings.user_diff_type === 'static') {
            settings[key] = -1 * value
          } else if(this.settings.user_diff_type === 'start') {
            settings[key] = value
          }
          break
        }
      }

      this.$user.saveSettings(settings).then(result => {
        if(result.error) {
          switch(result.message) {
          case 'ERR_INVALID_USER_DIFF':
            this.settings.error = 'Invalid difficulty'
            break
          case 'ERR_INVALID_PAYMENT_THRESHOLD':
            this.settings.error = 'Invalid payout threshold'
            break
          case 'ERR_INVALID_WALLET':
            this.settings.error = 'Invalid payout address'
            break
          default:
            this.settings.error = 'An error occured'
            break
          }
        } else {
          this.$bvToast.toast('Settings saved!', {
            variant: 'primary',
            noCloseButton: true,
            autoHideDelay: 2000,
            solid: true
          })
          this.$bvModal.hide('user-settings')
        }
      })
    },
  }
}
</script>
