<template>
  <div :style="{'min-width': minWidth + 'rem'}">
    <m-table v-table-head-fixed
             :columns="validatorFields"
             :data="items"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc">
      <template slot-scope="{ row }"
                slot="moniker">
        <div>
          <img v-if="row.url"
               style="width: 0.3rem;height: 0.3rem;border-radius: 0.3rem;overflow: hidden;"
               :src="row.url ? row.url : ''" />
          <router-link style="margin-left: 0.2rem;"
                       :to="addressRoute(row.operatorAddress)"
                       class="link_style">{{row.moniker}}</router-link>
        </div>
      </template>
      <template slot-scope="{ row }"
                slot="operatorAddress">
        <span class="remove_default_style">
          <router-link :to="addressRoute(row.operatorAddress)"
                       class="link_style operator_address_style">{{formatAddress(row.operatorAddress)}}</router-link>
        </span>
      </template>
    </m-table>
  </div>
</template>

<script>
import Tools from '../../util/Tools';

export default {
  name: 'MValidatorListTable',
  props: {
    items: {
      type: Array,
      default: []
    },
    showNoData: {
      type: Boolean,
      default: true
    },
    minWidth: {
      type: Number,
      default: 12.8
    }
  },
  data () {
    return {
      validatorFields: [],
      sortBy: 'votingPower',
      sortDesc: true,
      activeValidatorFields: [
        {
          title: 'Moniker',
          slot: 'moniker',
          sortable: true
        },
        {
          title: 'Operator_Address',
          slot: 'operatorAddress',
          tooltip: true
        },
        {
          title: 'Commission_Rate',
          key: 'commission',
          sortable: true,
          sortMethod: this.sortMethodPer('commission'),
          className: 'text_right'
        },
        {
          title: 'Bonded_Tokens',
          key: 'bondedToken',
          sortable: true,
          sortMethod: this.sortMethodSplit('bondedToken'),
          className: 'text_right'
        },
        {
          title: 'Voting_Power',
          key: 'votingPower',
          sortable: true,
          sortMethod: this.sortMethodPer('votingPower'),
          className: 'text_right'
        },
        {
          title: 'Uptime',
          key: 'uptime',
          sortable: true,
          sortMethod: this.sortMethodPer('uptime'),
          className: 'text_right'
        },
        {
          title: 'Self_Bonded',
          key: 'selfBond',
          sortable: true,
          sortMethod: this.sortMethodSplit('selfBond'),
          className: 'text_right'
        },
        {
          title: 'Delegators',
          key: 'delegatorNum',
          sortable: true,
          sortMethod: this.sortMethodNumber('delegatorNum'),
          className: 'text_right'
        },
        {
          title: 'Bond_Height',
          key: 'bondHeight',
          sortable: true,
          sortMethod: this.sortMethodNumber('bondHeight'),
          className: 'text_right'
        }
      ],
      jailedValidatorFields: [
        {
          title: 'Moniker',
          slot: 'moniker',
          sortable: true
        },
        {
          title: 'Operator_Address',
          slot: 'operatorAddress',
          tooltip: true
        },
        {
          title: 'Commission_Rate',
          key: 'commission',
          sortable: true,
          sortMethod: this.sortMethodPer('commission'),
          className: 'text_right'
        },
        {
          title: 'Bonded_Tokens',
          key: 'bondedToken',
          sortable: true,
          sortMethod: this.sortMethodSplit('bondedToken'),
          className: 'text_right'
        },
        {
          title: 'Self_Bonded',
          key: 'selfBond',
          sortable: true,
          sortMethod: this.sortMethodSplit('selfBond'),
          className: 'text_right'
        },
        {
          title: 'Bond_Height',
          key: 'bondHeight',
          sortable: true,
          sortMethod: this.sortMethodNumber('bondHeight'),
          className: 'text_right'
        },
        {
          title: 'Unbonding_Height',
          key: 'unbondingHeight',
          sortable: true,
          sortMethod: this.sortMethodNumber('unbondingHeight'),
          className: 'text_right'
        }
      ],
      candidateValidatorFields: [
        {
          title: 'Moniker',
          slot: 'moniker',
          sortable: true
        },
        {
          title: 'Operator_Address',
          slot: 'operatorAddress',
          tooltip: true
        },
        {
          title: 'Commission_Rate',
          key: 'commission',
          sortable: true,
          sortMethod: this.sortMethodPer('commission'),
          className: 'text_right'
        },
        {
          title: 'Bonded_Tokens',
          key: 'bondedToken',
          sortable: true,
          sortMethod: this.sortMethodSplit('bondedToken'),
          className: 'text_right'
        },
        {
          title: 'Self_Bonded',
          key: 'selfBond',
          sortable: true,
          sortMethod: this.sortMethodSplit('selfBond'),
          className: 'text_right'
        },
        {
          title: 'Delegators',
          key: 'delegatorNum',
          sortable: true,
          sortMethod: this.sortMethodNumber('delegatorNum'),
          className: 'text_right'
        },
        {
          title: 'Bond_Height',
          key: 'bondHeight',
          sortable: true,
          sortMethod: this.sortMethodNumber('bondHeight'),
          className: 'text_right'
        },
        {
          title: 'Unbonding_Height',
          key: 'unbondingHeight',
          sortable: true,
          sortMethod: this.sortMethodNumber('unbondingHeight'),
          className: 'text_right'
        }
      ]
    }
  },
  methods: {
    sortMethodPer (key) {
      return (a, b) => Number(a[key].split('%')[0]) - Number(b[key].split('%')[0]);
    },
    sortMethodNumber (key) {
      return (a, b) => Number(a[key]) - Number(b[key]);
    },
    sortMethodSplit (key) {
      return (a, b) => Number(a[key].replace(/\,/g, '').split(' ')[0]) - Number(b[key].replace(/\,/g, '').split(' ')[0]);
    },
    formatAddress (address) {
      return Tools.formatValidatorAddress(address);
    },
    setValidatorField (status) {
      switch (status) {
        case 'validator':
          this.validatorFields = this.activeValidatorFields;
          break;
        case 'candidate':
          this.validatorFields = this.candidateValidatorFields;
          break;
        case 'jailed':
          this.validatorFields = this.jailedValidatorFields;
          break;
      }
    }
  },
  mounted () {
    this.validatorFields = this.activeValidatorFields;
  }
}
</script>

<style lang="scss">
.operator_address_style{
  font-family: "Consolas","Arial",-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
</style>
