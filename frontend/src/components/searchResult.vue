<template>
    <div class="search_result_detail_wrap">
        <div class="search_result_title_wrap">
            <p :class="searchResultDetailWrap" style="margin-bottom:0;">
                <span class="search_result_detail_title">Search Results</span>
                <span class="search_result_detail_wrap_hash_var"><span class="title_for" v-show="flshowTitle">for </span>   {{Object.keys(this.$route.query)[0]}}</span>
            </p>
        </div>
        <div :class="searchResultDetailWrap">
            <div v-show="!flshowResult">
                <p class="transaction_information_content_title">Block</p>
                <div class="block_content_container">
                    <p  class="block_height_container">
                        <span>Height:</span>
                        <span><router-link :to="`/block/${blockHeight}`" style="color: #3598db !important;">{{blockHeight}}</router-link></span>
                    </p>
                    <p class="block_time_container">
                        <span>Timestamp</span>
                        <span>{{blockTime}}</span>
                    </p>
                    <p class="block_hash_container">
                        <span>Block Hash</span>
                        <span class="block_hash">
              <span>{{blockHash}}</span>
            </span>
                    </p>
                </div>
                <p class="transaction_information_content_title proposal_title">Proposal</p>
                <div class="proposal_content_container">
                    <p class="proposal_id_container">
                        <span>Proposal id :</span>
                        <span><router-link :to="`/ProposalsDetail/${proposalId}`" style="color: #3598db !important;">{{proposalId}}</router-link></span>
                    </p>
                    <p class="proposal_title_container">
                        <span>Title :</span>
                        <span>{{proposalTitle}}</span>
                    </p>
                    <p class="proposal_type_container">
                        <span>Type :</span>
                        <span>{{proposalType}}</span>
                    </p>
                    <p class="proposal_status_container">
                        <span>Status :</span>
                        <span>{{proposalStatus}}</span>
                    </p>
                    <p class="proposal_time_container">
                        <span>Submit Time :</span>
                        <span>{{proposalTime}}</span>
                    </p>
                </div>
            </div>
            <div class="result_container" v-show="flshowResult">
                <div class="result_content_container">
                    <div class="result_img">
                        <img src="../assets/resultless.png">
                    </div>
                    <p class="result_title">There is no valid result.</p>
                    <p class="try_info">Try to search with Address, Transaction, Block Number, Proposal ID.</p>
                    <div class="back_home_btn" @click="backHome">
                        <span>Back Home</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

	import Tools from '../util/Tools';
	import Service from "../service"

	export default {
		name: "searchResult",
		data() {
			return {
				flshowResult: true,
				blockHeight: "",
				blockTime: "",
				blockHash: "",
				proposalId: "",
				proposalTitle: "",
				proposalType: "",
				proposalStatus: "",
				proposalTime: "",
				flshowTitle: false,
			}
		},
		watch:{
			$route(){
				if(this.$route.path === "/searchResult"){
					this.flshowTitle = false;
				}else {
					this.flshowTitle = true;
				}
				if(/^\+?[1-9][0-9]*$/.test(Object.keys(this.$route.query)[0])){
					this.flshowResult = false;
					this.searchResult(Object.keys(this.$route.query)[0])
				}else {
					this.flshowResult = true;
				}
			}
		},
		mounted(){
			if(this.$route.path === "/searchResult"){
				this.flshowTitle = true;
			}else {
				this.flshowTitle = false
			}
			if(/^\+?[1-9][0-9]*$/.test(Object.keys(this.$route.query)[0])){
				this.flshowResult = false;
				this.searchResult(Object.keys(this.$route.query)[0])
			}else {
				this.flshowResult = true;
			}
		},
		methods:{
			backHome(){
				this.$router.push("/home")
			},
			searchResult(searchValue){
				let that = this;
				Service.commonInterface({searchResult:{searchValue:searchValue}}, (searchResult) => {
					try {
						that.flshowResult = false;
						if(searchResult){
							Object.entries(searchResult).forEach((item) => {
								let [type, value] = item;
								if(type === "block"){
									that.blockHeight = value.height;
									that.blockTime = Tools.format2UTC(value.timestamp);
									that.blockHash = value.hash;
								}else if(type === "proposal"){
									that.proposalId = value.proposal_id;
									that.proposalTitle = value.title;
									that.proposalType = value.type;
									that.proposalStatus = value.status;
									that.proposalTime = value.submit_time && Tools.format2UTC(value.submit_time)
								}
							})
						}else {
							that.flshowResult = true;
						}
					}catch (e) {
                        console.error(e)
					}
				})
			}
		},
		beforeMount() {
			if (Tools.currentDeviceIsPersonComputer()) {
				this.searchResultDetailWrap = 'personal_computer_search_result_detail_wrap';
			} else {
				this.searchResultDetailWrap = 'mobile_search_result_detail_wrap';
			}
		},

	}
</script>

