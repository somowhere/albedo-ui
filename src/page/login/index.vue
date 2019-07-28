<template>
  <div class="login-container"
       @keyup.enter.native="handleLogin">
    <div class="login-weaper  animated bounceInDown">
      <div class="login-left">
        <img class="img"
             src="/img/logo.png"
             alt="">
        <p class="title">{{website.infoTitle}}</p>
        <p>©2019 v2.3.0</p>
      </div>
      <div class="login-border">
        <div class="login-main">
          <userLogin v-if="activeName==='user'"></userLogin>
          <div class="login-menu">
            <a href="http://albedo-gateway:9999/swagger-ui.html" target="_blank">swagger api</a>
            <a href="http://localhost:5002/zipkin/" target="_blank">zipkin</a>
            <a href="http://localhost:5001" target="_blank">monitor</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import '@/styles/login.scss'
  import userLogin from "./userlogin";
  import {mapGetters} from "vuex";
  import {getStore, setStore} from "@/util/store";
  import {dateFormat} from "@/util/date";
  import {validateNull} from "@/util/validate";

  export default {
    name: "login",
    components: {
      userLogin
    },
    data() {
      return {
        activeName: "user"
      };
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["website"])
    },
    props: [],
    methods: {}
  };
</script>

