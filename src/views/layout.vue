<template>
<div>

  <b-navbar toggleable="md" type="dark" variant="primary">
    <b-container fluid="xl">

      <b-navbar-brand to="/">
        {{ $config.general.pool_name }}
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item exact-active-class="active" to="/">Pool Statistics</b-nav-item>
          <b-nav-item exact-active-class="active" to="/user-dashboard">User Dashboard</b-nav-item>
          <b-nav-item exact-active-class="active" to="/blocks">Blocks</b-nav-item>
          <b-nav-item exact-active-class="active" to="/payouts">Payouts</b-nav-item>
          <b-nav-item-dropdown text="Links">
            <b-dropdown-item
              v-for="(link, idx) in $config.links"
              :key="idx"
              :href="link.href"
              target="_blank"
              >
              {{ link.title }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>

    </b-container>
  </b-navbar>

  <b-container fluid="xl">
    <template v-if="init.global">
      <keep-alive>
        <router-view />
      </keep-alive>
    </template>
    <template v-else>
      <div class="text-center my-5">
        <b-spinner variant="primary" style="width: 3rem; height: 3rem;" />
      </div>
    </template>
  </b-container>

  <footer class="mt-4">
    <b-container fluid="xl">
      {{ $config.general.pool_name }} powered by <a href="https://github.com/ragerxlol/ragerx-foss-frontend-vue" target="_blank">RagerX F/OSS Pool Frontend</a>. Released under the BSD-3 License.
    </b-container>
  </footer>

</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'layout',
  computed: {
    ...mapState({
      init: state => state.init
    })
  }
}
</script>