<style lang="scss" scoped>
    @import "../style/mixin";
    .search_result_detail_wrap{
        width: 100%;
        .search_result_title_wrap{
            width: 100%;
            border-bottom: 0.01rem solid #d6d9e0;
            background: #efeff1;
            .personal_computer_search_result_detail_wrap{
                max-width: 12.8rem;
                margin: 0 auto;
                height: 0.62rem;
                display: flex;
                align-items: center;
                .search_result_detail_title{
                    font-size: 0.22rem;
                    padding-left: 0.2rem;
                    color: #000;
                    margin-right: 0.2rem;
                }
                .search_result_detail_wrap_hash_var{

                    font-size: 0.22rem;
                    color: #a2a2ae;
                }
            }
            .mobile_search_result_detail_wrap{
                max-width: 12.8rem;
                margin: 0 auto;
                height: 0.62rem;
                display: flex;
                align-items: center;
            }
        }
        .result_content_container{
            width: 100%;
            text-align: center;
            margin-top: 1.1rem;
            .result_img{
                margin: 0 auto;
                width: 1rem;
                height: 1rem;
                img{
                    width: 100%;
                }
            }
            .result_title{
                margin-top: 0.2rem;
                color: #000;
                font-size: 0.18rem;
            }
            .try_info{
                font-size: 0.14rem;
                color: #A2A2AE;
                margin-bottom: 0.44rem !important;
            }
            .back_home_btn{
                width: 1.58rem;
                height: 0.36rem;
                margin: 0 auto;
                background: #3498DB;
                border-radius: 0.05rem;
                color: #fff;
                font-size: 0.14rem;
                line-height: 0.36rem
            }
        }
        .personal_computer_search_result_detail_wrap{
            max-width: 12.8rem;
            margin: 0 auto;
            margin-top: 0.27rem;
            .transaction_information_content_title{
                padding-left: 0.2rem;
                padding-bottom: 0.2rem;
                border-bottom: 0.01rem solid #d7d9e0;
            }
        }
    }
    .block_content_container{
        margin-left: 0.2rem;
        .block_height_container{
            margin-top: 0.2rem;
            line-height: 1;
            span:nth-child(1){
                display: inline-block;
                text-align: left;
                width: 1.3rem;
                @include fontSize;
            }
            span:nth-child(2){
                text-align: left;
                color: #3598db;
                cursor: pointer;
            }
        }
        .block_time_container{
            margin-top: 0.08rem;
            span:nth-child(1){
                display: inline-block;
                line-height: 1;
                text-align: left;
                width: 1.3rem;
                @include fontSize;

            }
            span:nth-child(2){
                text-align: left;
                color: #A2A2AE;
            }
        }
        .block_hash_container{
            line-height: 1;
            margin-top: 0.08rem;
            span:nth-child(1){
                display: inline-block;
                text-align: left;
                width: 1.3rem;
                @include fontSize;
            }
            span:nth-child(2){
                text-align: left;
                color: #A2A2AE;
            }
        }
    }
    .proposal_content_container{
        margin-top: 0.21rem;
        margin-left: 0.2rem;
        .proposal_id_container{
            line-height: 1;
            span:nth-child(1){
                display: inline-block;
                width: 1.3rem;
                text-align: left;
                @include fontSize;
            }
            span:nth-child(2){
                color: #3598db;
                cursor: pointer;
            }
        }
        .proposal_title_container{
            line-height: 1;
            margin-top: 0.08rem;
            span:nth-child(1){
                display: inline-block;
                line-height: 1;
                text-align: left;
                width: 1.3rem;
                @include fontSize;

            }
            span:nth-child(2){
                text-align: left;
                color: #A2A2AE;
            }
        }
        .proposal_type_container{
            line-height: 1;
            margin-top: 0.08rem;
            span:nth-child(1){
                display: inline-block;
                line-height: 1;
                text-align: left;
                width: 1.3rem;
                @include fontSize;

            }
            span:nth-child(2){
                text-align: left;
                color: #A2A2AE;
            }
        }
        .proposal_status_container{
            line-height: 1;
            margin-top: 0.08rem;
            span:nth-child(1){
                display: inline-block;
                line-height: 1;
                text-align: left;
                width: 1.3rem;
                @include fontSize;

            }
            span:nth-child(2){
                text-align: left;
                color: #A2A2AE;
            }
        }
        .proposal_time_container{
            line-height: 1;
            margin-top: 0.08rem;
            span:nth-child(1){
                display: inline-block;
                line-height: 1;
                text-align: left;
                width: 1.3rem;
                @include fontSize;

            }
            span:nth-child(2){
                text-align: left;
                color: #A2A2AE;
            }
        }
    }
    .proposal_title{
        margin-top: 0.27rem;
    }
    .mobile_search_result_detail_wrap{
        .proposal_content_container{
            margin-bottom: 0.2rem;
        }
        .result_content_container{
            margin-top: 0.8rem!important;
            margin-bottom: 1.6rem !important;
        }
        .block_content_container{
            .block_hash_container{
                .block_hash{
                    width: 100%;
                    display: inline-block;
                    overflow-x: auto;
                    webkit-overflow-scrolling: touch
                }
            }
        }
    }
    .title_for{
        padding-right: 0.05rem;
    }
</style>
