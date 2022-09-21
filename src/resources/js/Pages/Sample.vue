<script setup>
import PVButton from 'primevue/button';
import BaseButton from '@js/Components/BaseButton';
</script>

<template>
  <div class="wrapper">
    <p>これはサンプルページです。</p>
    <p>PrimeVue のコンポーネントをいくつか表示します。</p>
    <h5>Severities</h5>
    <div class="row">
      <p-v-button label="Primary"></p-v-button>
      <p-v-button label="Secondary" class="p-button-secondary"></p-v-button>
      <p-v-button label="Success" class="p-button-success"></p-v-button>
      <p-v-button label="Info" class="p-button-info"></p-v-button>
      <p-v-button label="Warning" class="p-button-warning"></p-v-button>
      <p-v-button label="Help" class="p-button-help"></p-v-button>
      <p-v-button label="Danger" class="p-button-danger"></p-v-button>
    </div>

    <h5>Rounded Buttons</h5>
    <div class="row">
      <p-v-button label="Primary" class="p-button-rounded"></p-v-button>
      <p-v-button label="Secondary" class="p-button-rounded p-button-secondary"></p-v-button>
      <p-v-button label="Success" class="p-button-rounded p-button-success"></p-v-button>
      <p-v-button label="Info" class="p-button-rounded p-button-info"></p-v-button>
      <p-v-button label="Warning" class="p-button-rounded p-button-warning"></p-v-button>
      <p-v-button label="Help" class="p-button-rounded p-button-help"></p-v-button>
      <p-v-button label="Danger" class="p-button-rounded p-button-danger"></p-v-button>
    </div>

    <p>独自実装した Button コンポーネントです。</p>
    <div class="row">
      <base-button label="green" type="green"></base-button>
      <base-button label="gray" type="gray" rounded="true"></base-button>
      <base-button label="yellow" type="yellow" disabled="true"></base-button>
      <base-button label="purple" type="purple" size="sm"></base-button>
      <base-button label="red" type="red" icon="trash"></base-button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  margin: 3rem;
}
.row {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.row > * {
  margin-right: 0.5rem;
}
</style>
